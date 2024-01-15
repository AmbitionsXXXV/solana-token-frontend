import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'

export const MintToForm: FC = () => {
  // 使用状态变量来存储交易签名、代币账户地址和余额
  const [txSig, setTxSig] = useState('')
  const [, setTokenAccount] = useState('') // 这个状态变量似乎未被使用
  const [balance, setBalance] = useState('')

  // 使用 Solana 钱包适配器的钩子来获取连接和钱包信息
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  // 生成链接到 Solana 区块链浏览器的函数
  const link = () =>
    txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''

  // 定义执行铸造操作的异步函数
  const mintTo = async event => {
    event.preventDefault()
    if (!connection || !publicKey) {
      return
    }

    // 创建新的交易
    const transaction = new web3.Transaction()

    // 从表单中获取代币发行地址、接收者公钥和铸造数量
    const mintPubKey = new web3.PublicKey(event.target.mint.value)
    const recipientPubKey = new web3.PublicKey(event.target.recipient.value)
    const amount = event.target.amount.value

    // 获取接收者的关联代币地址
    const associatedToken = await getAssociatedTokenAddress(
      mintPubKey,
      recipientPubKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )

    // 向交易中添加铸造代币的指令
    transaction.add(
      createMintToInstruction(mintPubKey, associatedToken, publicKey, amount),
    )

    // 发送交易并等待确认
    const signature = await sendTransaction(transaction, connection)
    await connection.confirmTransaction(signature, 'confirmed')

    // 更新状态变量
    setTxSig(signature)
    setTokenAccount(associatedToken.toString())

    // 获取并更新账户余额
    const account = await getAccount(connection, associatedToken)
    setBalance(account.amount.toString())
  }

  return (
    <div>
      <br />

      {publicKey ? (
        <form onSubmit={mintTo} className={styles.form}>
          <label htmlFor="mint">Token Mint:</label>
          <input
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint"
            required
          />
          <label htmlFor="recipient">Recipient:</label>
          <input
            id="recipient"
            type="text"
            className={styles.formField}
            placeholder="Enter Recipient PublicKey"
            required
          />
          <label htmlFor="amount">Amount Tokens to Mint:</label>
          <input
            id="amount"
            type="text"
            className={styles.formField}
            placeholder="e.g. 100"
            required
          />
          <button type="submit" className={styles.formButton}>
            Mint Tokens
          </button>
        </form>
      ) : (
        <span></span>
      )}

      {txSig ? (
        <div>
          <p>Token Balance: {balance} </p>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  )
}
