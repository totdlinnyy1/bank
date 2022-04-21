import { Field, Float, ObjectType } from '@nestjs/graphql'

import { Transaction } from '../transactions/transaction.entity'
import { User } from '../users/user.entity'
import { UserObjectType } from '../users/user.objectType'

@ObjectType()
export class WalletObjectType {
    @Field(() => String)
    id: string

    @Field(() => Float)
    balance: number

    @Field(() => [Transaction])
    transactions: Transaction[]

    @Field(() => [Transaction], { nullable: true })
    inputTransactions?: Transaction[]

    @Field(() => String)
    ownerId: string

    @Field(() => UserObjectType)
    owner: User
}
