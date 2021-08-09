import mergeOrders from './merge-orders'

describe('mergeOrders', () => {
  const current: Order[] = [
    [100, 1000],
    [200, 2000],
    [300, 3000]
  ]

  it("should add the order if it doesn't exist", () => {
    const updated: Order[] = [[400, 4000]]
    const expected = [
      [100, 1000],
      [200, 2000],
      [300, 3000],
      [400, 4000]
    ]

    expect(mergeOrders(current, updated)).toEqual(expected)
  })

  it('should update the existing order', () => {
    const updated: Order[] = [[200, 2]]
    const expected = [
      [100, 1000],
      [200, 2],
      [300, 3000]
    ]

    expect(mergeOrders(current, updated)).toEqual(expected)
  })

  it('should remove the order if the price is `0`', () => {
    const updated: Order[] = [[200, 0]]
    const expected = [
      [100, 1000],
      [300, 3000]
    ]

    expect(mergeOrders(current, updated)).toEqual(expected)
  })

  it('should merge multiple orders', () => {
    const updated: Order[] = [
      [100, 1],
      [200, 0],
      [400, 4000],
      [500, 5000],
      [100000, 0]
    ]
    const expected = [
      [100, 1],
      [300, 3000],
      [400, 4000],
      [500, 5000]
    ]

    expect(mergeOrders(current, updated)).toEqual(expected)
  })
})
