import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { isMoneyEnoughToWithdraw } from '../helpers/isMoneyEnoughToWithdraw'
import { isMoneyMoreThenZero } from '../helpers/isMoneyMoreThenZero'
import { TransactionsTypeEnum } from '../helpers/transactionsType.enum'
import { Transaction } from '../transactions/transaction.entity'

import { CloseWalletDto } from './dto/closeWallet.dto'
import { CreateWalletDto } from './dto/createWallet.dto'
import { GetWalletDto } from './dto/getWallet.dto'
import { LockWalletDto } from './dto/lockWallet.dto'
import { MakeDepositDto } from './dto/makeDeposit.dto'
import { MakeTransactionDto } from './dto/makeTransaction.dto'
import { MakeWithdrawDto } from './dto/makeWithdraw.dto'
import { Wallet } from './wallet.entity'

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallet)
        private readonly _walletsRepository: Repository<Wallet>,
        @InjectRepository(Transaction)
        private readonly _transactionRepository: Repository<Transaction>,
    ) {}

    // The function creates a wallet
    async create(createWalletData: CreateWalletDto): Promise<Wallet> {
        const wallet = await this._walletsRepository.save({
            ownerId: createWalletData.ownerId,
        })
        return await this.wallet({ walletId: wallet.id })
    }

    // The function will get all wallets
    async wallets(): Promise<Wallet[]> {
        return await this._walletsRepository.find({
            relations: ['transactions', 'inputTransactions'],
            where: { isClosed: false },
        })
    }

    // The function will get the wallet by its id
    async wallet(getWalletData: GetWalletDto): Promise<Wallet> {
        const candidate = await this._walletsRepository.findOne({
            relations: ['transactions', 'inputTransactions', 'owner'],
            where: {
                id: getWalletData.walletId,
                isClosed: false,
                isLock: false,
            },
        })

        if (!candidate) {
            throw new Error('This wallet does not exist or is closed')
        }

        return candidate
    }

    // The function closes the wallet by its id
    async close(closeWalletData: CloseWalletDto): Promise<string> {
        const candidate = await this.wallet({
            walletId: closeWalletData.walletId,
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

    async lock(lockWaletData: LockWalletDto): Promise<boolean> {
        const wallets = await this._walletsRepository.find({
            ownerId: lockWaletData.ownerId,
            isClosed: false,
            isLock: false,
        })

        if (!wallets.length) {
            return false
        }

        await this._walletsRepository.update(
            { ownerId: lockWaletData.ownerId, isClosed: false, isLock: false },
            { isLock: true },
        )

        return true
    }

    // The function puts money in the wallet
    async deposit(makeDepositData: MakeDepositDto): Promise<Transaction> {
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
    async withdraw(makeWithdrawData: MakeWithdrawDto): Promise<Transaction> {
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
    ): Promise<Transaction> {
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
