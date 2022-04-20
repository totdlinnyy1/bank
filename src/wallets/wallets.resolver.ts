import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { TransactionsObjectType } from '../transactions/transactions.objectType'

import { CloseWalletDto } from './dto/closeWallet.dto'
import { GetWalletDto } from './dto/getWallet.dto'
import { MakeDepositDto } from './dto/makeDeposit.dto'
import { MakeTransactionDto } from './dto/makeTransaction.dto'
import { WalletsObjectType } from './wallets.objectType'
import { WalletsService } from './wallets.service'

@Resolver(() => WalletsObjectType)
export class WalletsResolver {
    constructor(private readonly _walletsService: WalletsService) {}

    // Request to receive all wallets
    @Query(() => [WalletsObjectType])
    async wallets(): Promise<WalletsObjectType[]> {
        return await this._walletsService.wallets()
    }

    // Request for a wallet by id
    @Query(() => WalletsObjectType)
    async wallet(
        @Args('getWalletData') getWalletData: GetWalletDto,
    ): Promise<WalletsObjectType> {
        return await this._walletsService.wallet(getWalletData)
    }

    // Mutation to create a wallet
    @Mutation(() => WalletsObjectType)
    async create(): Promise<WalletsObjectType> {
        return await this._walletsService.create()
    }

    // Mutation to close the wallet by ID
    @Mutation(() => String)
    async close(
        @Args('closeWalletData') closeWalletData: CloseWalletDto,
    ): Promise<string> {
        return await this._walletsService.close(closeWalletData)
    }

    // Deposit Mutation
    @Mutation(() => TransactionsObjectType)
    async deposit(
        @Args('makeDepositData') makeDepositData: MakeDepositDto,
    ): Promise<TransactionsObjectType> {
        return await this._walletsService.deposit({
            walletId: makeDepositData.walletId,
            money: makeDepositData.money,
        })
    }

    // Withdraw Mutation
    @Mutation(() => TransactionsObjectType)
    async withdraw(
        @Args('makeWithdrawData') makeWithdrawData: MakeDepositDto,
    ): Promise<TransactionsObjectType> {
        return await this._walletsService.withdraw({
            walletId: makeWithdrawData.walletId,
            money: makeWithdrawData.money,
        })
    }

    // Mutation to transfer money between wallets
    @Mutation(() => TransactionsObjectType)
    async createTransaction(
        @Args('makeTransactionData')
        makeTransactionData: MakeTransactionDto,
    ): Promise<TransactionsObjectType> {
        return await this._walletsService.transaction(makeTransactionData)
    }
}
