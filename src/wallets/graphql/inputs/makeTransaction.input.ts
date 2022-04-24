import { Field, Float, InputType } from '@nestjs/graphql'

@InputType()
export class MakeTransactionInput {
    @Field(() => String)
    readonly toWalletId: string

    @Field(() => String)
    readonly fromWalletId: string

    @Field(() => Float)
    readonly money: number
}