import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAudit } from '../helpers/base.entity'
import { Transaction } from '../transactions/transaction.entity'
import { User } from '../users/user.entity'

@Entity('wallets')
export class Wallet extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('float', { default: 0 })
    balance: number

    @Column('text')
    ownerId: string

    @Column('boolean', { default: false })
    isClosed?: boolean

    @Column('boolean', { default: false })
    isLock?: boolean

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions: Transaction[]

    @OneToMany(() => Transaction, (transaction) => transaction.inputWallet, {
        nullable: true,
    })
    inputTransactions?: Transaction[]

    @ManyToOne(() => User, (user) => user.wallets)
    owner: User
}
