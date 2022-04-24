import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetSingleWalletInput {
    @Field(() => String)
    readonly walletId!: string
}
