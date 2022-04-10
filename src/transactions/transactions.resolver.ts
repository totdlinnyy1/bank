import {
    Args,
    Field,
    Float,
    InputType,
    Int,
    Mutation,
    Query,
    Resolver,
} from '@nestjs/graphql'

import { TransactionsEntity } from '../entities/transactions.entity'

import { GetTransactionsDto } from './dto/getTransactionsDto'
import { TransactionsService } from './transactions.service'

@InputType()
class CreateTransaction {
    @Field(() => Int)
    walletId: number

    @Field(() => Int)
    outputWalletId: number

    @Field(() => Float)
    money: number
}

@Resolver(() => TransactionsEntity)
export class TransactionsResolver {
    constructor(private readonly _transactionsService: TransactionsService) {}

    // Request to receive all wallet transactions
    @Query(() => [TransactionsEntity])
    async transactions(
        @Args('walletId', { type: () => Int }) walletId: number,
    ): Promise<TransactionsEntity[]> {
        return await this._transactionsService.transactions(walletId)
    }

    // Request to receive one wallet transaction
    @Query(() => TransactionsEntity)
    async transaction(
        @Args('body', { type: () => GetTransactionsDto })
        body: GetTransactionsDto,
    ): Promise<TransactionsEntity> {
        return await this._transactionsService.transaction(body)
    }

    // Mutation to transfer money between wallets
    @Mutation(() => TransactionsEntity)
    async createTransaction(
        @Args('body', { type: () => CreateTransaction })
        body: CreateTransaction,
    ): Promise<TransactionsEntity> {
        return await this._transactionsService.create(body)
    }
}
