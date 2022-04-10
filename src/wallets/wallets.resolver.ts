import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { TransactionsEntity } from '../entities/transactions.entity'
import { WalletsEntity } from '../entities/wallets.entity'
import { TransactionsService } from '../transactions/transactions.service'

import { UpdateMoneyDto } from './dto/updateMoney.dto'
import { WalletsService } from './wallets.service'

@Resolver(() => WalletsEntity)
export class WalletsResolver {
    constructor(
        private readonly _walletsService: WalletsService,
        private readonly _transactionsService: TransactionsService,
    ) {}

    @Query(() => [WalletsEntity])
    async wallets(): Promise<WalletsEntity[]> {
        return await this._walletsService.wallets()
    }

    @Query(() => WalletsEntity)
    async wallet(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<WalletsEntity> {
        return await this._walletsService.wallet(id)
    }

    @Mutation(() => WalletsEntity)
    async create(): Promise<WalletsEntity> {
        return await this._walletsService.create()
    }

    @Mutation(() => String)
    async close(@Args('id', { type: () => Int }) id: number): Promise<string> {
        return await this._walletsService.close(id)
    }

    @Mutation(() => TransactionsEntity)
    async deposit(
        @Args('body', { type: () => UpdateMoneyDto }) body: UpdateMoneyDto,
    ): Promise<TransactionsEntity> {
        return await this._transactionsService.create({
            walletId: body.walletId,
            money: body.money,
            deposit: true,
        })
    }

    @Mutation(() => TransactionsEntity)
    async withdraw(
        @Args('body', { type: () => UpdateMoneyDto }) body: UpdateMoneyDto,
    ): Promise<TransactionsEntity> {
        return await this._transactionsService.create({
            walletId: body.walletId,
            money: body.money,
            deposit: false,
        })
    }
}
