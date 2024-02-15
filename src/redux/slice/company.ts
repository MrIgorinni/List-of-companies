import { createSlice } from '@reduxjs/toolkit'

type InitialState = {
  company: any
  count: number
  isLoading: boolean
  error: any
}

const initialState: InitialState = {
  company: [],
  count: 0,
  isLoading: false,
  error: null,
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
})

export default companySlice.reducer
