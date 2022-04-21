import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteUserDto {
    @Field(() => String)
    userId: string
}
