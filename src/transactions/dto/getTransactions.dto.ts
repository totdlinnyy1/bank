import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetTransactionsDto {
    @Field(() => String)
    readonly walletId: string
}
