import WS from 'jest-websocket-mock'
import waitForExpect from 'wait-for-expect'
import { BTC_USD, ETH_USD } from '../constants/products'
import { URL } from '../constants/misc'
import Feed from './feed'
import { EventData, FeedData } from '../utils/parse-data'
import { EventType, FeedType } from '../constants/enums'
import * as parseData from '../utils/parse-data'

describe('Feed', () => {
  let server: WS
  let feed: Feed
  let parseDataSpy: jest.SpyInstance
  let openSpy: jest.SpyInstance
  let closeSpy: jest.SpyInstance
  let subscribeSpy: jest.SpyInstance
  let unsubscribeSpy: jest.SpyInstance

  beforeEach(async () => {
    server = new WS(URL, { jsonProtocol: true })
    feed = new Feed(BTC_USD)
    await server.connected

    parseDataSpy = jest.spyOn(parseData, 'default')
    openSpy = jest.spyOn(Feed.prototype, 'open')
    closeSpy = jest.spyOn(Feed.prototype, 'close')
    subscribeSpy = jest.spyOn(Feed.prototype, 'subscribe')
    unsubscribeSpy = jest.spyOn(Feed.prototype, 'unsubscribe')
  })

  afterEach(() => WS.clean())

  describe('open', () => {
    it('should open a new websocket connection', async () => {
      feed.close()
      await server.closed

      expect(feed.isOpen).toBe(false)

      feed.open()
      await server.connected

      await waitForExpect(() => {
        expect(feed.isOpen).toBe(true)
      })
    })
  })

  describe('close', () => {
    it('should close the websocket connection', async () => {
      expect(feed.isOpen).toBe(true)

      feed.close()
      await server.closed

      expect(feed.isOpen).toBe(false)
    })
  })

  describe('isOpen', () => {
    it('should return `false` if the websocket connection is closed', async () => {
      feed.close()
      await server.closed

      expect(feed.isOpen).toBe(false)
    })

    it('should return `true` if the websocket connection is open', async () => {
      expect(feed.isOpen).toBe(true)
    })
  })

  describe('get product', () => {
    it('should return the current product', () => {
      expect(feed.product).toBe(BTC_USD)
    })
  })

  describe('set product', () => {
    it('should set the current product and open a new connection', () => {
      feed.product = ETH_USD

      expect(unsubscribeSpy).toBeCalledTimes(1)
      expect(openSpy).toBeCalledTimes(1)
      expect(subscribeSpy).not.toBeCalledTimes(1)
      expect(feed.product).toBe(ETH_USD)
    })

    it('should resubscribe if has an existing subscription', () => {
      const subscription = jest.fn()

      feed.subscribe(subscription)
      subscribeSpy.mockClear()

      feed.product = ETH_USD

      expect(unsubscribeSpy).toBeCalledTimes(1)
      expect(openSpy).toBeCalledTimes(1)
      expect(subscribeSpy).toBeCalledTimes(1)
      expect(subscribeSpy).toBeCalledWith(subscription)
      expect(feed.product).toBe(ETH_USD)
    })
  })

  describe('subscribe', () => {
    it('should skip events', async () => {
      const mockData: EventData = { event: EventType.Info }
      const subscription = jest.fn()

      feed.subscribe(subscription)
      await server.connected
      server.send(mockData)

      expect(parseDataSpy).toBeCalledTimes(1)
      expect(parseDataSpy).toBeCalledWith(mockData)
      expect(subscription).not.toBeCalled()
    })

    it('should subscribe to the websocket connection', async () => {
      const mockData: FeedData = {
        event: undefined,
        feed: FeedType.Snapshot,
        asks: [[100, 1]],
        bids: [[200, 2]]
      }
      const mockParsedData = {
        type: FeedType.Snapshot,
        asks: [[100, 1]],
        bids: [[200, 2]]
      }
      const subscription = jest.fn()

      feed.subscribe(subscription)
      await server.connected
      server.send(mockData)

      expect(parseDataSpy).toBeCalledTimes(1)
      expect(parseDataSpy).toBeCalledWith(mockData)
      expect(subscription).toBeCalledTimes(1)
      expect(subscription).toBeCalledWith(null, mockParsedData)
    })

    it('should return an error if it occurs', async () => {
      const mockData: FeedData = {
        event: undefined,
        feed: 'unexpected' as FeedType,
        asks: [[100, 1]],
        bids: [[200, 2]]
      }
      const subscription = jest.fn()

      feed.subscribe(subscription)
      await server.connected
      server.send(mockData)

      expect(parseDataSpy).toBeCalledTimes(1)
      expect(parseDataSpy).toBeCalledWith(mockData)
      expect(subscription).toBeCalledTimes(1)
      expect(subscription).toBeCalledWith(expect.any(Error), null)
    })

    it('should unsubscribe if there is no subscription', async () => {
      const mockData: FeedData = {
        event: undefined,
        feed: 'unexpected' as FeedType,
        asks: [[100, 1]],
        bids: [[200, 2]]
      }
      const subscription = null as unknown

      feed.subscribe(subscription as Subscription)
      await server.connected
      server.send(mockData)

      expect(unsubscribeSpy).toBeCalledTimes(1)
    })
  })

  describe('unsubscribe', () => {
    it('should unsubscribe', async () => {
      const mockMessage = {
        event: EventType.Unsubscribe,
        feed: FeedType.Delta,
        product_ids: [BTC_USD]
      }

      feed.unsubscribe()

      await expect(server).toReceiveMessage(mockMessage)
      expect(closeSpy).toBeCalledTimes(1)
    })

    it('should not close the connection if there is none', async () => {
      feed.close()
      closeSpy.mockClear()

      feed.unsubscribe()

      expect(server).toHaveReceivedMessages([])
      expect(closeSpy).not.toBeCalledTimes(1)
    })
  })

  describe('error', () => {
    it('should send an error message', async () => {
      const mockMessage = {
        event: 'error',
        feed: FeedType.Delta,
        product_ids: [BTC_USD]
      }

      feed.error()

      await expect(server).toReceiveMessage(mockMessage)
    })
  })
})
