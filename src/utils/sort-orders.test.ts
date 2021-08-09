import sortOrders from './sort-orders'

describe('sortOrders', () => {
  it('should sort orders by price', () => {
    const unsortedOrders: Order[] = [
      [300, 1000],
      [500, 1000],
      [700, 1000],
      [200, 1000],
      [100, 1000]
    ]
    const sortedOrders = [
      [100, 1000],
      [200, 1000],
      [300, 1000],
      [500, 1000],
      [700, 1000]
    ]

    expect(unsortedOrders.sort(sortOrders)).toEqual(sortedOrders)
  })
})
