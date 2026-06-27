import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { base } from 'wagmi/chains'

// ✅ Builder Code از Base
const BUILDER_CODE = 'bc_3mjjig8s'

// USDC Contract Address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

// ERC20 ABI (فقط تابع transfer)
const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
]

export function useSendUSDC() {
  const { 
    writeContract, 
    data: txHash, 
    isPending, 
    isError, 
    error,
    reset 
  } = useWriteContract()

  const { 
    isLoading: isConfirming, 
    isSuccess 
  } = useWaitForTransactionReceipt({ 
    hash: txHash 
  })

  async function sendUSDC(to, amount) {
    try {
      const amountInWei = parseUnits(amount.toString(), 6) // USDC has 6 decimals

      writeContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to, amountInWei],
        chainId: base.id,
        // ✅ Builder Code برای شناسایی سازنده
        builder: BUILDER_CODE
      })
    } catch (err) {
      console.error('Send USDC error:', err)
      throw err
    }
  }

  return {
    sendUSDC,
    txHash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    reset
  }
}