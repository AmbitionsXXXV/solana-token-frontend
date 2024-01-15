import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { FC, useEffect, useState } from 'react'

export const BalanceDisplay: FC = () => {
  // 使用状态变量来存储账户余额
  const [balance, setBalance] = useState(0)

  // 使用 Solana 钱包适配器的钩子来获取连接和钱包信息
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  useEffect(() => {
    // 如果没有连接或没有公钥，则不执行任何操作
    if (!connection || !publicKey) return

    // 获取并设置账户的余额信息
    connection.getAccountInfo(publicKey).then(info => {
      setBalance(info.lamports)
    })
  }, [connection, publicKey])

  return (
    <div>
      <p>{publicKey ? `SOL Balance: ${balance / LAMPORTS_PER_SOL}` : ''}</p>
    </div>
  )
}
