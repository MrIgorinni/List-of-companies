import '../../styles/table-description.css'
import { useEffect, useState } from 'react'
import FooterTable from './Footer'
import TableHeader from './Header'
import Table from './Table'
import type { TableHeaders } from '../../interfaces/data.interface'

type TId = { id: string }

type TableDescriptionProps<TItem, TNewItem, TEditedItem> = {
  title: string
  body: TItem[]
  totalNumberItems: number
  headers: TableHeaders[]
  handleSelectItemId?: (id: string) => void
  deleteSelectedIds: (ids: string[]) => void
  addNewItem: (item: TNewItem) => void
  getItems: (offset: number) => Promise<void>
  saveEditedItem: (editedItem: TEditedItem) => void
}

const TableDescription = <
  TItem extends TId,
  TNewItem extends object,
  TEditedItem extends TId
>({
  title,
  body,
  headers,
  totalNumberItems,
  handleSelectItemId,
  deleteSelectedIds,
  addNewItem,
  getItems,
  saveEditedItem,
}: TableDescriptionProps<TItem, TNewItem, TEditedItem>) => {
  const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([])

  const handleDeleteSelected = () => {
    deleteSelectedIds(selectedItemsIds)
    setSelectedItemsIds([])
  }

  useEffect(() => {
    if (!handleSelectItemId) return
    if (selectedItemsIds.length === 1) {
      handleSelectItemId(selectedItemsIds[0])
      return
    }
    handleSelectItemId('')
  }, [selectedItemsIds, handleSelectItemId])

  return (
    <div>
      <TableHeader
        title={title}
        currentItems={body.length}
        totalNumberItems={totalNumberItems}
        selectedItems={selectedItemsIds.length}
        handleDeleteSelected={handleDeleteSelected}
      />
      <Table
        body={body}
        totalNumberItems={totalNumberItems}
        headers={headers}
        selectedItemsIds={selectedItemsIds}
        setSelectedItemsIds={setSelectedItemsIds}
        getItems={getItems}
        saveEditedItem={saveEditedItem}
      />
      <FooterTable headers={headers} addNewItem={addNewItem} />
    </div>
  )
}

export default TableDescription
