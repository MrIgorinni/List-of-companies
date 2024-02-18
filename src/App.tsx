import './styles/app.css'
import { useEffect, useState } from 'react'
import CompaniesTable from './components/CompaniesTable'
import WorkersTable from './components/WorkersTable'
import { getCompaniesThunk } from './redux/slice/company'
import { useAppDispatch } from './hooks/redux'
import { getDataMock } from './utils/getDataMock'
import { LIMIT_SCROLL } from './utils/constants/tableData'
import {
  LOCAL_STORAGE_COMPANIES,
  LOCAL_STORAGE_WORKERS,
} from './utils/constants/localeStorage'

const App = () => {
  const dispatch = useAppDispatch()
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [isGenerateLoading, setIsGenerateLoading] = useState(false)

  const handleSelectCompanyId = (id: string) => {
    if (id === selectedCompanyId) return
    setSelectedCompanyId(id)
  }

  const downloadData = async () => {
    setIsGenerateLoading(true)
    setSelectedCompanyId('')
    await getDataMock()
    await dispatch(getCompaniesThunk({ count: LIMIT_SCROLL, offset: 0 }))
    setIsGenerateLoading(false)
  }

  const scanLocalStorage = async () => {
    const localStorageCompanies = localStorage.getItem(LOCAL_STORAGE_COMPANIES)
    const localStorageWorkers = localStorage.getItem(LOCAL_STORAGE_WORKERS)
    if (!localStorageCompanies || !localStorageWorkers) {
      downloadData()
    }
  }

  useEffect(() => {
    scanLocalStorage()
  }, [])

  return (
    <div className='app'>
      <div className='app-header'>
        <h1>Список компаний</h1>
        <div className='app-header-generate-button'>
          <button onClick={downloadData}>Сгенерировать новые данные</button>
        </div>
      </div>

      {!isGenerateLoading && (
        <div className='app-tables'>
          <CompaniesTable handleSelectCompanyId={handleSelectCompanyId} />
          {selectedCompanyId && (
            <WorkersTable selectedCompanyId={selectedCompanyId} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
