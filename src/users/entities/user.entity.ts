import {
    Column,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm'

import { BaseAudit } from '../../helpers/base.entity'
import { Wallet } from '../../wallets/entities/wallet.entity'

@Entity('users')
@Unique(['email'])
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
