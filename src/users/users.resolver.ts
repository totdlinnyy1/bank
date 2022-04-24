import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'

import { CreateUserInput } from './graphql/inputs/createUser.input'
import { DeleteUserInput } from './graphql/inputs/deleteUser.input'
import { GetSingleUserInput } from './graphql/inputs/getSingleUser.input'
import { UserObjectType } from './graphql/user.objectType'
import { UsersService } from './users.service'

@Resolver(() => UserObjectType)
export class UsersResolver {
    constructor(private readonly _usersService: UsersService) {}

    // Query to get a single user
    @Query(() => UserObjectType)
    async user(
        @Args('getUserData', { type: () => GetSingleUserInput })
        getUserData: GetSingleUserInput,
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
        @Args('createUserData', { type: () => CreateUserInput })
        createUserData: CreateUserInput,
    ): Promise<UserObjectType> {
        return await this._usersService.create(createUserData)
    }

    // Mutation to delete a user
    @Mutation(() => String)
    async deleteUser(
        @Args('deleteUserData', { type: () => DeleteUserInput })
        deleteUserData: DeleteUserInput,
    ): Promise<string> {
        return await this._usersService.delete(deleteUserData)
    }
}
