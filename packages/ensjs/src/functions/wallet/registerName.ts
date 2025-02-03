import {
  encodeFunctionData,
  toHex,
  type Account,
  type Hash,
  type SendTransactionParameters,
  type Transport,
  BaseError,
  RawContractError,
  http,
  createWalletClient,
  publicActions,
} from 'viem'
import * as chains from 'viem/chains'
import { readContract, sendTransaction } from 'viem/actions'
import { packetToBytes } from 'viem/ens'
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js'
import { ethRegistrarControllerRegisterSnippet } from '../../contracts/ethRegistrarController.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { UnsupportedNameTypeError } from '../../errors/general.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { getNameType } from '../../utils/getNameType.js'
import {
  makeOffchainSubdomainRegistrationTuple,
  makeRegistrationTuple,
  makeSubdomainRegistrationTuple,
  type RegistrationParameters,
} from '../../utils/registerHelpers.js'
import { wrappedLabelLengthCheck } from '../../utils/wrapper.js'
import { nameWrapperSetSubnodeRecordSnippet } from '../../contracts/nameWrapper.js'
import { erc165SupportsInterfaceSnippet } from '../../contracts/erc165.js'
import { universalResolverFindResolverSnippet } from '../../contracts/universalResolver.js'
import { offchainRegisterSnippet } from '../../contracts/offchainResolver.js'
import { operationRouterSnippet } from '../../contracts/operationRouter.js'

export type RegisterNameDataParameters = RegistrationParameters & {
  /** Value of registration */
  value: bigint
}

export type RegisterNameDataReturnType = SimpleTransactionRequest & {
  value: bigint
  offchain?: boolean
}

export type RegisterNameParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  RegisterNameDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type RegisterNameReturnType = Hash

export const makeFunctionData = async <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  { value, ...args }: RegisterNameDataParameters,
): Promise<RegisterNameDataReturnType> => {
  const nameType = getNameType(args.name)

  switch (nameType) {
    case 'eth-2ld': {
      const labels = args.name.split('.')
      wrappedLabelLengthCheck(labels[0])

      return {
        to: getChainContractAddress({
          client: wallet,
          contract: 'ensEthRegistrarController',
        }),
        data: encodeFunctionData({
          abi: ethRegistrarControllerRegisterSnippet,
          functionName: 'register',
          args: makeRegistrationTuple(args),
        }),
        value,
      }
    }
    case 'eth-subname': {
      const [resolver] = await readContract(wallet, {
        address: getChainContractAddress({
          client: wallet,
          contract: 'ensUniversalResolver',
        }),
        abi: universalResolverFindResolverSnippet,
        functionName: 'findResolver',
        args: [toHex(packetToBytes(args.name))],
      })

      const offchainDomain = await readContract(wallet, {
        address: resolver,
        abi: erc165SupportsInterfaceSnippet,
        functionName: 'supportsInterface',
        args: ['0x66f07c14'], // Offchain Register
      })
      if (offchainDomain) {
        return {
          to: resolver,
          data: encodeFunctionData({
            abi: offchainRegisterSnippet,
            functionName: 'register',
            args: makeOffchainSubdomainRegistrationTuple(args),
          }),
          value,
          offchain: true,
        }
      }

      return {
        to: getChainContractAddress({
          client: wallet,
          contract: 'ensNameWrapper',
        }),
        data: encodeFunctionData({
          abi: nameWrapperSetSubnodeRecordSnippet,
          functionName: 'setSubnodeRecord',
          args: makeSubdomainRegistrationTuple(args),
        }),
        value,
      }
    }
    default:
      throw new UnsupportedNameTypeError({
        nameType,
        supportedNameTypes: ['eth-2ld', 'eth-subname'],
        details: 'Unsupported name type',
      })
  }
}

function getRevertErrorData(err: unknown) {
  if (!(err instanceof BaseError)) return undefined
  const error = err.walk() as RawContractError
  return error?.data as { errorName: string; args: unknown[] }
}

function getChain(chainId: number): chains.Chain | undefined {
  return Object.values(chains).find((chain) => chain.id === chainId)
}

/**
 * Registers a name on ENS
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link RegisterNameParameters}
 * @returns Transaction hash. {@link RegisterNameReturnType}
 *
 * @example
 * import { createPublicClient, createWalletClient, http, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getPrice } from '@ensdomains/ensjs/public'
 * import { randomSecret } from '@ensdomains/ensjs/utils'
 * import { commitName, registerName } from '@ensdomains/ensjs/wallet'
 *
 * const mainnetWithEns = addEnsContracts(mainnet)
 * const client = createPublicClient({
 *   chain: mainnetWithEns,
 *   transport: http(),
 * })
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 * const secret = randomSecret()
 * const params = {
 *   name: 'example.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   duration: 31536000, // 1 year
 *   secret,
 * }
 *
 * const commitmentHash = await commitName(wallet, params)
 * await client.waitForTransactionReceipt({ hash: commitmentHash }) // wait for commitment to finalise
 * await new Promise((resolve) => setTimeout(resolve, 60 * 1_000)) // wait for commitment to be valid
 *
 * const { base, premium } = await getPrice(client, { nameOrNames: params.name, duration: params.duration })
 * const value = (base + premium) * 110n / 100n // add 10% to the price for buffer
 * const hash = await registerName(wallet, { ...params, value })
 * // 0x...
 */
async function registerName<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    owner,
    duration,
    secret,
    resolverAddress,
    records,
    reverseRecord,
    fuses,
    value,
    ...txArgs
  }: RegisterNameParameters<TChain, TAccount, TChainOverride>,
): Promise<RegisterNameReturnType> {
  const data = await makeFunctionData(wallet, {
    name,
    owner,
    duration,
    secret,
    resolverAddress,
    records,
    reverseRecord,
    fuses,
    value,
  })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>

  if (!data.offchain) return sendTransaction(wallet, writeArgs)

  try {
    await readContract(wallet, {
      abi: operationRouterSnippet,
      functionName: 'getOperationHandler',
      args: [data.data],
      address: data.to,
    })
  } catch (e) {
    const errData = getRevertErrorData(e)

    if (errData?.errorName === 'OperationHandledOnchain') {
      const [chainId, contractAddress] = errData.args as [bigint, `0x${string}`]

      const l2Client = createWalletClient({
        chain: getChain(Number(chainId)),
        transport: http(),
      }).extend(publicActions)

      const registerParams = (await l2Client.readContract({
        address: contractAddress,
        abi: offchainRegisterSnippet,
        functionName: 'registerParams',
        args: [toHex(packetToBytes(name)), duration],
      })) as {
        price: bigint
        available: boolean
        token: `0x${string}`
        commitTime: bigint
        extraData: `0x${string}`
      }

      if (!registerParams.available) {
        throw new Error('Name is not available')
      }

      return sendTransaction(l2Client, {
        to: contractAddress,
        data: data.data,
        chain: l2Client.chain,
        account: txArgs.account!,
        value: registerParams.price,
      })
    }
  }
  throw new Error('Operation not handled')
}

registerName.makeFunctionData = makeFunctionData

export default registerName
