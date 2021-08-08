import { useEffect, useReducer } from 'react'
import Head from 'next/head'

import { Orderbook } from '../components'
import { Feed } from '../libs'
import { isBrowser, throttle } from '../utils'
import styles from '../styles/Home.module.css'
import { FeedType } from '../constants/enums'
import { BTC_USD } from '../constants/products'
import reducer from '../reducers'
import { initialize, update } from '../actions'

const feed = isBrowser ? new Feed(BTC_USD) : null

const Home = () => {
  const [orders, dispatch] = useReducer(reducer, null)

  useEffect(() => {
    const subscription: Subscription = (error, data) => {
      if (error) return console.error(error)
      if (!data) return console.error('No data received.')

      const orders = { asks: data.asks, bids: data.bids }

      if (data.type === FeedType.Snapshot) {
        dispatch(initialize(orders))
      } else if (data.type === FeedType.Delta) {
        dispatch(update(orders))
      }
    }

    const throttled = throttle(subscription, 100)
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
