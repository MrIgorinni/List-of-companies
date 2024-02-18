import TableDescription from './TableDescription'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import {
  addWorkerThunk,
  deleteWorkersThunk,
  editWorkerThunk,
  getWorkersThunk,
} from '../redux/slice/worker'
import { changeCompanyCount } from '../redux/slice/company'
import {
  LIMIT_SCROLL,
  WORKERS_TABLE_HEADER,
} from '../utils/constants/tableData'
import type { EditedWorker, NewWorker } from '../interfaces/data.interface'

type WorkersTableProps = {
  selectedCompanyId: string
}

const WorkersTable = ({ selectedCompanyId }: WorkersTableProps) => {
  const dispatch = useAppDispatch()
  const { workers, count: workersCount } = useAppSelector(
    (state) => state.worker
  )

  const getWorkers = async (offset: number) => {
    dispatch(
      getWorkersThunk({
        companyId: selectedCompanyId,
        count: LIMIT_SCROLL,
        offset,
      })
    )
  }

  const deleteSelectedIds = (ids: string[]) => {
    dispatch(deleteWorkersThunk({ ids, companyId: selectedCompanyId }))
      .then(({ meta, payload }) => {
        if (
          meta.requestStatus === 'fulfilled' &&
          payload &&
          'companyId' in payload
        ) {
          const { companyId, newCount } = payload
          dispatch(changeCompanyCount({ companyId, newCount }))
          return { newCount }
        }
      })
      .then((res) => {
        if (res && res.newCount < workersCount) {
          getWorkers(0)
        }
      })
  }

  const addNewWorker = (newWorker: NewWorker) => {
    dispatch(addWorkerThunk({ newWorker, companyId: selectedCompanyId })).then(
      ({ meta, payload }) => {
        if (
          meta.requestStatus === 'fulfilled' &&
          payload &&
          'companyId' in payload
        ) {
          const { companyId, newCount } = payload
          dispatch(changeCompanyCount({ companyId, newCount }))
          return { newCount }
        }
      }
    )
  }

  const saveEditedWorker = (editedWorker: EditedWorker) => {
    dispatch(editWorkerThunk({ editedWorker, companyId: selectedCompanyId }))
  }

  return (
    <TableDescription
      title='Сотрудники'
      body={workers}
      totalNumberItems={workersCount}
      headers={WORKERS_TABLE_HEADER}
      deleteSelectedIds={deleteSelectedIds}
      addNewItem={addNewWorker}
      getItems={getWorkers}
      saveEditedItem={saveEditedWorker}
    />
  )
}

export default WorkersTable
