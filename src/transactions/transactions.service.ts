import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetSingleTransactionDto } from './dto/getSingleTransactionDto'
import { GetTransactionsDto } from './dto/getTransactions.dto'
import { Transactions } from './transactions.entity'

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transactions)
        private readonly _transactionsRepository: Repository<Transactions>,
    ) {}

    // Function to receive all wallet transactions
    async transactions(
        getTransactionsData: GetTransactionsDto,
    ): Promise<Transactions[]> {
        return await this._transactionsRepository.find({
            walletId: getTransactionsData.walletId,
        })
    }

    // Function to receive one wallet transaction
    async transaction(getData: GetSingleTransactionDto): Promise<Transactions> {
        const candidate = await this._transactionsRepository.findOne({
            id: getData.transactionId,
            walletId: getData.walletId,
        })

        if (candidate) {
            return candidate
        }

        throw new Error('This wallet or transaction does not exist.')
    }
}
