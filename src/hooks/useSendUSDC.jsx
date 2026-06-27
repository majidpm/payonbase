import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, toHex } from 'viem'
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

// ✅ ساخت dataSuffix بر اساس ERC-8021
function buildDataSuffix(builderCode) {
  // تبدیل builder code به hex
  const hexCode = toHex(builderCode).slice(2) // حذف '0x'
  
  // طول builder code در hex
  const lengthByte = builderCode.length.toString(16).padStart(2, '0')
  
  // 8 بار 8021 (ERC-8021 identifier)
  const suffix = '8021'.repeat(8)
  
  // فرمت نهایی: 0x + length + hex_code + 00 + suffix
  return `0x${lengthByte}${hexCode}00${suffix}`
}

const DATA_SUFFIX = buildDataSuffix(BUILDER_CODE)
console.log('🔧 Builder Data Suffix:', DATA_SUFFIX)

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
        // ✅ اضافه کردن Builder Code به data تراکنش
        dataSuffix: DATA_SUFFIX
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