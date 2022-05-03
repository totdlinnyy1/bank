import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TransactionEntity } from '../../transactions/entities/transaction.entity'
import { TransactionObjectType } from '../../transactions/graphql/transaction.object-type'
import { UserEntity } from '../../users/entities/user.entity'
import { UserObjectType } from '../../users/graphql/user.object-type'

@ObjectType({ description: 'Wallet' })
export class WalletObjectType {
    @Field(() => String, { description: 'Id of the wallet' })
    id: string

    @Field(() => Float, { description: 'Incoming transfers to the wallet' })
    incoming: number

    @Field(() => Float, { description: 'Outgoing transfers from the wallet' })
    outgoing: number

    @Field(() => Float, { description: 'Current wallet balance' })
    actualBalance: number

    @Field(() => [TransactionObjectType], {
        description: 'List of deposits, withdrawals and transfers',
    })
    transactions: TransactionEntity[]

    @Field(() => [TransactionObjectType], {
        nullable: true,
        description: 'List of incoming transfers',
    })
    inputTransactions?: TransactionEntity[]

    @Field(() => String, { description: 'Wallet owner Id' })
    ownerId: string

    @Field(() => UserObjectType, { description: 'Wallet owner' })
    owner: UserEntity
}
