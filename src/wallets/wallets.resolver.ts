import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { TransactionObjectType } from '../transactions/graphql/transaction.objectType'

import { CloseWalletInput } from './graphql/inputs/closeWallet.input'
import { CreateWalletInput } from './graphql/inputs/createWallet.input'
import { GetSingleWalletInput } from './graphql/inputs/getSingleWallet.input'
import { MakeDepositInput } from './graphql/inputs/makeDeposit.input'
import { MakeTransactionInput } from './graphql/inputs/makeTransaction.input'
import { MakeWithdrawInput } from './graphql/inputs/makeWithdraw.input'
import { WalletObjectType } from './graphql/wallet.objectType'
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
        @Args('getWalletData', { type: () => GetSingleWalletInput })
        getWalletData: GetSingleWalletInput,
    ): Promise<WalletObjectType> {
        return await this._walletsService.wallet(getWalletData)
    }

    // Mutation to create a wallet
    @Mutation(() => WalletObjectType)
    async createWallet(
        @Args('createWalletData', { type: () => CreateWalletInput })
        createWalletData: CreateWalletInput,
    ): Promise<WalletObjectType> {
        return await this._walletsService.create(createWalletData)
    }

    // Mutation to close the wallet by ID
    @Mutation(() => String)
    async close(
        @Args('closeWalletData', { type: () => CloseWalletInput })
        closeWalletData: CloseWalletInput,
    ): Promise<string> {
        return await this._walletsService.close(closeWalletData)
    }

    // Deposit Mutation
    @Mutation(() => TransactionObjectType)
    async deposit(
        @Args('makeDepositData', { type: () => MakeDepositInput })
        makeDepositData: MakeDepositInput,
    ): Promise<TransactionObjectType> {
        return await this._walletsService.deposit({
            walletId: makeDepositData.walletId,
            money: makeDepositData.money,
        })
    }

    // Withdraw Mutation
    @Mutation(() => TransactionObjectType)
    async withdraw(
        @Args('makeWithdrawData', { type: () => MakeWithdrawInput })
        makeWithdrawData: MakeWithdrawInput,
    ): Promise<TransactionObjectType> {
        return await this._walletsService.withdraw({
            walletId: makeWithdrawData.walletId,
            money: makeWithdrawData.money,
        })
    }

    // Mutation to transfer money between wallets
    @Mutation(() => TransactionObjectType)
    async createTransaction(
        @Args('makeTransactionData', { type: () => MakeTransactionInput })
        makeTransactionData: MakeTransactionInput,
    ): Promise<TransactionObjectType> {
        return await this._walletsService.transaction(makeTransactionData)
    }
}
