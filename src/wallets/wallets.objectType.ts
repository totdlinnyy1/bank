import { Field, Float, ObjectType } from '@nestjs/graphql'

import { Transactions } from '../transactions/transactions.entity'

@ObjectType()
export class WalletsObjectType {
    @Field(() => String)
    id: string

    @Field(() => Float)
    balance: number

    @Field(() => [Transactions])
    transactions: Transactions[]

    @Field(() => [Transactions], { nullable: true })
    inputTransactions?: Transactions[]
}
