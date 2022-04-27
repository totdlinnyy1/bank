import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from '../../entities/base.entity'
import { TransactionsTypeEnum } from '../../enums/transactionsType.enum'
import { WalletEntity } from '../../wallets/entities/wallet.entity'

@Entity('transactions')
export class TransactionEntity extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    walletId: string

    @Column('float')
    money: number

    @Column({ type: 'enum', enum: TransactionsTypeEnum })
    type: TransactionsTypeEnum

    @Column({ nullable: true })
    toWalletId?: string

    @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions)
    wallet: WalletEntity

    @ManyToOne(() => WalletEntity, (wallet) => wallet.inputTransactions, {
        nullable: true,
    })
    toWallet?: WalletEntity
}
