import reducer from '.'
import { ActionType } from '../constants/enums'

describe('reducer', () => {
  const orders: Orders = {
    asks: [
      [100, 1000],
      [200, 2000],
      [300, 3000]
    ],
    bids: [
      [400, 4000],
      [500, 5000],
      [600, 6000]
    ]
  }

  describe('Initialize', () => {
    it('should initialize', () => {
      const mockState = null
      const mockAction = { type: ActionType.Initialize, orders }

      const result = reducer(mockState, mockAction)

      expect(result).toEqual(orders)
    })
  })

  describe('Update', () => {
    it('should return `null` if there is no state to update', () => {
      const mockState = null
      const mockAction = { type: ActionType.Update, orders }

      const result = reducer(mockState, mockAction)

      expect(result).toBeNull()
    })

    it('should update an existing state', () => {
      const mockState = orders
      const mockOrders: Orders = {
        asks: [
          [300, 3000],
          [100, 1],
          [200, 0]
        ],
        bids: [
          [900, 9000],
          [500, 5]
        ]
      }
      const mockNewState = {
        asks: [
          [100, 1],
          [300, 3000]
        ],
        bids: [
          [400, 4000],
          [500, 5],
          [600, 6000],
          [900, 9000]
        ]
      }
      const mockAction = { type: ActionType.Update, orders: mockOrders }

      const result = reducer(mockState, mockAction)

      expect(result).toEqual(mockNewState)
    })
  })
})
