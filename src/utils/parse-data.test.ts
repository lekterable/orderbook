import { EventType, FeedType } from '../constants/enums'
import parseData, { EventData, FeedData } from './parse-data'

describe('parseData', () => {
  it('should throw if unexpected event type passed', () => {
    const data: EventData = { event: 'unexpected' as EventType }

    expect(() => parseData(data)).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected event type \`unexpected\` received."`
    )
  })

  it('should return `null` for `Info` event', () => {
    const data: EventData = { event: EventType.Info }

    expect(parseData(data)).toBeNull()
  })

  it('should return `null` for `Subscribed` event', () => {
    const data: EventData = { event: EventType.Subscribed }

    expect(parseData(data)).toBeNull()
  })

  it('should throw if unexpected feed type passed', () => {
    const data: FeedData = {
      event: undefined,
      feed: 'unexpected' as FeedType,
      asks: [[100, 1]],
      bids: [[200, 2]]
    }

    expect(() => parseData(data)).toThrowErrorMatchingInlineSnapshot(`"Unexpected feed type \`unexpected\` received."`)
  })

  it('should return parsed data for `Snapshot` feed', () => {
    const data: FeedData = {
      event: undefined,
      feed: FeedType.Snapshot,
      asks: [[100, 1]],
      bids: [[200, 2]]
    }

    expect(parseData(data)).toEqual({
      type: FeedType.Snapshot,
      asks: [[100, 1]],
      bids: [[200, 2]]
    })
  })

  it('should return parsed data for `Delta` feed', () => {
    const data: FeedData = {
      event: undefined,
      feed: FeedType.Delta,
      asks: [[100, 1]],
      bids: [[200, 2]]
    }

    expect(parseData(data)).toEqual({
      type: FeedType.Delta,
      asks: [[100, 1]],
      bids: [[200, 2]]
    })
  })
})
