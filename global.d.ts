type Order = [price: number, size: number]

type Orders = { asks: Order[]; bids: Order[] }

type ParsedData = { type: FeedType } & Orders

type Subscription = {
  (error: Error, parsedData: null): void
  (error: null, parsedData: ParsedData): void
}
