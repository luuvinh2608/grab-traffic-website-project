import { combineReducers } from '@reduxjs/toolkit'
import { pageReducer } from './slicePages'

export const rootReducer = combineReducers({
  page: pageReducer
})
