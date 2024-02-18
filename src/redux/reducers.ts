import { combineReducers } from '@reduxjs/toolkit'
import company from './slice/company'
import worker from './slice/worker'

const rootReducers = combineReducers({
  company,
  worker,
})

export default rootReducers
