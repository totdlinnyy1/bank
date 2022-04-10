import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import {
    TransactionsEntity,
    TransactionsType,
} from '../entities/transactions.entity'
import { WalletsEntity } from '../entities/wallets.entity'
import { CreateTransactionsDto } from '../transactions/dto/createTransactions.dto'

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(WalletsEntity)
        private readonly _walletsRepository: Repository<WalletsEntity>,
        @InjectRepository(TransactionsEntity)
        private readonly _transactionRepository: Repository<TransactionsEntity>,
    ) {}

    // The function creates a wallet
    async create(): Promise<WalletsEntity> {
        return await this._walletsRepository.save({})
    }

    // The function will get all wallets
    async wallets(): Promise<WalletsEntity[]> {
        return await this._walletsRepository.find({
            relations: ['transactions', 'inputTransactions'],
            where: { isClosed: false },
        })
    }

    // The function will get the wallet by its id
    async wallet(id: number): Promise<WalletsEntity> {
        const candidate = await this._walletsRepository.findOne({
            relations: ['transactions', 'inputTransactions'],
            where: { id, isClosed: false },
        })

        if (candidate) {
            return candidate
        }

        throw new Error('This wallet does not exist or is closed.')
    }

    // The function closes the wallet by its id
    async close(id: number): Promise<string> {
        const candidate = await this._walletsRepository.findOne({
            id,
            isClosed: false,
        })

        if (candidate) {
            await this._walletsRepository.update({ id }, { isClosed: true })
            return 'The wallet is closed.'
        }

        throw new Error('This wallet does not exist or is already closed.')
    }

    // The function puts money in the wallet
    async deposit(data: CreateTransactionsDto): Promise<TransactionsEntity> {
        await this.changeMoneyAmount({
            walletId: data.walletId,
            money: data.money,
            type: TransactionsType.DEPOSIT,
        })

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsType.DEPOSIT,
            ...data,
        })
    }

    // The function withdraws money from the wallet
    async withdraw(data: CreateTransactionsDto): Promise<TransactionsEntity> {
        await this.changeMoneyAmount({
            walletId: data.walletId,
            money: data.money,
            type: TransactionsType.WITHDRAW,
        })

        // Saving a transaction
        return await this._transactionRepository.save({
            type: TransactionsType.WITHDRAW,
            ...data,
        })
    }

    // This function, depending on the operation, performs actions with money on the wallet
    async changeMoneyAmount(data: CreateTransactionsDto): Promise<void> {
        // Checking if the correct amount of money has been entered
        if (data.money <= 0) {
            throw new Error('The amount must be greater than 0.')
        }

        const wallet = await this.wallet(data.walletId)
        let outputWallet: WalletsEntity | null = null

        switch (data.type) {
            // If the operation is "deposit", then money is put into the wallet
            case TransactionsType.DEPOSIT:
                await this._walletsRepository.update(
                    { id: data.walletId },
                    { money: wallet.money + data.money },
                )
                break
            // If the operation is "withdrawal", then money is withdrawn from the wallet
            case TransactionsType.WITHDRAW:
                // Checking if there is enough money in the wallet
                if (data.money <= wallet.money) {
                    await this._walletsRepository.update(
                        { id: data.walletId },
                        { money: wallet.money - data.money },
                    )
                } else {
                    throw new Error('Insufficient funds to withdraw.')
                }
                break
            // If the operation is a "transaction", then the money is transferred from one wallet to another
            case TransactionsType.TRANSACTION:
                // Checking if there is enough money in the wallet
                if (data.money <= wallet.money && data.outputWalletId) {
                    outputWallet = await this.wallet(data.outputWalletId)
                    // Withdrawing money from the sender's wallet
                    await this._walletsRepository.update(
                        { id: data.walletId },
                        { money: wallet.money - data.money },
                    )
                    // Deposit money to the receiving wallet
                    await this._walletsRepository.update(
                        { id: data.outputWalletId },
                        { money: outputWallet.money + data.money },
                    )
                } else {
                    throw new Error('Insufficient funds to transaction.')
                }
                break
            default:
                throw new Error('Specify the transaction type.')
        }
    }
}
