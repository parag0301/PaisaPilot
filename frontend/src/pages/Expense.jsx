import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import { todayISO } from "../utils/formatDate";
import "./IncomExpense.css";

// Expense categories
const EXPENSE_CATEGORIES = [
  "Food",
  "Rent",
  "Groceries",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Bills",
  "Petrol",
  "College",
  "Gym",
  "Recharge",
  "Personal Care",
  "Emergency",
  "Subscriptions",
  "Other",
];

const emptyForm = {
  description: "",
  amount: "",
  category: "Food",
  customCategory: "",
  date: todayISO(),
  isRecurring: false,
};

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState(null);
  const [range, setRange] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [range]);

  async function fetchAll() {
    setLoading(true);
    try {
      // Get all expenses — returns direct array
      const res1 = await api.get("/api/expense/get-all");
      setExpenses(Array.isArray(res1.data) ? res1.data : []);

      // Get overview with selected range
      const res2 = await api.get(`/api/expense/overview?range=${range}`);
      setOverview(res2.data.data);
    } catch (err) {
      toast.error("Failed to load expense data");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleAddExpense(e) {
    e.preventDefault();

    const finalCategory =
  form.category === "Other" ? form.customCategory : form.category;

   if (!form.description || !form.amount || !finalCategory || !form.date) {
    toast.error("Please fill in all fields");
    return;
  }

    setFormLoading(true);

    try {
      await api.post("/api/expense/add", {
        description: form.description,
        amount: Number(form.amount),
        category: finalCategory,
        date: form.date,
      });

      if (form.isRecurring) {
        await api.post("/api/recurring/add", {
          description: form.description,
          amount: Number(form.amount),
          category: form.category,
          date: form.date,
        });
      }

      toast.success(
        form.isRecurring
          ? "Expense added and recurring set! 🔁"
          : "Expense added! 🧾",
      );

      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add expense";
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  }

  function handleEdit(item) {
    setEditItem(item);
    setEditForm({
      description: item.description,
      amount: item.amount,
      category: item.category,
      date: item.date ? item.date.split("T")[0] : todayISO(),
    });
    setShowEditModal(true);
  }

  async function handleEditSave(e) {
    e.preventDefault();
    if (!editForm.description || !editForm.amount) {
      toast.error("Description and amount are required");
      return;
    }

    try {
      await api.put(`/api/expense/update/${editItem._id}`, {
        ...editForm,
        amount: Number(editForm.amount),
      });
      toast.success("Expense updated!");
      setShowEditModal(false);
      fetchAll();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update expense";
      toast.error(msg);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this expense entry?")) return;

    try {
      await api.delete(`/api/expense/delete/${id}`);
      toast.success("Expense deleted");
      fetchAll();
    } catch (err) {
      toast.error("Failed to delete expense");
    }
  }

  async function handleDownload() {
    try {
      const res = await api.get("/api/expense/downloadexcel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Expense_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Excel downloaded!");
    } catch (err) {
      toast.error("Excel download failed. Please try again.");
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header-row">
          <div className="page-header">
            <h1>Expenses</h1>
            <p>Track and manage all your spending.</p>
          </div>
          <button
            className="btn btn-outline download-btn"
            onClick={handleDownload}
          >
            <Download size={16} />
            Download Excel
          </button>
        </div>

        {/* Overview stats */}
        {overview && (
          <div className="overview-stats">
            <StatCard
              title="Total Expenses"
              value={formatCurrency(overview.totalExpense)}
              subtitle={`${range} range`}
              color="expense"
            />
            <StatCard
              title="Average"
              value={formatCurrency(Math.round(overview.averageExpense))}
              subtitle="Per transaction"
              color="primary"
            />
            <StatCard
              title="Transactions"
              value={overview.numberOfTransactions}
              subtitle="In this period"
              color="savings"
            />
          </div>
        )}

        {/* Range filter */}
        <div className="range-row">
          <span className="range-label">Filter by:</span>
          <div className="range-tabs">
            {["daily", "weekly", "monthly", "yearly"].map((r) => (
              <button
                key={r}
                className={`range-tab ${range === r ? "active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Form + Table grid */}
        <div className="expense-grid">
          {/* Add Expense Form */}
          <div className="card">
            <h2 className="card-section-title">
              <Plus size={18} /> Add Expense
            </h2>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-input"
                  placeholder="e.g. Lunch at cafe"
                  value={form.description}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input"
                  placeholder="0"
                  min="1"
                  value={form.amount}
                  onChange={handleFormChange}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  className="form-input"
                  value={form.category}
                  onChange={handleFormChange}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {form.category === "Other" && (
                <div className="form-group">
                  <label>Custom Category</label>
                  <input
                    type="text"
                    name="customCategory"
                    className="form-input"
                    placeholder="e.g. Bike Service, College Trip"
                    value={form.customCategory}
                    onChange={handleFormChange}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={form.date}
                  onChange={handleFormChange}
                />
              </div>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={form.isRecurring}
                  onChange={handleFormChange}
                />
                <span>Make this a monthly recurring expense</span>
              </label>
              <button
                type="submit"
                className="btn btn-primary full-width"
                disabled={formLoading}
              >
                {formLoading ? "Adding…" : "Add Expense"}
              </button>
            </form>
          </div>

          {/* Expense Table */}
          <div className="card table-section">
            <h2 className="card-section-title">All Expenses</h2>
            {loading ? (
              <Loader />
            ) : (
              <TransactionTable
                items={expenses}
                type="expense"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Expense"
      >
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className="form-input"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              min="1"
              value={editForm.amount}
              onChange={(e) =>
                setEditForm({ ...editForm, amount: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-input"
              value={editForm.category}
              onChange={(e) =>
                setEditForm({ ...editForm, category: e.target.value })
              }
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={editForm.date}
              onChange={(e) =>
                setEditForm({ ...editForm, date: e.target.value })
              }
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Expense;
