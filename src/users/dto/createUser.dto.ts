import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUserDto {
    @Field(() => String)
    readonly name: string

    @Field(() => String)
    readonly email: string
}
