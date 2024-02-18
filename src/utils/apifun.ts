import {
  LOCAL_STORAGE_COMPANIES,
  LOCAL_STORAGE_WORKERS,
} from './constants/localeStorage'
import type {
  Company,
  EditedCompany,
  EditedWorker,
  NewCompany,
  NewWorker,
  Worker,
} from '../interfaces/data.interface'

const getFromLocalStorage = (key: string) => {
  const localStorageData = localStorage.getItem(key)
  const localeStorageParse = localStorageData
    ? JSON.parse(localStorageData)
    : []
  return localeStorageParse
}

const saveInLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getCompanies = async ({
  count,
  offset,
}: {
  count: number
  offset: number
}) => {
  const localeStorageParse: Company[] = getFromLocalStorage(
    LOCAL_STORAGE_COMPANIES
  )
  const companies = localeStorageParse.slice(offset, offset + count)

  const response = {
    companies,
    count: localeStorageParse.length,
  }
  return response
}

export const deleteCompanies = async ({ ids }: { ids: string[] }) => {
  const localeStorageCompanies: Company[] = getFromLocalStorage(
    LOCAL_STORAGE_COMPANIES
  )
  const localeStorageWorkers: { [key in string]: Worker[] } =
    getFromLocalStorage(LOCAL_STORAGE_WORKERS)

  const filteredCompanies = localeStorageCompanies.filter(
    (company) => !ids.find((deletedId) => deletedId === company.id)
  )

  ids.forEach((deletedId) => {
    delete localeStorageWorkers[deletedId]
  })

  saveInLocalStorage(LOCAL_STORAGE_COMPANIES, filteredCompanies)
  saveInLocalStorage(LOCAL_STORAGE_WORKERS, localeStorageWorkers)

  const response = { message: 'succses' }
  return response
}

export const deleteAllCompanies = async () => {
  saveInLocalStorage(LOCAL_STORAGE_COMPANIES, [])
  const response = { message: 'succses' }
  return response
}

export const addCompany = async ({
  newCompany,
}: {
  newCompany: NewCompany
}) => {
  const localeStorageParse: Company[] = getFromLocalStorage(
    LOCAL_STORAGE_COMPANIES
  )
  const createdCompany = {
    id: `${newCompany.name}-${Math.random()}`,
    ...newCompany,
  }
  localeStorageParse.push(createdCompany)

  saveInLocalStorage(LOCAL_STORAGE_COMPANIES, localeStorageParse)

  const response = { message: 'succses', createdCompany }
  return response
}

export const editCompany = async ({
  editedCompany,
}: {
  editedCompany: EditedCompany
}) => {
  const localeStorageParse: Company[] = getFromLocalStorage(
    LOCAL_STORAGE_COMPANIES
  )
  const changesCompanies = localeStorageParse.map((company) =>
    company.id === editedCompany.id
      ? {
          ...company,
          ...editedCompany,
        }
      : company
  )

  saveInLocalStorage(LOCAL_STORAGE_COMPANIES, changesCompanies)

  const response = { message: 'succses' }
  return response
}

export const getWorkers = async ({
  companyId,
  count,
  offset,
}: {
  companyId: string
  count: number
  offset: number
}) => {
  const localeStorageParse: { [key in string]: Worker[] } = getFromLocalStorage(
    LOCAL_STORAGE_WORKERS
  )
  const workersCurrentCompany =
    companyId in localeStorageParse ? localeStorageParse[companyId] : []

  const workers = workersCurrentCompany.slice(offset, offset + count)

  const response = {
    workers,
    count: workersCurrentCompany.length,
  }
  return response
}

export const deleteWorkers = async ({
  ids,
  companyId,
}: {
  ids: string[]
  companyId: string
}) => {
  const localeStorageParse: { [key in string]: Worker[] } = getFromLocalStorage(
    LOCAL_STORAGE_WORKERS
  )
  if (companyId in localeStorageParse) {
    const filteredCompanies = localeStorageParse[companyId].filter(
      (worker) => !ids.find((deletedId) => deletedId === worker.id)
    )
    localeStorageParse[companyId] = filteredCompanies

    saveInLocalStorage(LOCAL_STORAGE_WORKERS, localeStorageParse)
  }

  const localeStorageCompanies: Company[] = getFromLocalStorage(
    LOCAL_STORAGE_COMPANIES
  )
  const newCompanies = localeStorageCompanies.map((company) =>
    company.id === companyId
      ? { ...company, workersCount: company.workersCount - ids.length }
      : company
  )
  saveInLocalStorage(LOCAL_STORAGE_COMPANIES, newCompanies)

  const response = { message: 'succses' }
  return response
}

export const deleteAllWorkers = async ({
  companyId,
}: {
  companyId: string
}) => {
  const localeStorageWorkers: { [key in string]: Worker[] } =
    getFromLocalStorage(LOCAL_STORAGE_WORKERS)

  if (companyId in localeStorageWorkers) {
    localeStorageWorkers[companyId] = []
    saveInLocalStorage(LOCAL_STORAGE_WORKERS, localeStorageWorkers)
  }

  const localeStorageCompanies: Company[] = getFromLocalStorage(
    LOCAL_STORAGE_COMPANIES
  )
  const newCompanies = localeStorageCompanies.map((company) =>
    company.id === companyId ? { ...company, workersCount: 0 } : company
  )
  saveInLocalStorage(LOCAL_STORAGE_COMPANIES, newCompanies)

  const response = { message: 'succses' }
  return response
}

export const addWorker = async ({
  newWorker,
  companyId,
}: {
  newWorker: NewWorker
  companyId: string
}) => {
  const localeStorageParse: { [key in string]: Worker[] } = getFromLocalStorage(
    LOCAL_STORAGE_WORKERS
  )
  const createdWorker = {
    id: `${Math.random()}-workerId`,
    companyId,
    ...newWorker,
  }

  if (companyId in localeStorageParse) {
    localeStorageParse[companyId].push(createdWorker)
  } else {
    localeStorageParse[companyId] = [createdWorker]
  }
  saveInLocalStorage(LOCAL_STORAGE_WORKERS, localeStorageParse)

  const localeStorageCompanies: Company[] = getFromLocalStorage(
    LOCAL_STORAGE_COMPANIES
  )
  const newCompanies = localeStorageCompanies.map((company) =>
    company.id === companyId
      ? { ...company, workersCount: company.workersCount + 1 }
      : company
  )
  saveInLocalStorage(LOCAL_STORAGE_COMPANIES, newCompanies)

  const response = { message: 'succses', createdWorker }
  return response
}

export const editWorker = async ({
  editedWorker,
  companyId,
}: {
  editedWorker: EditedWorker
  companyId: string
}) => {
  const localeStorageParse: { [key in string]: Worker[] } = getFromLocalStorage(
    LOCAL_STORAGE_WORKERS
  )

  if (companyId in localeStorageParse) {
    const changesCompanies = localeStorageParse[companyId].map((worker) =>
      worker.id === editedWorker.id
        ? {
            ...worker,
            ...editedWorker,
          }
        : worker
    )
    localeStorageParse[companyId] = changesCompanies

    saveInLocalStorage(LOCAL_STORAGE_WORKERS, localeStorageParse)
  }

  const response = { message: 'succses' }
  return response
}
