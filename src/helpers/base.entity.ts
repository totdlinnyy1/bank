import { Field, ObjectType } from '@nestjs/graphql'
import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@ObjectType()
export abstract class BaseAudit extends BaseEntity {
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date
}
