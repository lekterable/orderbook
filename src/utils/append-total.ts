const appendTotal = (transactions: Order[]) =>
  transactions.reduce<[number, number, number][]>((acc, [price, size]) => {
    const last = acc[acc.length - 1]

    if (!last) return [...acc, [price, size, size]]

    const total = last[2]

    return [...acc, [price, size, total + size]]
  }, [])

export default appendTotal
