import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { WalletsService } from '../wallets/wallets.service'

import { CreateUserDto } from './dtos/createUser.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _usersRepository: Repository<UserEntity>,
        private readonly _walletsService: WalletsService,
    ) {}

    // Single user get function
    async user(id: string): Promise<UserEntity> {
        const candidate = await this._usersRepository.findOne({
            where: { id },
            relations: [
                'wallets',
                'wallets.transactions',
                'wallets.inputTransactions',
            ],
        })

        if (!candidate) {
            throw new NotFoundException('This user does not exist')
        }

        return candidate
    }

    // Users get function
    async users(): Promise<UserEntity[]> {
        return await this._usersRepository.find({
            relations: [
                'wallets',
                'wallets.transactions',
                'wallets.inputTransactions',
            ],
        })
    }

    // User creation function
    async create(createUserData: CreateUserDto): Promise<UserEntity> {
        const candidate = await this._usersRepository.findOne({
            email: createUserData.email,
        })

        // Checking if there is a user with the same email
        if (candidate) {
            throw new BadRequestException('This user is already exists')
        }

        const user = await this._usersRepository.save(createUserData)

        return await this.user(user.id)
    }

    // The function deletes the user
    async delete(id: string): Promise<string> {
        // Checking if such a user exists
        await this.user(id)

        // Deleting a user
        await this._usersRepository.softDelete({ id })

        // Blocking wallets, true if wallets are blocked, false if there were no wallets, or they are closed
        const isWalletsLocked = await this._walletsService.lock({
            ownerId: id,
        })

        if (!isWalletsLocked) {
            return 'User deleted, wallets not found'
        }

        return 'User deleted, wallets blocked'
    }
}
