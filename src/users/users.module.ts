import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { WalletsModule } from '../wallets/wallets.module'

import { User } from './entities/user.entity'
import { UsersResolver } from './users.resolver'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([User]), WalletsModule],
    providers: [UsersService, UsersResolver],
})
export class UsersModule {}
