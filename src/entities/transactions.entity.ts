import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from './base.entity'
import { WalletsEntity } from './wallets.entity'

@ObjectType()
@Entity('transactions')
export class TransactionsEntity extends BaseAudit {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => Int)
    @Column()
    walletId!: number

    @Field(() => Float)
    @Column('float')
    money!: number

    @ManyToOne(() => WalletsEntity, (wallet) => wallet.transactions)
    wallet: WalletsEntity
}
