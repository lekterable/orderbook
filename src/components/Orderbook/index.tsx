import React from 'react'
import appendTotal from '../../utils/append-total'
import Head from './Head'
import Transactions from './Transactions'
import styles from '../../styles/Orderbook.module.css'

type Props = {
  orders: Orders
}

const Orderbook = ({ orders }: Props) => {
  const asks = appendTotal(orders.asks)
  const bids = appendTotal(orders.bids)

  return (
    <div className={styles.orderbook}>
      <span className={styles.name}>Order Book</span>
      <span className={styles.spread}>Spread:</span>
      <div className={styles.grouping}>
        <select>
          <option>Group 0.50</option>
        </select>
      </div>
      <table className={styles.asks}>
        <Head />
        <Transactions transactions={asks} />
      </table>
      <table className={styles.bids}>
        <Head />
        <Transactions transactions={bids} />
      </table>
    </div>
  )
}

export default Orderbook
