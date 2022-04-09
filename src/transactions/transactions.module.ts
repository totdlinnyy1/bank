import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TransactionsEntity } from '../entities/transactions.entity'

import { TransactionsService } from './transactions.service'
import { WalletsModule } from '../wallets/wallets.module'
import { TransactionsResolver } from './transactions.resolver'

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionsEntity]),
        forwardRef(() => WalletsModule),
    ],
    providers: [TransactionsService, TransactionsResolver],
    exports: [TypeOrmModule, TransactionsService],
})
export class TransactionsModule {}
