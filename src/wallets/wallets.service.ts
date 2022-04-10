import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { WalletsEntity } from '../entities/wallets.entity'

import { UpdateMoneyDto } from './dto/updateMoney.dto'

@Injectable()
export class WalletsService {
    constructor(
        @InjectRepository(WalletsEntity)
        private readonly _walletsRepository: Repository<WalletsEntity>,
    ) {}

    async create(): Promise<WalletsEntity> {
        return await this._walletsRepository.save({})
    }

    async wallets(): Promise<WalletsEntity[]> {
        return await this._walletsRepository.find({ isClosed: false })
    }

    async wallet(id: number): Promise<WalletsEntity> {
        const candidate = await this._walletsRepository.findOne({
            where: { id, isClosed: false },
            relations: ['transactions'],
        })

        if (candidate) {
            return candidate
        }

        throw new Error('This wallet does not exist or is closed.')
    }

    async close(id: number): Promise<string> {
        const candidate = await this._walletsRepository.findOne({
            id,
            isClosed: false,
        })

        if (candidate) {
            await this._walletsRepository.update({ id }, { isClosed: true })
            return 'The wallet is closed.'
        }

        throw new Error('This wallet does not exist or is already closed.')
    }

    async updateMoney(data: UpdateMoneyDto): Promise<boolean> {
        if (data.money <= 0) {
            throw new Error('The amount must be greater than 0.')
        }

        const wallet = await this.wallet(data.walletId)
        if (data.deposit) {
            await this._walletsRepository.update(
                { id: data.walletId },
                { money: wallet.money + data.money },
            )
        } else if (!data.deposit && wallet.money >= data.money) {
            await this._walletsRepository.update(
                { id: data.walletId },
                { money: wallet.money - data.money },
            )
        } else {
            return false
        }
        return true
    }
}
