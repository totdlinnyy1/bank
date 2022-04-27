import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetSingleTransactionDto } from './dtos/getSingleTransactionDto'
import { GetTransactionsDto } from './dtos/getTransactions.dto'
import { TransactionEntity } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly _transactionsRepository: Repository<TransactionEntity>,
    ) {}

    // Function to receive all wallet transactions
    async transactions(
        getTransactionsData: GetTransactionsDto,
    ): Promise<TransactionEntity[]> {
        return await this._transactionsRepository.find({
            walletId: getTransactionsData.walletId,
        })
    }

    // Function to receive one wallet transaction
    async transaction(
        getTransactionData: GetSingleTransactionDto,
    ): Promise<TransactionEntity> {
        const candidate = await this._transactionsRepository.findOne({
            id: getTransactionData.transactionId,
            walletId: getTransactionData.walletId,
        })

        if (candidate) {
            return candidate
        }

        throw new NotFoundException(
            'This wallet or transaction does not exist.',
        )
    }
}
