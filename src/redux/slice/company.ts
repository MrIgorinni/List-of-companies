import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'
import {
  addCompany,
  deleteAllCompanies,
  deleteCompanies,
  editCompany,
  getCompanies,
} from '../../utils/apifun'
import type {
  Company,
  EditedCompany,
  NewCompany,
} from '../../interfaces/data.interface'

type InitialState = {
  companies: Company[]
  count: number
  isLoading: boolean
  error: any
}

const initialState: InitialState = {
  companies: [],
  count: 0,
  isLoading: false,
  error: null,
}

export const getCompaniesThunk = createAsyncThunk<
  { companies: Company[]; count: number },
  { count: number; offset: number },
  { rejectValue: SerializedError }
>('company/list/get', async ({ count, offset }, { rejectWithValue }) => {
  try {
    const response = await getCompanies({
      count,
      offset,
    })
    return response
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const deleteCompaniesThunk = createAsyncThunk<
  { message: string },
  { ids: string[] },
  { rejectValue: SerializedError }
>('company/list/delete', async ({ ids }, { rejectWithValue }) => {
  try {
    const response = await deleteCompanies({ ids })
    return response
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const deleteAllCompaniesThunk = createAsyncThunk<
  { message: string },
  undefined,
  { rejectValue: SerializedError }
>('company/all/delete', async (_, { rejectWithValue }) => {
  try {
    const response = await deleteAllCompanies()
    return response
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const addCompanyThunk = createAsyncThunk<
  { message: string; createdCompany: Company },
  { newCompany: NewCompany },
  { rejectValue: SerializedError }
>('company/add', async ({ newCompany }, { rejectWithValue }) => {
  try {
    const response = await addCompany({ newCompany })
    return response
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

export const editCompanyThunk = createAsyncThunk<
  { message: string },
  { editedCompany: EditedCompany },
  { rejectValue: SerializedError }
>('company/edit', async ({ editedCompany }, { rejectWithValue }) => {
  try {
    const response = await editCompany({ editedCompany })
    return response
  } catch (error) {
    return rejectWithValue(error as SerializedError)
  }
})

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    changeCompanyCount: (
      state,
      action: PayloadAction<{ newCount: number; companyId: string }>
    ) => {
      const { newCount, companyId } = action.payload
      state.companies = state.companies.map((company) =>
        company.id === companyId
          ? { ...company, workersCount: newCount }
          : company
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompaniesThunk.fulfilled, (state, { payload, meta }) => {
        state.isLoading = false
        state.count = payload.count
        if (meta.arg.offset === 0) {
          state.companies = payload.companies
        } else {
          state.companies = [...state.companies, ...payload.companies]
        }
      })
      .addCase(getCompaniesThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCompaniesThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

      .addCase(deleteCompaniesThunk.fulfilled, (state, { meta }) => {
        state.isLoading = false
        state.companies = state.companies.filter(
          (company) =>
            !meta.arg.ids.find((deletedId) => deletedId === company.id)
        )
        state.count = state.count - meta.arg.ids.length
      })
      .addCase(deleteCompaniesThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteCompaniesThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

      .addCase(deleteAllCompaniesThunk.fulfilled, (state) => {
        state.isLoading = false
        state.companies = []
        state.count = 0
      })
      .addCase(deleteAllCompaniesThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteAllCompaniesThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

      .addCase(addCompanyThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.companies = [payload.createdCompany, ...state.companies]
        state.count = state.count + 1
      })
      .addCase(addCompanyThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addCompanyThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

      .addCase(editCompanyThunk.fulfilled, (state, { meta }) => {
        state.isLoading = false
        const editedCompany = meta.arg.editedCompany
        state.companies = state.companies.map((company) => {
          if (editedCompany.id === company.id) {
            return { ...company, ...editedCompany }
          } else {
            return company
          }
        })
      })
      .addCase(editCompanyThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editCompanyThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })
  },
})

export const { changeCompanyCount } = companySlice.actions
export default companySlice.reducer
