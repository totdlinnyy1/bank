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

    async create(): Promise<WalletsEntity> {
        return await this._walletsRepository.save({})
    }

    async wallets(): Promise<WalletsEntity[]> {
        return await this._walletsRepository.find({
            relations: ['transactions', 'inputTransactions'],
            where: { isClosed: false },
        })
    }

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

    async deposit(data: CreateTransactionsDto): Promise<TransactionsEntity> {
        await this.changeMoneyAmount({
            walletId: data.walletId,
            money: data.money,
            type: TransactionsType.DEPOSIT,
        })

        return await this._transactionRepository.save({
            type: TransactionsType.DEPOSIT,
            ...data,
        })
    }

    async withdraw(data: CreateTransactionsDto): Promise<TransactionsEntity> {
        await this.changeMoneyAmount({
            walletId: data.walletId,
            money: data.money,
            type: TransactionsType.WITHDRAW,
        })

        return await this._transactionRepository.save({
            type: TransactionsType.WITHDRAW,
            ...data,
        })
    }

    async changeMoneyAmount(data: CreateTransactionsDto): Promise<void> {
        if (data.money <= 0) {
            throw new Error('The amount must be greater than 0.')
        }

        const wallet = await this.wallet(data.walletId)
        let outputWallet: WalletsEntity | null = null

        switch (data.type) {
            case TransactionsType.DEPOSIT:
                await this._walletsRepository.update(
                    { id: data.walletId },
                    { money: wallet.money + data.money },
                )
                break
            case TransactionsType.WITHDRAW:
                if (data.money <= wallet.money) {
                    await this._walletsRepository.update(
                        { id: data.walletId },
                        { money: wallet.money - data.money },
                    )
                } else {
                    throw new Error('Insufficient funds to withdraw.')
                }
                break
            case TransactionsType.TRANSACTION:
                if (data.money <= wallet.money && data.outputWalletId) {
                    outputWallet = await this.wallet(data.outputWalletId)
                    await this._walletsRepository.update(
                        { id: data.walletId },
                        { money: wallet.money - data.money },
                    )
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
