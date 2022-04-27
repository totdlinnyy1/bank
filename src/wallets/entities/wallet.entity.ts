import {
    Check,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAudit } from '../../helpers/base.entity'
import { Transaction } from '../../transactions/entities/transaction.entity'
import { User } from '../../users/entities/user.entity'

@Entity('wallets')
@Check(`"incoming" >= "outgoing"`)
export class Wallet extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('float', { default: 0 })
    incoming: number

    @Column('float', { default: 0 })
    outgoing: number

    @Column('text')
    ownerId: string

    @Column('boolean', { default: false })
    isClosed?: boolean

    @Column('boolean', { default: false })
    isLock?: boolean

    @OneToMany(() => Transaction, (transaction) => transaction.wallet)
    transactions: Transaction[]

    @OneToMany(() => Transaction, (transaction) => transaction.toWallet, {
        nullable: true,
    })
    inputTransactions?: Transaction[]

    @ManyToOne(() => User, (user) => user.wallets)
    owner: User

    get actualBalance(): number {
        return this.incoming - this.outgoing
    }
}
