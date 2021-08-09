type Order = [price: number, size: number]

type Orders = { asks: Order[]; bids: Order[] }

type ParsedData = { type: FeedType } & Orders

type Subscription = (error: Error | null, parsedData: ParsedData | null) => void
