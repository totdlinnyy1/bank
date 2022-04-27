import { UsePipes, ValidationPipe } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import { CreateUserInput } from './graphql/inputs/createUser.input'
import { UserObjectType } from './graphql/user.object-type'
import { UsersService } from './users.service'

@Resolver(() => UserObjectType)
export class UsersResolver {
    constructor(private readonly _usersService: UsersService) {}

    // Query to get a single user
    @Query(() => UserObjectType)
    async user(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<UserObjectType> {
        return await this._usersService.user(id)
    }

    // Request to get users
    @Query(() => [UserObjectType])
    async users(): Promise<UserObjectType[]> {
        return await this._usersService.users()
    }

    // Mutation to create a user
    @Mutation(() => UserObjectType)
    @UsePipes(new ValidationPipe())
    async createUser(
        @Args('createUserData', { type: () => CreateUserInput })
        createUserData: CreateUserInput,
    ): Promise<UserObjectType> {
        return await this._usersService.create(createUserData)
    }

    // Mutation to delete a user
    @Mutation(() => String)
    async deleteUser(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<string> {
        return await this._usersService.delete(id)
    }
}
