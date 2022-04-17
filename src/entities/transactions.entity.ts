import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from './base.entity'
import { WalletsEntity } from './wallets.entity'

export enum TransactionsType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSACTION = 'transaction',
}

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

    @Field(() => String)
    @Column({ type: 'enum', enum: TransactionsType })
    type!: TransactionsType

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    outputWalletId?: number

    @Field(() => WalletsEntity)
    @ManyToOne(() => WalletsEntity, (wallet) => wallet.transactions)
    wallet: WalletsEntity

    @Field(() => WalletsEntity, { nullable: true })
    @ManyToOne(() => WalletsEntity, (wallet) => wallet.inputTransactions, {
        nullable: true,
    })
    outputWallet?: WalletsEntity
}
