import '../../styles/table-description.css'
import React, { useEffect, useRef, useState } from 'react'
import type { TableHeaders } from '../../interfaces/data.interface'

type InputRefs = {
  [key: string]: React.RefObject<HTMLInputElement>
}

type FooterTableProps<TNewItem> = {
  headers: TableHeaders[]
  addNewItem: (item: TNewItem) => void
}

const FooterTable = <TNewItem extends object>({
  headers,
  addNewItem,
}: FooterTableProps<TNewItem>) => {
  const [isAddDataDisplayed, setIsAddDataDisplayed] = useState(false)
  const [formData, setFormData] = useState<TNewItem>({} as TNewItem)
  const inputsRefs = useRef<InputRefs>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? +value : value,
    }))
  }

  const clearInputs = () => {
    Object.values(inputsRefs.current).forEach((inputRef) => {
      if (inputRef?.current) inputRef.current.value = ''
    })
  }

  const cancel = () => {
    setIsAddDataDisplayed(false)
    clearInputs()
  }

  const save = () => {
    const lengthFormData = Object.keys(formData).length
    if (lengthFormData === 0 || lengthFormData < headers.length) return
    addNewItem(formData)
    setIsAddDataDisplayed(false)
    setFormData({} as TNewItem)
    clearInputs()
  }

  useEffect(() => {
    headers.forEach((header) => {
      inputsRefs.current[header.name] = React.createRef()
    })
  }, [])

  return (
    <div className='add-item'>
      {!isAddDataDisplayed && (
        <div className='add-item-top-buttons'>
          <button onClick={() => setIsAddDataDisplayed(true)}>
            Добавить +
          </button>
        </div>
      )}
      {isAddDataDisplayed && (
        <>
          <div className='add-item-card'>
            {headers.map((header, i) => (
              <div key={i} className='add-item-input-box'>
                <p>{header.label}:</p>
                <input
                  ref={inputsRefs.current[header.name]}
                  type={header.name === 'workersCount' ? 'number' : 'text'}
                  name={header.name}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
          <div className='add-item-bottom-buttons'>
            <button className='add-item-bottom-buttons-cancel' onClick={cancel}>
              Отмена
            </button>
            <button className='add-item-bottom-buttons-save' onClick={save}>
              Добавить
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default FooterTable
