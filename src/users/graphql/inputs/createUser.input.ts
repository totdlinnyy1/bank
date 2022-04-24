import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
    @Field(() => String)
    readonly name: string

    @Field(() => String)
    readonly email: string
}
