import { Args, Int, Query, Resolver } from '@nestjs/graphql'

import { TransactionsEntity } from '../entities/transactions.entity'

import { GetTransactionsDto } from './dto/getTransactionsDto'
import { TransactionsService } from './transactions.service'

@Resolver(() => TransactionsEntity)
export class TransactionsResolver {
    constructor(private readonly _transactionsService: TransactionsService) {}

    @Query(() => [TransactionsEntity])
    async transactions(
        @Args('walletId', { type: () => Int }) walletId: number,
    ): Promise<TransactionsEntity[]> {
        return await this._transactionsService.transactions({ walletId })
    }

    @Query(() => TransactionsEntity)
    async transaction(
        @Args('body', { type: () => GetTransactionsDto })
        body: GetTransactionsDto,
    ): Promise<TransactionsEntity> {
        return await this._transactionsService.transaction(body)
    }
}
