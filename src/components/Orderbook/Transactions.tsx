import React from 'react'

type Props = {
  transactions: [price: number, size: number, total: number][]
}

const Transactions = ({ transactions }: Props) => (
  <tbody>
    {transactions.map(([price, size, total]) => (
      <tr key={price}>
        <td>{price}</td>
        <td>{size}</td>
        <td>{total}</td>
      </tr>
    ))}
  </tbody>
)

export default Transactions
