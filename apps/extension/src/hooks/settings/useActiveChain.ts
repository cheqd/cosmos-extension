import {
  getSeiEvmInfo,
  Key,
  SeiEvmInfoEnum,
  SelectedNetworkType,
  useActiveChain as useActiveChainWalletHooks,
  useFeatureFlags,
  useGetChains,
  usePendingTxState,
  useSetActiveChain as useSetActiveChainWalletHooks,
  useSetSelectedNetwork,
} from '@leapwallet/cosmos-wallet-hooks'
import { ChainInfo, SupportedChain } from '@leapwallet/cosmos-wallet-sdk'
import { useQueryClient } from '@tanstack/react-query'
import { selectedChainAlertState } from 'atoms/selected-chain-alert'
import { COMPASS_CHAINS } from 'config/config'
import { AGGREGATED_CHAIN_KEY } from 'config/constants'
import { ACTIVE_CHAIN, KEYSTORE } from 'config/storage-keys'
import { useSetNetwork } from 'hooks/settings/useNetwork'
import { useChainInfos } from 'hooks/useChainInfos'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { AggregatedSupportedChain } from 'types/utility'
import { sendMessageToTab } from 'utils'
import browser from 'webextension-polyfill'

import { isCompassWallet } from '../../utils/isCompassWallet'
import useActiveWallet, { useUpdateKeyStore } from './useActiveWallet'

export function useActiveChain(): SupportedChain {
  return useActiveChainWalletHooks()
}

export function useSetActiveChain() {
  const chainInfos = useGetChains()
  const setSelectedChainAlert = useSetRecoilState(selectedChainAlertState)
  const { setPendingTx } = usePendingTxState()
  const setNetwork = useSetNetwork()
  const setSelectedNetwork = useSetSelectedNetwork()

  const updateKeyStore = useUpdateKeyStore()
  const { activeWallet, setActiveWallet } = useActiveWallet()
  const setActiveChain = useSetActiveChainWalletHooks()

  const queryClient = useQueryClient()

  return async (chain: AggregatedSupportedChain, chainInfo?: ChainInfo) => {
    const storage = await browser.storage.local.get(['networkMap', KEYSTORE])
    if (chain !== AGGREGATED_CHAIN_KEY) {
      const keystore = storage[KEYSTORE]
      if (keystore) {
        const shouldUpdateKeystore = Object.keys(keystore).some((key) => {
          const wallet = keystore[key]
          return wallet && (!wallet.addresses[chain] || !wallet.pubKeys?.[chain])
        })
        if (activeWallet && shouldUpdateKeystore) {
          const updatedKeystore = await updateKeyStore(activeWallet, chain)
          await setActiveWallet(updatedKeystore[activeWallet.id] as Key)
        }
      }
    }

    await queryClient.cancelQueries()
    setActiveChain(chain as SupportedChain)
    setSelectedChainAlert(true)
    browser.storage.local.set({ [ACTIVE_CHAIN]: chain })
    setPendingTx(null)

    if (chain !== AGGREGATED_CHAIN_KEY) {
      const networkMap = JSON.parse(storage.networkMap ?? '{}')
      const _chainInfo = chainInfos[chain] || chainInfo
      let _network: SelectedNetworkType = 'mainnet'

      if (chain === 'seiDevnet') {
        setSelectedNetwork('mainnet')
        setNetwork('mainnet')
      } else {
        if (networkMap[chain]) {
          let network = networkMap[chain]
          let hasChainOnlyTestnet = false

          if (
            _chainInfo &&
            !_chainInfo?.beta &&
            _chainInfo?.chainId === _chainInfo?.testnetChainId
          ) {
            hasChainOnlyTestnet = true
          }

          if (hasChainOnlyTestnet && network !== 'testnet') {
            network = 'testnet'
            _network = 'testnet'
          }

          setNetwork(network)
          setSelectedNetwork(network)
        } else if (_chainInfo && _chainInfo?.apis?.rpc) {
          setNetwork('mainnet')
          setSelectedNetwork('mainnet')
        } else if (_chainInfo && _chainInfo?.apis?.rpcTest) {
          setNetwork('testnet')
          setSelectedNetwork('testnet')
          _network = 'testnet'
        }
      }

      if (isCompassWallet()) {
        const chainId = await getSeiEvmInfo({
          activeChain: chain as 'seiDevnet' | 'seiTestnet2',
          activeNetwork: _network,
          infoType: SeiEvmInfoEnum.EVM_CHAIN_ID,
        })
        await sendMessageToTab({ event: 'chainChanged', data: chainId })
      }
    }
  }
}

export function useInitActiveChain() {
  const chainInfos = useChainInfos()
  const chains = useGetChains()
  const setActiveChain = useSetActiveChainWalletHooks()
  const { data: featureFlags } = useFeatureFlags()

  useEffect(() => {
    browser.storage.local.get(ACTIVE_CHAIN).then((storage) => {
      let activeChain: SupportedChain = storage[ACTIVE_CHAIN]
      const leapFallbackChain =
        featureFlags?.give_all_chains_option_in_wallet?.extension === 'active'
          ? (AGGREGATED_CHAIN_KEY as SupportedChain)
          : chainInfos.cosmos.key

      const defaultActiveChain = isCompassWallet() ? chainInfos.seiTestnet2.key : leapFallbackChain

      if (
        (activeChain as AggregatedSupportedChain) === AGGREGATED_CHAIN_KEY &&
        featureFlags?.give_all_chains_option_in_wallet?.extension === 'active' &&
        !isCompassWallet()
      ) {
        setActiveChain(activeChain)
        return
      }

      if (!activeChain || chains[activeChain] === undefined) {
        activeChain = defaultActiveChain
      }

      if (isCompassWallet() && !COMPASS_CHAINS.includes(activeChain)) {
        activeChain = defaultActiveChain
      }

      setActiveChain(activeChain)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainInfos, chains, featureFlags])
}
