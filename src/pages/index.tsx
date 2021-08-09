import { useCallback, useEffect, useReducer } from 'react'
import Head from 'next/head'
import throttle from 'lodash.throttle'

import { Orderbook } from '../components'
import { Feed } from '../libs'
import { isBrowser } from '../utils'
import styles from '../styles/Home.module.css'
import { FeedType } from '../constants/enums'
import { BTC_USD, ETH_USD } from '../constants/products'
import reducer from '../reducers'
import { initialize, update } from '../actions'

const feed = isBrowser() ? new Feed(BTC_USD) : null

const Home = () => {
  const [orders, dispatch] = useReducer(reducer, null)
  const subscription: Subscription = useCallback((error, data) => {
    if (error) return console.error(error)
    if (!data) return console.error('No data received.')

    const orders = { asks: data.asks, bids: data.bids }

    if (data.type === FeedType.Snapshot) {
      dispatch(initialize(orders))
    } else if (data.type === FeedType.Delta) {
      dispatch(update(orders))
    }
  }, [])

  const handleToggleFeed = () => {
    if (!feed) return

    const newProduct = feed.product === BTC_USD ? ETH_USD : BTC_USD

    feed.product = newProduct

    if (!feed.isOpen) {
      feed.subscribe(subscription)
    }
  }

  const handleKillFeed = () => {
    if (!feed) return

    if (feed.isOpen) {
      feed.error()
      setTimeout(() => feed.unsubscribe(), 500)
    } else {
      feed.open()
      feed.subscribe(subscription)
    }
  }

  useEffect(() => {
    const throttled = throttle(subscription, 50)
    feed?.subscribe(throttled)

    return () => feed?.unsubscribe()
  }, [subscription])

  return (
    <div className={styles.container}>
      <Head>
        <title>Order Book</title>
        <meta name="description" content="Order Book" />
      </Head>
      <main className={styles.main}>
        {orders && (
          <>
            <Orderbook orders={orders} />
            <div className={styles.buttons}>
              <button className={styles.toggle} onClick={handleToggleFeed}>
                Toggle Feed
              </button>
              <button className={styles.kill} onClick={handleKillFeed}>
                Kill Feed
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
