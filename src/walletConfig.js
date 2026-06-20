import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'PayLink',
  projectId: 'YOUR_WALLETCONNECT_ID',
  chains: [base],
})