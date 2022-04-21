import {
    Column,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAudit } from '../helpers/base.entity'
import { Wallet } from '../wallets/wallet.entity'

@Entity('users')
export class User extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    email: string

    @Column('text')
    name: string

    @OneToMany(() => Wallet, (wallets) => wallets.owner, { nullable: true })
    wallets?: Wallet[]

    @DeleteDateColumn()
    deletedAt: Date
}
