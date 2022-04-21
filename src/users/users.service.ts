import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import isEmail from 'validator/lib/isEmail'

import { WalletsService } from '../wallets/wallets.service'

import { CreateUserDto } from './dto/createUser.dto'
import { DeleteUserDto } from './dto/deleteUserDto'
import { GetSingleUserDto } from './dto/getSingleUser.dto'
import { User } from './user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly _usersRepository: Repository<User>,
        private readonly _walletsService: WalletsService,
    ) {}

    async user(getUserData: GetSingleUserDto): Promise<User> {
        const candidate = await this._usersRepository.findOne({
            where: { id: getUserData.userId },
            relations: [
                'wallets',
                'wallets.transactions',
                'wallets.inputTransactions',
            ],
        })

        if (!candidate) {
            throw new Error('This user does not exist')
        }

        return candidate
    }

    async users(): Promise<User[]> {
        return await this._usersRepository.find({
            relations: [
                'wallets',
                'wallets.transactions',
                'wallets.inputTransactions',
            ],
        })
    }

    async create(createUserData: CreateUserDto): Promise<User> {
        const candidate = await this._usersRepository.findOne({
            email: createUserData.email,
        })

        if (candidate) {
            throw new Error('This user is already exists')
        }

        if (!isEmail(createUserData.email)) {
            throw new Error('Email is incorrect')
        }

        if (createUserData.name === '') {
            throw new Error('Name is incorrect')
        }

        const user = await this._usersRepository.save(createUserData)

        return await this.user({ userId: user.id })
    }

    async delete(deleteUserData: DeleteUserDto): Promise<string> {
        await this.user({ userId: deleteUserData.userId })

        await this._usersRepository.softDelete({ id: deleteUserData.userId })

        const isWalletsLocked = await this._walletsService.lock({
            ownerId: deleteUserData.userId,
        })

        if (!isWalletsLocked) {
            return 'User deleted, wallets not found'
        }

        return 'User deleted, wallets blocked'
    }
}
