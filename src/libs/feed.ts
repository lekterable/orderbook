import { EventType } from '../constants/enums'
import { API_VERSION, URL } from '../constants/misc'
import { parseData } from '../utils'

class Feed {
  #socket = new WebSocket(URL)
  #product: string
  #subscription: Subscription | null

  constructor(product: string) {
    this.#product = product
    this.#subscription = null
  }

  open() {
    this.#socket = new WebSocket(URL)
  }

  close() {
    this.#socket.close()
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
      this.close()
    }
  }

  subscribe(subscription: Subscription) {
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
  }
}

export default Feed
