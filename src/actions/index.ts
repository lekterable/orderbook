import { ActionType } from '../constants/enums'

export const initialize = (orders: Orders) => ({
  type: ActionType.Initialize,
  orders
})

export const update = (orders: Orders) => ({
  type: ActionType.Update,
  orders
})
