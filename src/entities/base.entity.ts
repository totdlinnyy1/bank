import {ObjectType} from '@nestjs/graphql'
import {BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@ObjectType()
export abstract class BaseAudit extends BaseEntity {

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
