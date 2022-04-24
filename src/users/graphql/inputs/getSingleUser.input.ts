import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetSingleUserInput {
    @Field(() => String)
    readonly userId: string
}
