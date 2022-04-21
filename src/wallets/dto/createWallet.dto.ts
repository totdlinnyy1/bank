import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateWalletDto {
    @Field(() => String)
    readonly ownerId: string
}
