import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import { CreateUserDto } from './dto/createUser.dto'
import { DeleteUserDto } from './dto/deleteUserDto'
import { GetSingleUserDto } from './dto/getSingleUser.dto'
import { UserObjectType } from './user.objectType'
import { UsersService } from './users.service'

@Resolver(() => UserObjectType)
export class UsersResolver {
    constructor(private readonly _usersService: UsersService) {}

    // Query to get a single user
    @Query(() => UserObjectType)
    async user(
        @Args('getUserData') getUserData: GetSingleUserDto,
    ): Promise<UserObjectType> {
        return await this._usersService.user(getUserData)
    }

    // Request to get users
    @Query(() => [UserObjectType])
    async users(): Promise<UserObjectType[]> {
        return await this._usersService.users()
    }

    // Mutation to create a user
    @Mutation(() => UserObjectType)
    async createUser(
        @Args('createUserData') createUserData: CreateUserDto,
    ): Promise<UserObjectType> {
        return await this._usersService.create(createUserData)
    }

    // Mutation to delete a user
    @Mutation(() => String)
    async deleteUser(
        @Args('deleteUserData') deleteUserData: DeleteUserDto,
    ): Promise<string> {
        return await this._usersService.delete(deleteUserData)
    }
}
