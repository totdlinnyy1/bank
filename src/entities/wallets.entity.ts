import {Field, Float, Int, ObjectType} from '@nestjs/graphql'
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

import {BaseAudit} from './base.entity'

@ObjectType()
@Entity('wallets')
export class WalletsEntity extends BaseAudit {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => Float)
  @Column('numeric', {default: 0})
  money?: number

  @Column('boolean', {default: false})
  isClosed?: boolean
}
