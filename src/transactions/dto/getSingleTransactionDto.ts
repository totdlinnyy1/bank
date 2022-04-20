import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetSingleTransactionDto {
    @Field(() => String)
    readonly walletId: string
    @Field(() => String)
    readonly transactionId: string
}
