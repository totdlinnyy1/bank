import { Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { TransactionObjectType } from '../transactions/graphql/transaction.object-type'

import { CreateWalletInput } from './graphql/inputs/createWallet.input'
import { DepositOrWithdrawInput } from './graphql/inputs/depositOrWithdraw.input'
import { MakeTransactionInput } from './graphql/inputs/makeTransaction.input'
import { WalletObjectType } from './graphql/wallet.object-type'
import { WalletsService } from './wallets.service'

@Resolver(() => WalletObjectType)
export class WalletsResolver {
    private readonly _logger: Logger = new Logger(WalletsResolver.name)

    constructor(private readonly _walletsService: WalletsService) {}

    // Request to receive all wallets
    @Query(() => [WalletObjectType])
    async wallets(): Promise<WalletObjectType[]> {
        this._logger.debug('GET WALLETS')
        return await this._walletsService.wallets()
    }

    // Request for a wallet by id
    @Query(() => WalletObjectType)
    async wallet(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<WalletObjectType> {
        this._logger.debug('GET WALLET BY ID')
        return await this._walletsService.wallet(id)
    }

    // Mutation to create a wallet
    @Mutation(() => WalletObjectType)
    async createWallet(
        @Args('createWalletData', { type: () => CreateWalletInput })
        createWalletData: CreateWalletInput,
    ): Promise<WalletObjectType> {
        this._logger.debug('CREATE WALLET')
        this._logger.debug({ createWalletData })
        return await this._walletsService.create(createWalletData)
    }

    // Mutation to close the wallet by ID
    @Mutation(() => String)
    async close(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<string> {
        this._logger.debug('CLOSE WALLET')
        this._logger.debug(id)
        return await this._walletsService.close(id)
    }

    // Deposit Mutation
    @Mutation(() => TransactionObjectType)
    @UsePipes(new ValidationPipe())
    async deposit(
        @Args('makeDepositData', { type: () => DepositOrWithdrawInput })
        makeDepositData: DepositOrWithdrawInput,
    ): Promise<TransactionObjectType> {
        this._logger.debug('MAKE DEPOSIT')
        this._logger.debug({ makeDepositData })
        return await this._walletsService.deposit(makeDepositData)
    }

    // Withdraw Mutation
    @Mutation(() => TransactionObjectType)
    @UsePipes(new ValidationPipe())
    async withdraw(
        @Args('makeWithdrawData', { type: () => DepositOrWithdrawInput })
        makeWithdrawData: DepositOrWithdrawInput,
    ): Promise<TransactionObjectType> {
        this._logger.debug('MAKE WITHDRAW')
        this._logger.debug({ makeWithdrawData })
        return await this._walletsService.withdraw(makeWithdrawData)
    }

    // Mutation to transfer money between wallets
    @Mutation(() => TransactionObjectType)
    @UsePipes(new ValidationPipe())
    async createTransaction(
        @Args('makeTransactionData', { type: () => MakeTransactionInput })
        makeTransactionData: MakeTransactionInput,
    ): Promise<TransactionObjectType> {
        this._logger.debug('MAKE TRANSACTION')
        this._logger.debug({ makeTransactionData })
        return await this._walletsService.transaction(makeTransactionData)
    }
}
