import '../../styles/table-description.css'

type TableHeaderProps = {
  title: string
  currentItems: number
  totalNumberItems: number
  selectedItems: number
  handleDeleteSelected: () => void
}

const TableHeader = ({
  title,
  currentItems,
  totalNumberItems,
  selectedItems,
  handleDeleteSelected,
}: TableHeaderProps) => (
  <div className='table-header'>
    <p className='header-title'>{title}</p>
    <div className='header-info'>
      <div className='header-count-text'>
        <p>
          Отображается: <span className='header-count'>{currentItems}</span>
        </p>
        <p>
          Всего: <span className='header-count'>{totalNumberItems}</span>
        </p>
        <p>
          Выделено:
          <span className='header-count-selected'>{selectedItems}</span>
        </p>
      </div>
      {selectedItems > 0 && (
        <div className='header-delete-container'>
          <button onClick={handleDeleteSelected}>Удалить выделенное</button>
        </div>
      )}
    </div>
  </div>
)

export default TableHeader
