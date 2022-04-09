import { Field, Float, InputType, Int } from '@nestjs/graphql'

@InputType()
export class UpdateMoneyDto {
    @Field(() => Int)
    readonly walletId: number
    @Field(() => Float)
    readonly money: number
    readonly deposit: boolean
}
