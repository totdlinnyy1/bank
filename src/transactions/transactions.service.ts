import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetSingleTransactionDto } from './dto/getSingleTransactionDto'
import { GetTransactionsDto } from './dto/getTransactions.dto'
import { Transaction } from './transaction.entity'

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly _transactionsRepository: Repository<Transaction>,
    ) {}

    // Function to receive all wallet transactions
    async transactions(
        getTransactionsData: GetTransactionsDto,
    ): Promise<Transaction[]> {
        return await this._transactionsRepository.find({
            walletId: getTransactionsData.walletId,
        })
    }

    // Function to receive one wallet transaction
    async transaction(getData: GetSingleTransactionDto): Promise<Transaction> {
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
