import appendTotal from './append-total'

describe('appendTotal', () => {
  it('should append total with single transaction', () => {
    const transactions: Order[] = [[100, 1000]]

    const withTotal = [[100, 1000, 1000]]

    expect(appendTotal(transactions)).toEqual(withTotal)
  })

  it('should append total with multiple transactions', () => {
    const transactions: Order[] = [
      [100, 1000],
      [200, 2000],
      [300, 3000]
    ]

    const withTotal = [
      [100, 1000, 1000],
      [200, 2000, 3000],
      [300, 3000, 6000]
    ]

    expect(appendTotal(transactions)).toEqual(withTotal)
  })
})
