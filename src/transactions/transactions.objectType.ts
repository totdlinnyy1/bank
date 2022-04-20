import { Field, Float, ObjectType } from '@nestjs/graphql'

import { TransactionsTypeEnum } from '../helpers/transactionsType.enum'

@ObjectType()
export class TransactionsObjectType {
    @Field(() => String)
    id: string

    @Field(() => String)
    walletId: string

    @Field(() => Float)
    money: number

    @Field(() => String)
    type: TransactionsTypeEnum

    @Field(() => String, { nullable: true })
    inputWalletId?: string
}
