import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql'

import {WalletsEntity} from '../entities/wallets.entity'

import {WalletsService} from './wallets.service'

@Resolver(() => WalletsEntity)
export class WalletsResolver {

  constructor(private readonly _walletsService: WalletsService) {
  }

  @Query(() => [WalletsEntity])
  async wallets(): Promise<WalletsEntity[]> {
    return await this._walletsService.wallets()
  }

  @Query(() => WalletsEntity)
  async wallet(
    @Args('id', {type: () => Int}) id: number
  ): Promise<WalletsEntity> {
    return await this._walletsService.wallet({id})
  }

  @Mutation(() => WalletsEntity)
  async create(): Promise<WalletsEntity> {
    return await this._walletsService.create()
  }
}
