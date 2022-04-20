import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CloseWalletDto {
    @Field(() => String)
    readonly walletId: string
}
