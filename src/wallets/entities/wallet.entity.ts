import {
    Check,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAudit } from '../../entities/base.entity'
import { TransactionEntity } from '../../transactions/entities/transaction.entity'
import { UserEntity } from '../../users/entities/user.entity'

@Entity('wallets')
@Check(`"incoming" >= "outgoing"`)
export class WalletEntity extends BaseAudit {
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

    @OneToMany(() => TransactionEntity, (transaction) => transaction.wallet)
    transactions: TransactionEntity[]

    @OneToMany(() => TransactionEntity, (transaction) => transaction.toWallet, {
        nullable: true,
    })
    inputTransactions?: TransactionEntity[]

    @ManyToOne(() => UserEntity, (user) => user.wallets)
    owner: UserEntity

    get actualBalance(): number {
        return this.incoming - this.outgoing
    }
}
