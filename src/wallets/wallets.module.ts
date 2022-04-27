import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TransactionEntity } from '../transactions/entities/transaction.entity'
import { UserEntity } from '../users/entities/user.entity'

import { WalletEntity } from './entities/wallet.entity'
import { WalletsResolver } from './wallets.resolver'
import { WalletsService } from './wallets.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([WalletEntity, TransactionEntity, UserEntity]),
    ],
    providers: [WalletsService, WalletsResolver],
    exports: [WalletsService],
})
export class WalletsModule {}
