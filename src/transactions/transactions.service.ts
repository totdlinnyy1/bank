import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { GetSingleTransactionDto } from './dtos/getSingleTransactionDto'
import { GetTransactionsDto } from './dtos/getTransactions.dto'
import { TransactionEntity } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
    private readonly _logger: Logger = new Logger(TransactionsService.name)

    constructor(
        @InjectRepository(TransactionEntity)
        private readonly _transactionsRepository: Repository<TransactionEntity>,
    ) {}

    // Function to receive all wallet transactions
    async transactions(
        getTransactionsData: GetTransactionsDto,
    ): Promise<TransactionEntity[]> {
        this._logger.debug('START GET TRANSACTIONS BY WALLET ID')
        this._logger.debug({ getTransactionsData })

        const trans = await this._transactionsRepository.find({
            walletId: getTransactionsData.walletId,
        })
        this._logger.debug({ trans })

        this._logger.debug('RETURN TRANSACTIONS')
        return trans
    }

    // Function to receive one wallet transaction
    async transaction(
        getTransactionData: GetSingleTransactionDto,
    ): Promise<TransactionEntity> {
        this._logger.debug('START GET TRANSACTION BY WALLET ID')
        this._logger.debug({ getTransactionData })

        this._logger.debug('CHECK IF TRANSACTION EXIST')
        const candidate = await this._transactionsRepository.findOne({
            id: getTransactionData.transactionId,
            walletId: getTransactionData.walletId,
        })
        this._logger.debug({ candidate })

        if (!candidate) {
            this._logger.debug('TRANSACTION DOES NOT EXIST')
            throw new NotFoundException(
                'This wallet or transaction does not exist.',
            )
        }

        this._logger.debug('RETURN TRANSACTION')
        return candidate
    }
}
