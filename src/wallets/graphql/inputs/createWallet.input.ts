import { Field, InputType } from '@nestjs/graphql'

@InputType({ description: 'Input for wallet create' })
export class CreateWalletInput {
    @Field(() => String, { description: 'Wallet owner Id' })
    readonly ownerId: string
}
