import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import isEmail from 'validator/lib/isEmail'

import { WalletsService } from '../wallets/wallets.service'

import { CreateUserDto } from './dtos/createUser.dto'
import { DeleteUserDto } from './dtos/deleteUserDto'
import { GetSingleUserDto } from './dtos/getSingleUser.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly _usersRepository: Repository<User>,
        private readonly _walletsService: WalletsService,
    ) {}

    // Single user get function
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

    // Users get function
    async users(): Promise<User[]> {
        return await this._usersRepository.find({
            relations: [
                'wallets',
                'wallets.transactions',
                'wallets.inputTransactions',
            ],
        })
    }

    // User creation function
    async create(createUserData: CreateUserDto): Promise<User> {
        const candidate = await this._usersRepository.findOne({
            email: createUserData.email,
        })

        // Checking if there is a user with the same email
        if (candidate) {
            throw new Error('This user is already exists')
        }

        // Email Validation
        if (!isEmail(createUserData.email)) {
            throw new Error('Email is incorrect')
        }

        // Name Validation
        if (createUserData.name === '') {
            throw new Error('Name is incorrect')
        }

        const user = await this._usersRepository.save(createUserData)

        return await this.user({ userId: user.id })
    }

    // The function deletes the user
    async delete(deleteUserData: DeleteUserDto): Promise<string> {
        // Checking if such a user exists
        await this.user({ userId: deleteUserData.userId })

        // Deleting a user
        await this._usersRepository.softDelete({ id: deleteUserData.userId })

        // Blocking wallets, true if wallets are blocked, false if there were no wallets, or they are closed
        const isWalletsLocked = await this._walletsService.lock({
            ownerId: deleteUserData.userId,
        })

        if (!isWalletsLocked) {
            return 'User deleted, wallets not found'
        }

        return 'User deleted, wallets blocked'
    }
}
