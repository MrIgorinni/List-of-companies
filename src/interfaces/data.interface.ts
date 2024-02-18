export type Company = {
  id: string
  name: string
  workersCount: number
  address: string
}

export type Worker = {
  id: string
  companyId: string
  name: string
  surname: string
  post: string
}

export type NewCompany = Omit<Company, 'id'>
export type NewWorker = Omit<Worker, 'id' | 'companyId'>

export type EditedCompany = Partial<Company> & { id: string }
export type EditedWorker = Partial<Worker> & { id: string }

export type TableHeaders = {
  id: string
  label: string
  name: string
}
