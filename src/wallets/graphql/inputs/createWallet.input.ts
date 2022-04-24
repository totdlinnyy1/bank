import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateWalletInput {
    @Field(() => String)
    readonly ownerId: string
}
