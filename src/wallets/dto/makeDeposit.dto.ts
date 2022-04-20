import { Field, Float, InputType } from '@nestjs/graphql'

@InputType()
export class MakeDepositDto {
    @Field(() => String)
    readonly walletId: string

    @Field(() => Float)
    readonly money: number
}
