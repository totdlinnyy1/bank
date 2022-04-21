import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { TransactionObjectType } from '../transactions/transaction.objectType'

import { CloseWalletDto } from './dto/closeWallet.dto'
import { CreateWalletDto } from './dto/createWallet.dto'
import { GetWalletDto } from './dto/getWallet.dto'
import { MakeDepositDto } from './dto/makeDeposit.dto'
import { MakeTransactionDto } from './dto/makeTransaction.dto'
import { WalletObjectType } from './wallet.objectType'
import { WalletsService } from './wallets.service'

@Resolver(() => WalletObjectType)
export class WalletsResolver {
    constructor(private readonly _walletsService: WalletsService) {}

    // Request to receive all wallets
    @Query(() => [WalletObjectType])
    async wallets(): Promise<WalletObjectType[]> {
        return await this._walletsService.wallets()
    }

    // Request for a wallet by id
    @Query(() => WalletObjectType)
    async wallet(
        @Args('getWalletData') getWalletData: GetWalletDto,
    ): Promise<WalletObjectType> {
        return await this._walletsService.wallet(getWalletData)
    }

    // Mutation to create a wallet
    @Mutation(() => WalletObjectType)
    async createWallet(
        @Args('createWalletData') createWalletData: CreateWalletDto,
    ): Promise<WalletObjectType> {
        return await this._walletsService.create(createWalletData)
    }

    // Mutation to close the wallet by ID
    @Mutation(() => String)
    async close(
        @Args('closeWalletData') closeWalletData: CloseWalletDto,
    ): Promise<string> {
        return await this._walletsService.close(closeWalletData)
    }

    // Deposit Mutation
    @Mutation(() => TransactionObjectType)
    async deposit(
        @Args('makeDepositData') makeDepositData: MakeDepositDto,
    ): Promise<TransactionObjectType> {
        return await this._walletsService.deposit({
            walletId: makeDepositData.walletId,
            money: makeDepositData.money,
        })
    }

    // Withdraw Mutation
    @Mutation(() => TransactionObjectType)
    async withdraw(
        @Args('makeWithdrawData') makeWithdrawData: MakeDepositDto,
    ): Promise<TransactionObjectType> {
        return await this._walletsService.withdraw({
            walletId: makeWithdrawData.walletId,
            money: makeWithdrawData.money,
        })
    }

    // Mutation to transfer money between wallets
    @Mutation(() => TransactionObjectType)
    async createTransaction(
        @Args('makeTransactionData')
        makeTransactionData: MakeTransactionDto,
    ): Promise<TransactionObjectType> {
        return await this._walletsService.transaction(makeTransactionData)
    }
}
