import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Transactions } from './transactions.entity'
import { TransactionsResolver } from './transactions.resolver'
import { TransactionsService } from './transactions.service'

@Module({
    imports: [TypeOrmModule.forFeature([Transactions])],
    providers: [TransactionsService, TransactionsResolver],
})
export class TransactionsModule {}
