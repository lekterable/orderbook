import { EventType, FeedType } from '../constants/enums'
import { API_VERSION, URL } from '../constants/misc'

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
  #socket = new WebSocket(URL)
  #product: string
  #subscription: Subscription | null

  constructor(product: string) {
    this.open()
    this.#product = product
    this.#subscription = null
  }

  open() {
    this.#socket = new WebSocket(URL)
  }

  get isOpen() {
    return this.#socket.readyState === WebSocket.OPEN
  }

  get product() {
    return this.#product
  }

  set product(product: string) {
    this.#product = product

    const subscription = this.#subscription

    this.unsubscribe()
    this.open()

    if (subscription) this.subscribe(subscription)
  }

  unsubscribe() {
    this.#subscription = null

    if (this.isOpen) {
      this.#socket.send(
        JSON.stringify({
          event: EventType.Unsubscribe,
          feed: API_VERSION,
          product_ids: [this.#product]
        })
      )
      this.#socket.close()
    }
  }

  subscribe(subscription: Subscription) {
    if (!this.isOpen) this.open()

    this.#subscription = subscription

    this.#socket.onopen = () =>
      this.#socket.send(
        JSON.stringify({
          event: EventType.Subscribe,
          feed: API_VERSION,
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

  error() {
    this.#socket.send(
      JSON.stringify({
        event: 'error',
        feed: API_VERSION,
        product_ids: [this.#product]
      })
    )

    setTimeout(() => this.unsubscribe(), 500)
  }
}

export default Feed
