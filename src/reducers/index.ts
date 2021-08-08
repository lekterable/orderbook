import { ActionType } from '../constants/enums'
import { mergeOrders, sortOrders } from '../utils'

const reducer = (
  state: Orders | null,
  action: { type: ActionType; orders: Orders }
) => {
  switch (action.type) {
    case ActionType.Initialize:
      return { ...action.orders }

    case ActionType.Update: {
      if (!state) return null

      const newAsks = mergeOrders(state.asks, action.orders.asks).sort(
        sortOrders
      )
      const newBids = mergeOrders(state.bids, action.orders.bids).sort(
        sortOrders
      )

      return { asks: newAsks, bids: newBids }
    }
  }
}

export default reducer
