import { NextPage } from 'next'
import Head from 'next/head'
import { AppBar } from '../components/AppBar'
import { BalanceDisplay } from '../components/BalanceDisplay'
import { CreateMintForm } from '../components/CreateMint'
import { CreateTokenAccountForm } from '../components/CreateTokenAccount'
import { MintToForm } from '../components/MintToForm'
import WalletContextProvider from '../components/WalletContextProvider'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Token Program</title>
        <meta name="description" content="Token Program" />
      </Head>

      <WalletContextProvider>
        <AppBar />

        <div className={styles.AppBody}>
          <BalanceDisplay />
          <CreateMintForm />
          <CreateTokenAccountForm />
          <MintToForm />
        </div>
      </WalletContextProvider>
    </div>
  )
}

export default Home
