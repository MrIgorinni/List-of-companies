import '../../styles/table-description.css'

type TableHeaderProps = {
  title: string
  currentItems: number
  totalNumberItems: number
  selectedItems: number
  handleDeleteSelected: () => void
  handleDeleteAll: () => void
}

const TableHeader = ({
  title,
  currentItems,
  totalNumberItems,
  selectedItems,
  handleDeleteSelected,
  handleDeleteAll,
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

      <div className='header-delete-container'>
        {selectedItems > 0 && (
          <button
            className='header-delete-selected-btn'
            onClick={handleDeleteSelected}
          >
            Удалить выделенное
          </button>
        )}
        <button className='header-delete-all-btn' onClick={handleDeleteAll}>
          Удалить всё
        </button>
      </div>
    </div>
  </div>
)

export default TableHeader
