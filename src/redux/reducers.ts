import { combineReducers } from '@reduxjs/toolkit'
import company from './slice/company'
import workers from './slice/workers'

const rootReducers = combineReducers({
  company,
  workers,
})

export default rootReducers
