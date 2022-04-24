import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from '../../helpers/base.entity'
import { TransactionsTypeEnum } from '../../helpers/transactionsType.enum'
import { Wallet } from '../../wallets/entities/wallet.entity'

@ObjectType()
@Entity('transactions')
export class Transaction extends BaseAudit {
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
    toWalletId?: string

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    wallet: Wallet

    @ManyToOne(() => Wallet, (wallet) => wallet.inputTransactions, {
        nullable: true,
    })
    toWallet?: Wallet
}
