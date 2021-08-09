import { EventType, FeedType } from '../constants/enums'

export type EventData = { event: EventType }

export type FeedData = {
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

export default parseData
