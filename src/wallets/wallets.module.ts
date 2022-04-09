import { Module } from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'

import {WalletsEntity} from '../entities/wallets.entity'

import {WalletsResolver} from './wallets.resolver'
import { WalletsService } from './wallets.service'


@Module({
  imports: [TypeOrmModule.forFeature([WalletsEntity])],
  providers: [WalletsService, WalletsResolver],
  exports: [TypeOrmModule]
})
export class WalletsModule {}
