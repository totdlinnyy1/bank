import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from './base.entity'
import { TransactionsEntity } from './transactions.entity'

@ObjectType()
@Entity('wallets')
export class WalletsEntity extends BaseAudit {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => Float)
    @Column('float', { default: 0 })
    money: number

    @Column('boolean', { default: false })
    isClosed?: boolean

    @Field(() => [TransactionsEntity])
    @OneToMany(() => TransactionsEntity, (transaction) => transaction.wallet)
    transactions: TransactionsEntity[]

    @Field(() => [TransactionsEntity], { nullable: true })
    @OneToMany(
        () => TransactionsEntity,
        (transaction) => transaction.outputWallet,
        { nullable: true },
    )
    inputTransactions?: TransactionsEntity[]
}
