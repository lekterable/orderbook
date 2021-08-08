type Order = [price: number, size: number]

type Orders = { asks: Order[]; bids: Order[] }

type ParsedData = { type: FeedType } & Orders
