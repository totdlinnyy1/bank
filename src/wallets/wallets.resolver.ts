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
import { WalletsEntity } from '../entities/wallets.entity'

import { WalletsService } from './wallets.service'

@InputType()
class ChangeMoneyAmount {
    @Field(() => Int)
    walletId!: number

    @Field(() => Float)
    money!: number
}

@Resolver(() => WalletsEntity)
export class WalletsResolver {
    constructor(private readonly _walletsService: WalletsService) {}

    // Request to receive all wallets
    @Query(() => [WalletsEntity])
    async wallets(): Promise<WalletsEntity[]> {
        return await this._walletsService.wallets()
    }

    // Request for a wallet by id
    @Query(() => WalletsEntity)
    async wallet(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<WalletsEntity> {
        return await this._walletsService.wallet(id)
    }

    // Mutation to create a wallet
    @Mutation(() => WalletsEntity)
    async create(): Promise<WalletsEntity> {
        return await this._walletsService.create()
    }

    // Mutation to close the wallet by ID
    @Mutation(() => String)
    async close(@Args('id', { type: () => Int }) id: number): Promise<string> {
        return await this._walletsService.close(id)
    }

    // Deposit Mutation
    @Mutation(() => TransactionsEntity)
    async deposit(
        @Args('body', { type: () => ChangeMoneyAmount })
        body: ChangeMoneyAmount,
    ): Promise<TransactionsEntity> {
        return await this._walletsService.deposit({
            walletId: body.walletId,
            money: body.money,
        })
    }

    // Withdraw Mutation
    @Mutation(() => TransactionsEntity)
    async withdraw(
        @Args('body', { type: () => ChangeMoneyAmount })
        body: ChangeMoneyAmount,
    ): Promise<TransactionsEntity> {
        return await this._walletsService.withdraw({
            walletId: body.walletId,
            money: body.money,
        })
    }
}
