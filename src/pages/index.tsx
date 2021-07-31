import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home = () => (
  <div className={styles.container}>
    <Head>
      <title>Order Book</title>
      <meta name="description" content="Order Book" />
    </Head>
    <main className={styles.main}>Order Book</main>
  </div>
)

export default Home
