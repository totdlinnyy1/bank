import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Transactions } from '../transactions/transactions.entity'

import { Wallets } from './wallets.entity'
import { WalletsResolver } from './wallets.resolver'
import { WalletsService } from './wallets.service'

@Module({
    imports: [TypeOrmModule.forFeature([Wallets, Transactions])],
    providers: [WalletsService, WalletsResolver],
})
export class WalletsModule {}
