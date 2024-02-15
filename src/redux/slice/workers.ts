import { createSlice } from '@reduxjs/toolkit'

type InitialState = {
  workers: any
  count: number
  isLoading: boolean
  error: any
}

const initialState: InitialState = {
  workers: [],
  count: 0,
  isLoading: false,
  error: null,
}

const workersSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {},
})

export default workersSlice.reducer
