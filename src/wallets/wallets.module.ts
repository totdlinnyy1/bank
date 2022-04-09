import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { WalletsEntity } from '../entities/wallets.entity'

import { WalletsResolver } from './wallets.resolver'
import { WalletsService } from './wallets.service'
import { TransactionsModule } from '../transactions/transactions.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([WalletsEntity]),
        forwardRef(() => TransactionsModule),
    ],
    providers: [WalletsService, WalletsResolver],
    exports: [TypeOrmModule, WalletsService],
})
export class WalletsModule {}
