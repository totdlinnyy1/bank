import { Field, ObjectType } from '@nestjs/graphql'

import { WalletObjectType } from '../wallets/wallet.objectType'

@ObjectType()
export class UserObjectType {
    @Field(() => String)
    id: string

    @Field(() => String)
    name: string

    @Field(() => String)
    email: string

    @Field(() => [WalletObjectType], { nullable: true })
    wallets?: WalletObjectType[]
}
