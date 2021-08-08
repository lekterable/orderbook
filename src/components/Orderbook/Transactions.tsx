import React from 'react'
import { formatNumber } from '../../utils'

type Props = {
  transactions: [price: number, size: number, total: number][]
}

const Transactions = ({ transactions }: Props) => (
  <tbody>
    {transactions.map(([price, size, total]) => (
      <tr key={price}>
        <td>{formatNumber(price, { minimumFractionDigits: 2 })}</td>
        <td>{formatNumber(size)}</td>
        <td>{formatNumber(total)}</td>
      </tr>
    ))}
  </tbody>
)

export default Transactions
