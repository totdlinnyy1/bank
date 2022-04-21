import { Args, Query, Resolver } from '@nestjs/graphql'

import { GetSingleTransactionDto } from './dto/getSingleTransactionDto'
import { GetTransactionsDto } from './dto/getTransactions.dto'
import { TransactionObjectType } from './transaction.objectType'
import { TransactionsService } from './transactions.service'

@Resolver(() => TransactionObjectType)
export class TransactionsResolver {
    constructor(private readonly _transactionsService: TransactionsService) {}

    // Request to receive all wallet transactions
    @Query(() => [TransactionObjectType])
    async transactions(
        @Args('getTransactionsData') getTransactionsData: GetTransactionsDto,
    ): Promise<TransactionObjectType[]> {
        return await this._transactionsService.transactions(getTransactionsData)
    }

    // Request to receive one wallet transaction
    @Query(() => TransactionObjectType)
    async transaction(
        @Args('getSingleTransactionData')
        getSingleTransactionData: GetSingleTransactionDto,
    ): Promise<TransactionObjectType> {
        return await this._transactionsService.transaction(
            getSingleTransactionData,
        )
    }
}
