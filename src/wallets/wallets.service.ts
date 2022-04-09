import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

import {WalletsEntity} from '../entities/wallets.entity'

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletsEntity) private readonly _walletsRepository: Repository<WalletsEntity>
  ) {
  }

  async create(): Promise<WalletsEntity> {
    return await this._walletsRepository.save({})
  }

  async wallets(): Promise<WalletsEntity[]> {
    return await this._walletsRepository.find({isClosed: false})
  }

  async wallet({id}: GetWalletDto): Promise<WalletsEntity> {
    const candidate = await this._walletsRepository.findOne(id)

    if (candidate) {
      return candidate
    }

    throw new Error('This wallet does not exist.')
  }
}
