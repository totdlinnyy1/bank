import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionsEntity } from '../entities/transactions.entity'
import { Repository } from 'typeorm'
import { CreateTransactionsDto } from './dto/createTransactions.dto'
import { WalletsService } from '../wallets/wallets.service'
import { GetTransactionsDto } from './dto/getTransactionsDto'

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionsEntity)
        private readonly _transactionsRepository: Repository<TransactionsEntity>,
        private readonly _walletService: WalletsService,
    ) {}

    async create(
        createData: CreateTransactionsDto,
    ): Promise<TransactionsEntity> {
        const update = await this._walletService.updateMoney({
            walletId: createData.walletId,
            money: createData.money,
            deposit: createData.deposit,
        })

        if (update) {
            return await this._transactionsRepository.save({
                walletId: createData.walletId,
                money: createData.money,
            })
        }

        throw new Error('Insufficient funds on the account.')
    }

    async transactions(
        getData: GetTransactionsDto,
    ): Promise<TransactionsEntity[]> {
        return await this._transactionsRepository.find({
            walletId: getData.walletId,
        })
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
