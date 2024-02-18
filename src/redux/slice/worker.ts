import {
  SerializedError,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'
import {
  addWorker,
  deleteWorkers,
  editWorker,
  getWorkers,
} from '../../utils/apifun'
import type { RootState } from '../store'
import type {
  EditedWorker,
  NewWorker,
  Worker,
} from '../../interfaces/data.interface'

type InitialState = {
  workers: Worker[]
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

export const getWorkersThunk = createAsyncThunk<
  { workers: Worker[]; count: number },
  { companyId: string; count: number; offset: number },
  { rejectValue: SerializedError }
>(
  'worker/list/get',
  async ({ companyId, count, offset }, { rejectWithValue }) => {
    try {
      const response = await getWorkers({
        companyId,
        count,
        offset,
      })
      return response
    } catch (error) {
      return rejectWithValue(error as SerializedError)
    }
  }
)

export const deleteWorkersThunk = createAsyncThunk<
  { message: string; newCount: number; companyId: string },
  { ids: string[]; companyId: string },
  { rejectValue: SerializedError; state: RootState }
>(
  'worker/list/delete',
  async ({ ids, companyId }, { getState, rejectWithValue }) => {
    try {
      const {
        worker: { count },
      } = getState()

      const response = await deleteWorkers({ ids, companyId })
      const newCount = count - ids.length

      return { ...response, newCount, companyId }
    } catch (error) {
      return rejectWithValue(error as SerializedError)
    }
  }
)

export const addWorkerThunk = createAsyncThunk<
  {
    message: string
    createdWorker: Worker
    newCount: number
    companyId: string
  },
  { newWorker: NewWorker; companyId: string },
  { rejectValue: SerializedError; state: RootState }
>(
  'worker/add',
  async ({ newWorker, companyId }, { getState, rejectWithValue }) => {
    try {
      const {
        worker: { count },
      } = getState()

      const response = await addWorker({ newWorker, companyId })
      const newCount = count + 1

      return { ...response, newCount, companyId }
    } catch (error) {
      return rejectWithValue(error as SerializedError)
    }
  }
)

export const editWorkerThunk = createAsyncThunk<
  { message: string },
  { editedWorker: EditedWorker; companyId: string },
  { rejectValue: SerializedError }
>('worker/edit', async ({ editedWorker, companyId }, { rejectWithValue }) => {
  try {
    const response = await editWorker({ editedWorker, companyId })
    return response
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

const workerSlice = createSlice({
  name: 'worker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWorkersThunk.fulfilled, (state, { payload, meta }) => {
        state.isLoading = false
        state.count = payload.count
        if (meta.arg.offset === 0) {
          state.workers = payload.workers
        } else {
          state.workers = [...state.workers, ...payload.workers]
        }
      })
      .addCase(getWorkersThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getWorkersThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

      .addCase(deleteWorkersThunk.fulfilled, (state, { payload, meta }) => {
        state.isLoading = false
        state.workers = state.workers.filter(
          (worker) => !meta.arg.ids.find((deletedId) => deletedId === worker.id)
        )
        state.count = payload.newCount
      })
      .addCase(deleteWorkersThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteWorkersThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

      .addCase(addWorkerThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.workers = [payload.createdWorker, ...state.workers]
        state.count = payload.newCount
      })
      .addCase(addWorkerThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addWorkerThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

      .addCase(editWorkerThunk.fulfilled, (state, { meta }) => {
        state.isLoading = false
        const editedWorker = meta.arg.editedWorker
        state.workers = state.workers.map((worker) => {
          if (editedWorker.id === worker.id) {
            return { ...worker, ...editedWorker }
          } else {
            return worker
          }
        })
      })
      .addCase(editWorkerThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editWorkerThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })
  },
})

export default workerSlice.reducer
