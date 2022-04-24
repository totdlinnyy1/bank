import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CloseWalletInput {
    @Field(() => String)
    readonly walletId: string
}
