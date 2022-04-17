import { TransactionsType } from '../../entities/transactions.entity'

export class CreateTransactionsDto {
    readonly walletId: number
    readonly money: number
    readonly type?: TransactionsType
    readonly outputWalletId?: number
}
