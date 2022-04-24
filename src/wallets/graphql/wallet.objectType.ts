import { Field, Float, ObjectType } from '@nestjs/graphql'

import { Transaction } from '../../transactions/entities/transaction.entity'
import { User } from '../../users/entities/user.entity'
import { UserObjectType } from '../../users/graphql/user.objectType'

@ObjectType()
export class WalletObjectType {
    @Field(() => String)
    id: string

    @Field(() => Float)
    incoming: number

    @Field(() => Float)
    outgoing: number

    @Field(() => Float)
    actualBalance: number

    @Field(() => [Transaction])
    transactions: Transaction[]

    @Field(() => [Transaction], { nullable: true })
    inputTransactions?: Transaction[]

    @Field(() => String)
    ownerId: string

    @Field(() => UserObjectType)
    owner: User
}
