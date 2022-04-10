import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import {
    TransactionsEntity,
    TransactionsType,
} from '../entities/transactions.entity'
import { WalletsService } from '../wallets/wallets.service'

import { CreateTransactionsDto } from './dto/createTransactions.dto'
import { GetTransactionsDto } from './dto/getTransactionsDto'

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionsEntity)
        private readonly _transactionsRepository: Repository<TransactionsEntity>,
        private readonly _walletService: WalletsService,
    ) {}

    async save(data: CreateTransactionsDto): Promise<TransactionsEntity> {
        return await this._transactionsRepository.save(data)
    }

    async create(data: CreateTransactionsDto): Promise<TransactionsEntity> {
        await this._walletService.changeMoneyAmount({
            type: TransactionsType.TRANSACTION,
            ...data,
        })
        return await this.save({ type: TransactionsType.TRANSACTION, ...data })
    }

    async transactions(walletId: number): Promise<TransactionsEntity[]> {
        return await this._transactionsRepository.find({ walletId })
    }

    async transaction(
        getData: GetTransactionsDto,
    ): Promise<TransactionsEntity> {
        const candidate = await this._transactionsRepository.findOne({
            id: getData.transactionId,
            walletId: getData.walletId,
        })

        if (candidate) {
            return candidate
        }

        throw new Error('This wallet does not exist.')
    }
}
