const mergeOrders = (orders: Order[], updatedOrders: Order[]) => {
  let newOrders = [...orders]

  updatedOrders.forEach(([price, size]) => {
    const index = newOrders.findIndex(([askPrice]) => askPrice === price)
    const isEmpty = size === 0

    if (index < 0) {
      if (isEmpty) return
      return (newOrders = [...newOrders, [price, size]])
    }
    if (isEmpty) return newOrders.splice(index, 1)

    newOrders[index][1] = size
  })

  return newOrders
}

export default mergeOrders
