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
  const [txSig, setTxSig] = useState('')
  const [, setTokenAccount] = useState('')
  const [balance, setBalance] = useState('')
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const link = () => {
    return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
  }

  const mintTo = async event => {
    event.preventDefault()
    if (!connection || !publicKey) {
      return
    }
    const transaction = new web3.Transaction()

    const mintPubKey = new web3.PublicKey(event.target.mint.value)
    const recipientPubKey = new web3.PublicKey(event.target.recipient.value)
    const amount = event.target.amount.value

    const associatedToken = await getAssociatedTokenAddress(
      mintPubKey,
      recipientPubKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )

    transaction.add(
      createMintToInstruction(mintPubKey, associatedToken, publicKey, amount),
    )

    const signature = await sendTransaction(transaction, connection)

    await connection.confirmTransaction(signature, 'confirmed')

    setTxSig(signature)
    setTokenAccount(associatedToken.toString())

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
