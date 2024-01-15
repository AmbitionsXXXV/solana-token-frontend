import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'

// 创建并导出 CreateTokenAccountForm 组件
export const CreateTokenAccountForm: FC = () => {
  // 定义状态变量，用于存储交易签名和代币账户地址
  const [txSig, setTxSig] = useState('')
  const [tokenAccount, setTokenAccount] = useState('')

  // 使用 Solana 钱包适配器的钩子来获取连接和钱包信息
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  // 生成链接到 Solana 区块链浏览器的函数
  const link = () =>
    txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''

  // 定义创建代币账户的异步函数
  const createTokenAccount = async event => {
    event.preventDefault()
    if (!connection || !publicKey) return

    // 创建新的交易
    const transaction = new web3.Transaction()

    // 从表单中获取代币发行地址和代币账户所有者的公钥
    const owner = new web3.PublicKey(event.target.owner.value)
    const mint = new web3.PublicKey(event.target.mint.value)

    // 获取与特定代币和所有者相关联的代币账户地址
    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )

    // 向交易中添加创建关联代币账户的指令
    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
    )

    // 发送交易并处理结果
    sendTransaction(transaction, connection).then(sig => {
      setTxSig(sig)
      setTokenAccount(associatedToken.toString())
    })
  }

  // 渲染组件
  return (
    <div>
      <br />

      {publicKey ? (
        // 显示表单以创建代币账户
        <form onSubmit={createTokenAccount} className={styles.form}>
          <label htmlFor="mint">Token Mint:</label>
          <input
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint"
            required
          />
          <label htmlFor="owner">Token Account Owner:</label>
          <input
            id="owner"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Account Owner PublicKey"
            required
          />
          <button type="submit" className={styles.formButton}>
            Create Token Account
          </button>
        </form>
      ) : (
        // 当钱包未连接时不显示表单
        <span></span>
      )}

      {txSig ? (
        // 显示交易信息和链接
        <div>
          <p>Token Account Address: {tokenAccount}</p>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  )
}
