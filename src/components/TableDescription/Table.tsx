import '../../styles/table-description.css'
import { useEffect, useRef, useState } from 'react'
import { LIMIT_SCROLL } from '../../utils/constants/tableData'
import type { TableHeaders } from '../../interfaces/data.interface'

type TId = { id: string }

type EditableItem = {
  id: string
  name: string
}

type TdProps = {
  id: string
  name: string
  value: string | number
  isEdited: boolean
  editedInputRef: React.RefObject<HTMLInputElement>
  openEditedInput: (editableData: EditableItem) => void
  saveEdited: () => void
  resetEdited: () => void
}

type TableProps<TItem, TEditedItem> = {
  body: TItem[]
  totalNumberItems: number
  headers: TableHeaders[]
  selectedItemsIds: string[]
  setSelectedItemsIds: React.Dispatch<React.SetStateAction<string[]>>
  getItems: (offset: number) => Promise<void>
  saveEditedItem: (editedItem: TEditedItem) => void
}

const Td = ({
  id,
  name,
  value,
  isEdited,
  editedInputRef,
  openEditedInput,
  saveEdited,
  resetEdited,
}: TdProps) => {
  const isNumber = typeof value === 'number'
  const isCanEdited = name !== 'workersCount'
  return (
    <td className='item-container'>
      {isEdited ? (
        <div className='item-input-container'>
          <input
            ref={isEdited ? editedInputRef : undefined}
            defaultValue={value}
            type={isNumber ? 'number' : 'text'}
            name={name}
          />
          <div className='item-input-buttons'>
            <button className='item-save-button' onClick={saveEdited}>
              Ok
            </button>
            <button className='item-cancel-button' onClick={resetEdited}>
              Can
            </button>
          </div>
        </div>
      ) : (
        <div className='item-text-container'>
          {isCanEdited && (
            <button
              className='item-edit-button'
              onClick={() => openEditedInput({ id, name })}
            >
              Редактировать
            </button>
          )}
          <p>{value}</p>
        </div>
      )}
    </td>
  )
}

const Table = <TItem extends TId, TEditedItem extends TId>({
  body,
  totalNumberItems,
  headers,
  selectedItemsIds,
  setSelectedItemsIds,
  getItems,
  saveEditedItem,
}: TableProps<TItem, TEditedItem>) => {
  const [offsetScroll, setOffsetScroll] = useState(0)
  const [editableItem, setEditableItem] = useState<EditableItem | null>(null)
  const editedInputRef = useRef<HTMLInputElement>(null)
  const tableСontainerRef = useRef<HTMLDivElement>(null)

  const toggleItem = (id: string) => {
    const newSelectedItemsIds = selectedItemsIds.filter(
      (selectedId) => selectedId !== id
    )
    if (newSelectedItemsIds.length === selectedItemsIds.length) {
      setSelectedItemsIds((prev) => [...prev, id])
      return
    }
    setSelectedItemsIds(newSelectedItemsIds)
  }

  const toggleAll = () => {
    if (selectedItemsIds.length < body.length) {
      const newSelectedItemsIds = body.map((item) => item.id)
      setSelectedItemsIds(newSelectedItemsIds)
      return
    }
    setSelectedItemsIds([])
  }

  const openEditedInput = (editableData: EditableItem) => {
    setEditableItem(editableData)
  }

  const saveEdited = () => {
    if (!editedInputRef?.current || !editableItem) return
    const { value, type } = editedInputRef?.current
    if (!value.trim()) return
    const newValue = type === 'number' ? +value : value.trim()

    const editedItem = {
      id: editableItem.id,
      [editableItem.name]: newValue,
    } as TEditedItem
    saveEditedItem(editedItem)
    setEditableItem(null)
  }

  const resetEdited = () => {
    setEditableItem(null)
  }

  const getNextItems = () => {
    const newOffset = offsetScroll + LIMIT_SCROLL
    setOffsetScroll(newOffset)
    getItems(newOffset)
  }

  const handleScroll = () => {
    if (body.length >= totalNumberItems || !tableСontainerRef?.current) return

    const { clientHeight, scrollTop, scrollHeight } = tableСontainerRef.current
    const remainingScroll = scrollHeight - (clientHeight + scrollTop)

    if (remainingScroll >= 100) return
    getNextItems()
  }

  useEffect(() => {
    getItems(0)
  }, [])

  return (
    <div
      ref={tableСontainerRef}
      className='table-container'
      onScroll={handleScroll}
    >
      <table>
        <thead>
          <tr>
            <th className='table-checkbox'>
              <input
                checked={
                  selectedItemsIds.length === body.length &&
                  totalNumberItems > 0
                }
                type='checkbox'
                onChange={toggleAll}
              />
            </th>
            {headers.map((header) => (
              <th key={header.id}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((item) => {
            const isSelected = !!selectedItemsIds.find(
              (selectedId) => selectedId === item.id
            )
            return (
              <tr key={item.id} className={isSelected ? 'selectRow' : ''}>
                <td className='table-checkbox'>
                  <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => toggleItem(item.id)}
                  />
                </td>
                {Object.entries(item).map((el, i) =>
                  !!headers.find((header) => header.name === el[0]) ? (
                    <Td
                      key={i}
                      id={item.id}
                      value={el[1]}
                      name={el[0]}
                      isEdited={
                        editableItem?.id === item.id &&
                        editableItem.name === el[0]
                      }
                      editedInputRef={editedInputRef}
                      openEditedInput={openEditedInput}
                      saveEdited={saveEdited}
                      resetEdited={resetEdited}
                    />
                  ) : null
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
