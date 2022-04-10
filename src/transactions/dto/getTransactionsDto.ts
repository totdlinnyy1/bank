import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class GetTransactionsDto {
    @Field(() => Int)
    readonly walletId: number
    @Field(() => Int)
    readonly transactionId: number
}
