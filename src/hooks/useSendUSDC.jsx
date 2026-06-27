import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, stringToHex } from 'viem'
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
  // 1. تبدیل builder code به hex با استفاده از stringToHex
  const hexCode = stringToHex(builderCode).slice(2)
  
  // 2. طول builder code در hex (2 کاراکتر)
  const lengthHex = builderCode.length.toString(16).padStart(2, '0')
  
  // 3. 8 بار 8021 (ERC-8021 identifier)
  const erc8021 = '8021'.repeat(8)
  
  // ✅ فرمت نهایی: length + hex_code + 00 + identifier
  const dataSuffix = `0x${lengthHex}${hexCode}00${erc8021}`
  
  console.log('🔧 Builder Code:', builderCode)
  console.log('🔧 Length:', builderCode.length, '(hex:', lengthHex + ')')
  console.log('🔧 Hex Code:', hexCode)
  console.log('🔧 Full Suffix:', dataSuffix)
  
  return dataSuffix
}

const DATA_SUFFIX = buildDataSuffix(BUILDER_CODE)

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
      const amountInWei = parseUnits(amount.toString(), 6)

      console.log('📤 Sending USDC...')
      console.log('  To:', to)
      console.log('  Amount:', amount)
      console.log('  Data Suffix:', DATA_SUFFIX)

      writeContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to, amountInWei],
        chainId: base.id,
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