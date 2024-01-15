import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import { FC } from 'react'
import styles from '../styles/Home.module.css'

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <Image src="/solanaLogo.png" height={30} width={200} alt={''} />
      <span>Token Program</span>
      <WalletMultiButton />
    </div>
  )
}
