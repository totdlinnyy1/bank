import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Transaction } from '../transactions/entities/transaction.entity'
import { User } from '../users/entities/user.entity'

import { Wallet } from './entities/wallet.entity'
import { WalletsResolver } from './wallets.resolver'
import { WalletsService } from './wallets.service'

@Module({
    imports: [TypeOrmModule.forFeature([Wallet, Transaction, User])],
    providers: [WalletsService, WalletsResolver],
    exports: [WalletsService],
})
export class WalletsModule {}
