import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TransactionsTypeEnum } from '../../enums/transactionsType.enum'

@ObjectType({ description: 'Transactions' })
export class TransactionObjectType {
    @Field(() => String, { description: 'Transaction Id' })
    id: string

    @Field(() => String, {
        description:
            'The id of the wallet to which deposit or withdraw money, and when transferring, this is the id of the sender’s wallet',
    })
    walletId: string

    @Field(() => Float, { description: 'Transaction money' })
    money: number

    @Field(() => String, { description: 'Transaction type' })
    type: TransactionsTypeEnum

    @Field(() => String, {
        nullable: true,
        description:
            "When transferring, this is the ID of the recipient's wallet",
    })
    toWalletId?: string
}
