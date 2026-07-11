import { Trash2, Pencil } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import EmptyState from './EmptyState'
import './TransactionTable.css'

// Reusable table/list for income or expense transactions
// Props: items, type ('income'|'expense'), onEdit, onDelete
// Pass onEdit/onDelete as undefined to hide those buttons
function TransactionTable({ items = [], type, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={type === 'income' ? '💰' : '🧾'}
        title="No transactions yet"
        subtitle={`Add your first ${type || 'transaction'} to see it here.`}
      />
    )
  }

  return (
    <div className="tx-table-wrap">
      <table className="tx-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td className="tx-description">{item.description}</td>
              <td>
                <span className="tx-category">{item.category}</span>
              </td>
              <td className="tx-date">
                {/* Fallback: use item.date if createdAt is missing */}
                {formatDate(item.date || item.createdAt)}
              </td>
              <td className={`tx-amount ${type === 'income' ? 'income-color' : 'expense-color'}`}>
                {type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
              </td>
              {(onEdit || onDelete) && (
                <td className="tx-actions">
                  {onEdit && (
                    <button
                      className="tx-action-btn edit-btn"
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="tx-action-btn delete-btn"
                      onClick={() => onDelete(item._id)}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
