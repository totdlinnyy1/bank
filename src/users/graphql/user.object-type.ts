import { Field, ObjectType } from '@nestjs/graphql'

import { WalletObjectType } from '../../wallets/graphql/wallet.object-type'

@ObjectType({ description: 'User' })
export class UserObjectType {
    @Field(() => String, { description: 'User Id' })
    id: string

    @Field(() => String, { description: 'User name' })
    name: string

    @Field(() => String, { description: 'User email' })
    email: string

    @Field(() => [WalletObjectType], {
        nullable: true,
        description: 'List of user wallets',
    })
    wallets?: WalletObjectType[]
}
