import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from '../helpers/base.entity'
import { Transactions } from '../transactions/transactions.entity'

@Entity('wallets')
export class Wallets extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('float', { default: 0 })
    balance: number

    @Column('boolean', { default: false })
    isClosed?: boolean

    @OneToMany(() => Transactions, (transaction) => transaction.wallet)
    transactions: Transactions[]

    @OneToMany(() => Transactions, (transaction) => transaction.inputWallet, {
        nullable: true,
    })
    inputTransactions?: Transactions[]
}
