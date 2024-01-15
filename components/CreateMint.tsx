import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'

export const CreateMintForm: FC = () => {
  const [txSig, setTxSig] = useState('')
  const [mint, setMint] = useState('')

  // 使用 Solana 钱包适配器的钩子来获取连接和钱包信息
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  // 生成链接到 Solana 区块链浏览器的函数
  const link = () =>
    txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''

  // 定义创建代币发行的异步函数
  const createMint = async event => {
    event.preventDefault()
    if (!connection || !publicKey) return

    // 生成新的密钥对用于代币发行
    const mint = web3.Keypair.generate()

    // 获取创建代币发行所需的最小余额
    const lamports = await getMinimumBalanceForRentExemptMint(connection)

    // 创建新的交易
    const transaction = new web3.Transaction()

    // 向交易中添加创建账户和初始化代币发行的指令
    transaction.add(
      web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        // 租金免除
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      // 初始新的 token 账户
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        publicKey,
        publicKey,
        TOKEN_PROGRAM_ID,
      ),
    )

    // 发送交易并处理结果
    sendTransaction(transaction, connection, {
      signers: [mint],
    }).then(sig => {
      setTxSig(sig)
      setMint(mint.publicKey.toString())
    })
  }

  // 渲染组件
  return (
    <div>
      {publicKey ? (
        // 显示表单以创建代币发行
        <form onSubmit={createMint} className={styles.form}>
          <button type="submit" className={styles.formButton}>
            Create Mint
          </button>
        </form>
      ) : (
        // 提示连接钱包
        <span>Connect Your Wallet</span>
      )}

      {txSig ? (
        // 显示交易信息和链接
        <div>
          <p>Token Mint Address: {mint}</p>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  )
}
