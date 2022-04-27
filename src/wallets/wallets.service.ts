import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'

import { TransactionsTypeEnum } from '../enums/transactionsType.enum'
import { isMoneyEnoughToWithdraw } from '../helpers/isMoneyEnoughToWithdraw'
import { TransactionEntity } from '../transactions/entities/transaction.entity'
import { UserEntity } from '../users/entities/user.entity'

import { CreateWalletDto } from './dtos/createWallet.dto'
import { DepositOrWithdrawDto } from './dtos/depositOrWithdraw.dto'
import { LockWalletDto } from './dtos/lockWallet.dto'
import { MakeTransactionDto } from './dtos/makeTransaction.dto'
import { WalletEntity } from './entities/wallet.entity'

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(WalletEntity)
        private readonly _walletsRepository: Repository<WalletEntity>,
        @InjectRepository(TransactionEntity)
        private readonly _transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        private _connection: Connection,
    ) {}

    // The function creates a wallet
    async create(createWalletData: CreateWalletDto): Promise<WalletEntity> {
        const user = await this._userRepository.findOne({
            id: createWalletData.ownerId,
        })

        // Checking for the existence of a user
        if (!user) {
            throw new NotFoundException('This user does not exist')
        }

        const wallet = await this._walletsRepository.save({
            ownerId: createWalletData.ownerId,
        })

        return await this.wallet(wallet.id)
    }

    // The function will get all wallets
    async wallets(): Promise<WalletEntity[]> {
        return await this._walletsRepository.find({
            relations: ['transactions', 'inputTransactions'],
            where: { isClosed: false, isLock: false },
        })
    }

    // The function will get the wallet by its id
    async wallet(id: string): Promise<WalletEntity> {
        const candidate = await this._walletsRepository.findOne({
            relations: ['transactions', 'inputTransactions', 'owner'],
            where: {
                id,
                isClosed: false,
                isLock: false,
            },
        })

        // Checking for the existence of a wallet
        if (!candidate) {
            throw new NotFoundException(
                'This wallet does not exist or is closed',
            )
        }

        return candidate
    }

    // The function closes the wallet by its id
    async close(id: string): Promise<string> {
        const candidate = await this.wallet(id)

        if (!candidate) {
            throw new NotFoundException(
                'This wallet does not exist or is already closed',
            )
        }

        await this._walletsRepository.update({ id }, { isClosed: true })
        return 'The wallet is closed'
    }

    // The function locks wallets
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
    async deposit(
        makeDepositData: DepositOrWithdrawDto,
    ): Promise<TransactionEntity> {
        const queryRunner = this._connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('READ COMMITTED')

        try {
            const wallet = await queryRunner.manager.findOne(WalletEntity, {
                id: makeDepositData.id,
                isClosed: false,
                isLock: false,
            })

            // Checking for the existence of a wallet
            if (!wallet) {
                throw new NotFoundException(
                    'The wallet does not exist or is closed',
                )
            }

            await queryRunner.manager.update(
                WalletEntity,
                { id: makeDepositData.id },
                { incoming: () => `incoming + ${makeDepositData.money}` },
            )

            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err
        } finally {
            await queryRunner.release()
        }

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.DEPOSIT,
            walletId: makeDepositData.id,
            money: makeDepositData.money,
        })
    }

    // The function withdraws money from the wallet
    async withdraw(
        makeWithdrawData: DepositOrWithdrawDto,
    ): Promise<TransactionEntity> {
        const queryRunner = this._connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('READ COMMITTED')

        try {
            const wallet = await queryRunner.manager.findOne(WalletEntity, {
                id: makeWithdrawData.id,
                isClosed: false,
                isLock: false,
            })

            // Checking for the existence of a wallet
            if (!wallet) {
                throw new NotFoundException(
                    'The wallet does not exist or is closed',
                )
            }

            // Checking if there is enough money on the balance
            if (
                !isMoneyEnoughToWithdraw({
                    walletBalance: wallet.actualBalance,
                    withdrawMoney: makeWithdrawData.money,
                })
            ) {
                throw new BadRequestException('Insufficient funds to withdraw')
            }

            await queryRunner.manager.update(
                WalletEntity,
                { id: makeWithdrawData.id },
                { outgoing: () => `outgoing + ${makeWithdrawData.money}` },
            )

            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err
        } finally {
            await queryRunner.release()
        }

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.WITHDRAW,
            walletId: makeWithdrawData.id,
            money: makeWithdrawData.money,
        })
    }

    // The function of creating a transaction between wallets
    async transaction(
        makeTransactionData: MakeTransactionDto,
    ): Promise<TransactionEntity> {
        // Self-translation check
        if (
            makeTransactionData.fromWalletId === makeTransactionData.toWalletId
        ) {
            throw new BadRequestException(
                'You cannot make a transaction to yourself',
            )
        }

        const queryRunner = this._connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('READ COMMITTED')

        try {
            const fromWallet = await queryRunner.manager.findOne(WalletEntity, {
                id: makeTransactionData.fromWalletId,
                isClosed: false,
                isLock: false,
            })

            const toWallet = await queryRunner.manager.findOne(WalletEntity, {
                id: makeTransactionData.toWalletId,
                isClosed: false,
                isLock: false,
            })

            // Checking for the existence of a wallet
            if (!fromWallet) {
                throw new NotFoundException(
                    "The sender's wallet does not exist or is closed",
                )
            }

            // Checking for the existence of a wallet
            if (!toWallet) {
                throw new NotFoundException(
                    "The recipient's wallet does not exist or is closed",
                )
            }

            // Checking if there is enough money on the balance
            if (
                !isMoneyEnoughToWithdraw({
                    walletBalance: fromWallet.actualBalance,
                    withdrawMoney: makeTransactionData.money,
                })
            ) {
                throw new BadRequestException(
                    'Insufficient funds to transaction',
                )
            }

            // Withdrawing money from the sender's wallet
            await queryRunner.manager.update(
                WalletEntity,
                { id: makeTransactionData.fromWalletId },
                { outgoing: () => `outgoing + ${makeTransactionData.money}` },
            )

            // Deposit money to the receiving wallet
            await queryRunner.manager.update(
                WalletEntity,
                { id: makeTransactionData.toWalletId },
                { incoming: () => `incoming + ${makeTransactionData.money}` },
            )

            await queryRunner.commitTransaction()
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err
        } finally {
            await queryRunner.release()
        }

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsTypeEnum.TRANSACTION,
            walletId: makeTransactionData.fromWalletId,
            toWalletId: makeTransactionData.toWalletId,
            money: makeTransactionData.money,
        })
    }
}
