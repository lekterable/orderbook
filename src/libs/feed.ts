enum EventType {
  Info = 'info',
  Subscribe = 'subscribe',
  Subscribed = 'subscribed',
  Unsubscribe = 'unsubscribe',
  Unsubscribed = 'unsubscribed',
  Alert = 'alert'
}

enum FeedType {
  Snapshot = 'book_ui_1_snapshot',
  Delta = 'book_ui_1'
}

type EventData = {
  event: EventType | string
}

type FeedData = {
  event: undefined
  feed: FeedType
  asks: Order[]
  bids: Order[]
}

type Data = EventData | FeedData

type Subscription = {
  (error: Error, parsedData: null): void
  (error: null, parsedData: ParsedData): void
}

const parseData = (data: Data): ParsedData | null => {
  switch (data.event) {
    case EventType.Info:
    case EventType.Subscribed:
      return null

    case undefined: {
      //TODO: check product id
      const { feed: type, bids, asks } = data

      if (type === FeedType.Snapshot || type === FeedType.Delta) {
        return { type, bids, asks }
      }

      throw new Error(`Unexpected feed type \`${type}\` received.`)
    }

    default:
      throw new Error(`Unexpected event type \`${data.event}\` received.`)
  }
}

class Feed {
  #socket: WebSocket
  #product: string
  #subscription: Subscription | null

  constructor(product: string) {
    this.#socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1')
    this.#product = product
    this.#subscription = null
  }

  unsubscribe() {
    this.#subscription = null

    const isOpen = this.#socket.readyState === WebSocket.OPEN

    if (isOpen) {
      this.#socket.send(
        JSON.stringify({
          event: EventType.Unsubscribe,
          feed: 'book_ui_1',
          product_ids: [this.#product]
        })
      )
      this.#socket.close()
    }
  }

  subscribe(subscription: Subscription) {
    this.#subscription = subscription

    this.#socket.onopen = () =>
      this.#socket.send(
        JSON.stringify({
          event: EventType.Subscribe,
          feed: 'book_ui_1',
          product_ids: [this.#product]
        })
      )

    this.#socket.onmessage = ({ data }) => {
      if (!this.#subscription) return this.unsubscribe()

      try {
        const parsedData = parseData(JSON.parse(data))

        if (!parsedData) return

        this.#subscription(null, parsedData)
      } catch (error) {
        this.#subscription(error, null)
      }
    }
  }
}

export default Feed
