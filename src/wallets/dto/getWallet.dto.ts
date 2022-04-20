import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetWalletDto {
    @Field(() => String)
    readonly walletId!: string
}
