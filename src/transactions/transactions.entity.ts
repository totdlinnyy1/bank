import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from '../helpers/base.entity'
import { TransactionsTypeEnum } from '../helpers/transactionsType.enum'
import { Wallets } from '../wallets/wallets.entity'

@ObjectType()
@Entity('transactions')
export class Transactions extends BaseAudit {
    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Field(() => String)
    @Column()
    walletId: string

    @Field(() => Float)
    @Column('float')
    money: number

    @Field(() => String)
    @Column({ type: 'enum', enum: TransactionsTypeEnum })
    type: TransactionsTypeEnum

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    inputWalletId?: string

    @ManyToOne(() => Wallets, (wallet) => wallet.transactions)
    wallet: Wallets

    @ManyToOne(() => Wallets, (wallet) => wallet.inputTransactions, {
        nullable: true,
    })
    inputWallet?: Wallets
}
