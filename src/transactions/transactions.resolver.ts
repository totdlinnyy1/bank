import { Args, Query, Resolver } from '@nestjs/graphql'

import { GetSingleTransactionDto } from './dto/getSingleTransactionDto'
import { GetTransactionsDto } from './dto/getTransactions.dto'
import { TransactionsObjectType } from './transactions.objectType'
import { TransactionsService } from './transactions.service'

@Resolver(() => TransactionsObjectType)
export class TransactionsResolver {
    constructor(private readonly _transactionsService: TransactionsService) {}

    // Request to receive all wallet transactions
    @Query(() => [TransactionsObjectType])
    async transactions(
        @Args('getTransactionsData') getTransactionsData: GetTransactionsDto,
    ): Promise<TransactionsObjectType[]> {
        return await this._transactionsService.transactions(getTransactionsData)
    }

    // Request to receive one wallet transaction
    @Query(() => TransactionsObjectType)
    async transaction(
        @Args('getSingleTransactionData')
        getSingleTransactionData: GetSingleTransactionDto,
    ): Promise<TransactionsObjectType> {
        return await this._transactionsService.transaction(
            getSingleTransactionData,
        )
    }
}
