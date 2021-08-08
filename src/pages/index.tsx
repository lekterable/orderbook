import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

import { Orderbook } from '../components'
import { Feed } from '../libs'
import { isBrowser, throttle } from '../utils'
import styles from '../styles/Home.module.css'

const feed = isBrowser ? new Feed('PI_XBTUSD') : null

const Home = () => {
  const [orders, setOrders] = useState<Orders | null>(null)

  const isRendered = useRef(false)

  useEffect(() => {
    const throttled = throttle((error: Error, data: ParsedData) => {
      if (error) return console.error(error)

      if (!isRendered.current) {
        setOrders(data)
        return (isRendered.current = true)
      }

      return feed?.unsubscribe()
    }, 100)

    feed?.subscribe(throttled)

    return () => feed?.unsubscribe()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Order Book</title>
        <meta name="description" content="Order Book" />
      </Head>
      <main className={styles.main}>
        {orders && <Orderbook orders={orders} />}
      </main>
    </div>
  )
}

export default Home
