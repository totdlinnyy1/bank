import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetSingleUserDto {
    @Field(() => String)
    readonly userId: string
}
