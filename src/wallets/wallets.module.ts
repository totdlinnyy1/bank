import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TransactionsEntity } from '../entities/transactions.entity'
import { WalletsEntity } from '../entities/wallets.entity'

import { WalletsResolver } from './wallets.resolver'
import { WalletsService } from './wallets.service'

@Module({
    imports: [TypeOrmModule.forFeature([WalletsEntity, TransactionsEntity])],
    providers: [WalletsService, WalletsResolver],
    exports: [TypeOrmModule, WalletsService],
})
export class WalletsModule {}
