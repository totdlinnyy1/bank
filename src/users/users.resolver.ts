import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import { CreateUserDto } from './dto/createUser.dto'
import { DeleteUserDto } from './dto/deleteUserDto'
import { GetSingleUserDto } from './dto/getSingleUser.dto'
import { UserObjectType } from './user.objectType'
import { UsersService } from './users.service'

@Resolver(() => UserObjectType)
export class UsersResolver {
    constructor(private readonly _usersService: UsersService) {}

    @Query(() => UserObjectType)
    async user(
        @Args('getUserData') getUserData: GetSingleUserDto,
    ): Promise<UserObjectType> {
        return await this._usersService.user(getUserData)
    }

    @Query(() => [UserObjectType])
    async users(): Promise<UserObjectType[]> {
        return await this._usersService.users()
    }

    @Mutation(() => UserObjectType)
    async createUser(
        @Args('createUserData') createUserData: CreateUserDto,
    ): Promise<UserObjectType> {
        return await this._usersService.create(createUserData)
    }

    @Mutation(() => String)
    async deleteUser(
        @Args('deleteUserData') deleteUserData: DeleteUserDto,
    ): Promise<string> {
        return await this._usersService.delete(deleteUserData)
    }
}
