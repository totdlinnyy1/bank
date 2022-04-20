import { Field, Float, InputType } from '@nestjs/graphql'

@InputType()
export class MakeTransactionDto {
    @Field(() => String)
    readonly inputWalletId: string

    @Field(() => String)
    readonly outputWalletId: string

    @Field(() => Float)
    readonly money: number
}
