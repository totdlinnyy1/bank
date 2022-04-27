import { Args, Query, Resolver } from '@nestjs/graphql'

import { GetSingleTransactionInput } from './graphql/inputs/getSingleTransaction.input'
import { TransactionObjectType } from './graphql/transaction.object-type'
import { TransactionsService } from './transactions.service'

@Resolver(() => TransactionObjectType)
export class TransactionsResolver {
    constructor(private readonly _transactionsService: TransactionsService) {}

    // Request to receive all wallet transactions
    @Query(() => [TransactionObjectType])
    async transactions(
        @Args('walletId', { type: () => String })
        walletId: string,
    ): Promise<TransactionObjectType[]> {
        return await this._transactionsService.transactions({ walletId })
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
