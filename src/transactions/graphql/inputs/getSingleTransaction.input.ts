import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetSingleTransactionInput {
    @Field(() => String)
    readonly walletId: string
    @Field(() => String)
    readonly transactionId: string
}
