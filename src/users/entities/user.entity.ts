import {
    Column,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAudit } from '../../entities/base.entity'
import { WalletEntity } from '../../wallets/entities/wallet.entity'

@Entity('users')
export class UserEntity extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', { unique: true })
    email: string

    @Column('text')
    name: string

    @OneToMany(() => WalletEntity, (wallets) => wallets.owner, {
        nullable: true,
    })
    wallets?: WalletEntity[]

    @DeleteDateColumn()
    deletedAt: Date
}
