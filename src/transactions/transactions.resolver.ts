import { Args, Query, Resolver } from '@nestjs/graphql'
import { TransactionObjectType } from './graphql/transaction.objectType'
import { TransactionsService } from './transactions.service'
import { GetTransactionsInput } from './graphql/inputs/getTransactions.input'
import { GetSingleTransactionInput } from './graphql/inputs/getSingleTransaction.input'

@Resolver(() => TransactionObjectType)
export class TransactionsResolver {
    constructor(private readonly _transactionsService: TransactionsService) {}

    // Request to receive all wallet transactions
    @Query(() => [TransactionObjectType])
    async transactions(
        @Args('getTransactionsData', { type: () => GetTransactionsInput })
        getTransactionsData: GetTransactionsInput,
    ): Promise<TransactionObjectType[]> {
        return await this._transactionsService.transactions(getTransactionsData)
    }

    // Request to receive one wallet transaction
    @Query(() => TransactionObjectType)
    async transaction(
        @Args('getSingleTransactionData', {
            type: () => GetSingleTransactionInput,
        })
        getSingleTransactionData: GetSingleTransactionInput,
    ): Promise<TransactionObjectType> {
        return await this._transactionsService.transaction(
            getSingleTransactionData,
        )
    }
}
