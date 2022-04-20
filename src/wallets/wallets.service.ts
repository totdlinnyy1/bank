import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { isMoneyEnoughToWithdraw } from '../helpers/isMoneyEnoughToWithdraw'
import { isMoneyMoreThenZero } from '../helpers/isMoneyMoreThenZero'
import { TransactionsTypeEnum } from '../helpers/transactionsType.enum'
import { Transactions } from '../transactions/transactions.entity'

import { CloseWalletDto } from './dto/closeWallet.dto'
import { GetWalletDto } from './dto/getWallet.dto'
import { MakeDepositDto } from './dto/makeDeposit.dto'
import { MakeTransactionDto } from './dto/makeTransaction.dto'
import { MakeWithdrawDto } from './dto/makeWithdraw.dto'
import { Wallets } from './wallets.entity'

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallets)
        private readonly _walletsRepository: Repository<Wallets>,
        @InjectRepository(Transactions)
        private readonly _transactionRepository: Repository<Transactions>,
    ) {}

    // The function creates a wallet
    async create(): Promise<Wallets> {
        const wallet = await this._walletsRepository.save({})
        return await this.wallet({ walletId: wallet.id })
    }

    // The function will get all wallets
    async wallets(): Promise<Wallets[]> {
        return await this._walletsRepository.find({
            relations: ['transactions', 'inputTransactions'],
            where: { isClosed: false },
        })
    }

    // The function will get the wallet by its id
    async wallet(getWalletData: GetWalletDto): Promise<Wallets> {
        const candidate = await this._walletsRepository.findOne({
            relations: ['transactions', 'inputTransactions'],
            where: { id: getWalletData.walletId, isClosed: false },
        })

        if (candidate) {
            return candidate
        }

        throw new Error('This wallet does not exist or is closed.')
    }

    // The function closes the wallet by its id
    async close(closeWalletData: CloseWalletDto): Promise<string> {
        const candidate = await this._walletsRepository.findOne({
            id: closeWalletData.walletId,
            isClosed: false,
        })

        if (candidate) {
            await this._walletsRepository.update(
                { id: closeWalletData.walletId },
                { isClosed: true },
            )
            return 'The wallet is closed.'
        }

        throw new Error('This wallet does not exist or is already closed.')
    }

    // The function puts money in the wallet
    async deposit(makeDepositData: MakeDepositDto): Promise<Transactions> {
        if (!isMoneyMoreThenZero(makeDepositData.money)) {
            throw new Error('Money must be more than 0')
        }

        const wallet = await this.wallet({ walletId: makeDepositData.walletId })

        await this._walletsRepository.update(
            { id: makeDepositData.walletId },
            { balance: wallet.balance + makeDepositData.money },
        )

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.DEPOSIT,
            ...makeDepositData,
        })
    }

    // The function withdraws money from the wallet
    async withdraw(makeWithdrawData: MakeWithdrawDto): Promise<Transactions> {
        if (!isMoneyMoreThenZero(makeWithdrawData.money)) {
            throw new Error('Money must be more than 0')
        }

        const wallet = await this.wallet({
            walletId: makeWithdrawData.walletId,
        })

        if (
            !isMoneyEnoughToWithdraw({
                walletBalance: wallet.balance,
                withdrawMoney: makeWithdrawData.money,
            })
        ) {
            throw new Error('Insufficient funds to withdraw.')
        }

        await this._walletsRepository.update(
            { id: makeWithdrawData.walletId },
            { balance: wallet.balance - makeWithdrawData.money },
        )

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.WITHDRAW,
            ...makeWithdrawData,
        })
    }

    // The function of creating a transaction between wallets
    async transaction(
        makeTransactionData: MakeTransactionDto,
    ): Promise<Transactions> {
        if (!isMoneyMoreThenZero(makeTransactionData.money)) {
            throw new Error('Money must be more than 0')
        }

        if (
            makeTransactionData.outputWalletId ===
            makeTransactionData.inputWalletId
        ) {
            throw new Error('You cannot make a transaction to yourself')
        }

        const outputWallet = await this.wallet({
            walletId: makeTransactionData.outputWalletId,
        })
        if (
            !isMoneyEnoughToWithdraw({
                walletBalance: outputWallet.balance,
                withdrawMoney: makeTransactionData.money,
            })
        ) {
            throw new Error('Insufficient funds to transaction.')
        }
        const inputWallet = await this.wallet({
            walletId: makeTransactionData.inputWalletId,
        })

        // Withdrawing money from the sender's wallet
        await this._walletsRepository.update(
            { id: makeTransactionData.outputWalletId },
            { balance: outputWallet.balance - makeTransactionData.money },
        )
        // Deposit money to the receiving wallet
        await this._walletsRepository.update(
            { id: makeTransactionData.inputWalletId },
            { balance: inputWallet.balance + makeTransactionData.money },
        )

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.TRANSACTION,
            walletId: makeTransactionData.outputWalletId,
            inputWalletId: makeTransactionData.inputWalletId,
            money: makeTransactionData.money,
        })
    }
}
