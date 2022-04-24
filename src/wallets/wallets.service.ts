import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { isMoneyEnoughToWithdraw } from '../helpers/isMoneyEnoughToWithdraw'
import { isMoneyMoreThenZero } from '../helpers/isMoneyMoreThenZero'
import { TransactionsTypeEnum } from '../helpers/transactionsType.enum'
import { Transaction } from '../transactions/entities/transaction.entity'
import { User } from '../users/entities/user.entity'

import { CloseWalletDto } from './dtos/closeWallet.dto'
import { CreateWalletDto } from './dtos/createWallet.dto'
import { GetSingleWalletDto } from './dtos/getSingleWallet.dto'
import { LockWalletDto } from './dtos/lockWallet.dto'
import { MakeDepositDto } from './dtos/makeDeposit.dto'
import { MakeTransactionDto } from './dtos/makeTransaction.dto'
import { MakeWithdrawDto } from './dtos/makeWithdraw.dto'
import { Wallet } from './entities/wallet.entity'

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(Wallet)
        private readonly _walletsRepository: Repository<Wallet>,
        @InjectRepository(Transaction)
        private readonly _transactionRepository: Repository<Transaction>,
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
    ) {}

    // The function creates a wallet
    async create(createWalletData: CreateWalletDto): Promise<Wallet> {
        const user = await this._userRepository.findOne({
            id: createWalletData.ownerId,
        })

        // Checking for the existence of a user
        if (!user) {
            throw new Error('This user does not exist')
        }

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
    async wallet(getWalletData: GetSingleWalletDto): Promise<Wallet> {
        const candidate = await this._walletsRepository.findOne({
            relations: ['transactions', 'inputTransactions', 'owner'],
            where: {
                id: getWalletData.walletId,
                isClosed: false,
                isLock: false,
            },
        })

        // Checking for the existence of a wallet
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

    // The function blocks wallets
    async lock(lockWalletData: LockWalletDto): Promise<boolean> {
        const wallets = await this._walletsRepository.find({
            ownerId: lockWalletData.ownerId,
            isClosed: false,
            isLock: false,
        })

        if (!wallets.length) {
            return false
        }

        await this._walletsRepository.update(
            { ownerId: lockWalletData.ownerId, isClosed: false, isLock: false },
            { isLock: true },
        )

        return true
    }

    // The function puts money in the wallet
    async deposit(makeDepositData: MakeDepositDto): Promise<Transaction> {
        // Checking the correctness of the entered money
        if (!isMoneyMoreThenZero(makeDepositData.money)) {
            throw new Error('Money must be more than 0')
        }

        const wallet = await this.wallet({ walletId: makeDepositData.walletId })

        await this._walletsRepository.update(
            { id: makeDepositData.walletId },
            { incoming: wallet.incoming + makeDepositData.money },
        )

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.DEPOSIT,
            ...makeDepositData,
        })
    }

    // The function withdraws money from the wallet
    async withdraw(makeWithdrawData: MakeWithdrawDto): Promise<Transaction> {
        // Checking the correctness of the entered money
        if (!isMoneyMoreThenZero(makeWithdrawData.money)) {
            throw new Error('Money must be more than 0')
        }

        const wallet = await this.wallet({
            walletId: makeWithdrawData.walletId,
        })

        // Checking if there is enough money on the balance
        if (
            !isMoneyEnoughToWithdraw({
                walletBalance: wallet.actualBalance,
                withdrawMoney: makeWithdrawData.money,
            })
        ) {
            throw new Error('Insufficient funds to withdraw.')
        }

        await this._walletsRepository.update(
            { id: makeWithdrawData.walletId },
            { outgoing: wallet.outgoing + makeWithdrawData.money },
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
        // Checking the correctness of the entered money
        if (!isMoneyMoreThenZero(makeTransactionData.money)) {
            throw new Error('Money must be more than 0')
        }

        // Self-translation check
        if (
            makeTransactionData.fromWalletId === makeTransactionData.toWalletId
        ) {
            throw new Error('You cannot make a transaction to yourself')
        }

        const fromWallet = await this.wallet({
            walletId: makeTransactionData.fromWalletId,
        })

        // Checking if there is enough money on the balance
        if (
            !isMoneyEnoughToWithdraw({
                walletBalance: fromWallet.actualBalance,
                withdrawMoney: makeTransactionData.money,
            })
        ) {
            throw new Error('Insufficient funds to transaction.')
        }

        const toWallet = await this.wallet({
            walletId: makeTransactionData.toWalletId,
        })

        // Withdrawing money from the sender's wallet
        await this._walletsRepository.update(
            { id: makeTransactionData.fromWalletId },
            { outgoing: fromWallet.outgoing + makeTransactionData.money },
        )

        // Deposit money to the receiving wallet
        await this._walletsRepository.update(
            { id: makeTransactionData.toWalletId },
            { incoming: toWallet.incoming + makeTransactionData.money },
        )

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.TRANSACTION,
            walletId: makeTransactionData.fromWalletId,
            toWalletId: makeTransactionData.toWalletId,
            money: makeTransactionData.money,
        })
    }
}
