import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetTransactionsInput {
    @Field(() => String)
    readonly walletId: string
}
