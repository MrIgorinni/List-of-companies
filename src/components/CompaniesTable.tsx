import TableDescription from './TableDescription'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import {
  addCompanyThunk,
  deleteAllCompaniesThunk,
  deleteCompaniesThunk,
  editCompanyThunk,
  getCompaniesThunk,
} from '../redux/slice/company'
import {
  COMPANY_TABLE_HEADER,
  LIMIT_SCROLL,
} from '../utils/constants/tableData'
import type { EditedCompany, NewCompany } from '../interfaces/data.interface'

type CompaniesTableProps = {
  handleSelectCompanyId: (id: string) => void
}

const CompaniesTable = ({ handleSelectCompanyId }: CompaniesTableProps) => {
  const dispatch = useAppDispatch()
  const { companies, count: companiesCount } = useAppSelector(
    (state) => state.company
  )

  const getCompanies = async (offset: number) => {
    dispatch(getCompaniesThunk({ count: LIMIT_SCROLL, offset }))
  }

  const deleteSelectedIds = (ids: string[]) => {
    dispatch(deleteCompaniesThunk({ ids })).then(() => {
      if (companies.length < companiesCount) {
        getCompanies(0)
      }
    })
  }

  const deleteAllCompanies = () => {
    dispatch(deleteAllCompaniesThunk())
  }

  const addNewCompany = (newCompany: NewCompany) => {
    dispatch(addCompanyThunk({ newCompany }))
  }

  const saveEditedCompany = (editedCompany: EditedCompany) => {
    dispatch(editCompanyThunk({ editedCompany }))
  }

  return (
    <TableDescription
      title='Компании'
      body={companies}
      totalNumberItems={companiesCount}
      headers={COMPANY_TABLE_HEADER}
      handleSelectItemId={handleSelectCompanyId}
      deleteSelectedIds={deleteSelectedIds}
      deleteAllItems={deleteAllCompanies}
      addNewItem={addNewCompany}
      getItems={getCompanies}
      saveEditedItem={saveEditedCompany}
    />
  )
}

export default CompaniesTable
