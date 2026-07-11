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

// Income categories
const INCOME_CATEGORIES = [
  "Salary",
  "Pocket Money",
  "Freelance",
  "Part Time",
  "Business",
  "Investment",
  "Rental",
  "Gift",
  "Refund",
  "Savings",
  "Other",
];

// Default empty form state
const emptyForm = {
  description: "",
  amount: "",
  category: "Pocket Money",
  customCategory: "",
  date: todayISO(),
};

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [overview, setOverview] = useState(null);
  const [range, setRange] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Form for adding new income
  const [form, setForm] = useState(emptyForm);

  // Edit modal state
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load data on mount and when range changes
  useEffect(() => {
    fetchAll();
  }, [range]);

  async function fetchAll() {
    setLoading(true);
    try {
      // Fetch all incomes (returns direct array)
      const res1 = await api.get("/api/income/get-all");
      setIncomes(Array.isArray(res1.data) ? res1.data : []);

      // Fetch overview with selected range
      const res2 = await api.get(`/api/income/overview?range=${range}`);
      setOverview(res2.data.data);
    } catch (err) {
      toast.error("Failed to load income data");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add new income
  async function handleAddIncome(e) {
    e.preventDefault();

    const finalCategory =
  form.category === "Other" ? form.customCategory : form.category;

    if (!form.description || !form.amount || !finalCategory || !form.date) {
    toast.error("Please fill in all fields");
    return;
  }

    setFormLoading(true);
    try {
      await api.post("/api/income/add", {
        ...form,
        amount: Number(form.amount),
        category: finalCategory,
      });
      toast.success("Income added! 💰");
      setForm(emptyForm); // reset form
      fetchAll(); // refresh list
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add income";
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  }

  // Open edit modal
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

  // Save edited income
  async function handleEditSave(e) {
    e.preventDefault();
    if (!editForm.description || !editForm.amount) {
      toast.error("Description and amount are required");
      return;
    }

    try {
      await api.put(`/api/income/update/${editItem._id}`, {
        ...editForm,
        amount: Number(editForm.amount),
      });
      toast.success("Income updated!");
      setShowEditModal(false);
      fetchAll();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update income";
      toast.error(msg);
    }
  }

  // Delete income
  async function handleDelete(id) {
    if (!window.confirm("Delete this income entry?")) return;

    try {
      await api.delete(`/api/income/delete/${id}`);
      toast.success("Income deleted");
      fetchAll();
    } catch (err) {
      toast.error("Failed to delete income");
    }
  }

  // Download income Excel
  async function handleDownload() {
    try {
      const res = await api.get("/api/income/downloadexcel", {
        responseType: "blob", // important — tells axios to treat response as binary
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Income_Report.xlsx");
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
            <h1>Income</h1>
            <p>Track and manage all your earnings.</p>
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
              title="Total Income"
              value={formatCurrency(overview.totalIncome)}
              subtitle={`${range} range`}
              color="income"
            />
            <StatCard
              title="Average"
              value={formatCurrency(Math.round(overview.averageIncome))}
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

        {/* Main grid: Add form + Table */}
        <div className="income-grid">
          {/* Add Income Form */}
          <div className="card">
            <h2 className="card-section-title">
              <Plus size={18} /> Add Income
            </h2>
            <form onSubmit={handleAddIncome}>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-input"
                  placeholder="e.g. Monthly Salary"
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
                  {INCOME_CATEGORIES.map((cat) => (
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
                    placeholder="e.g. YouTube, Internship, Family Support"
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
              <button
                type="submit"
                className="btn btn-primary full-width"
                disabled={formLoading}
              >
                {formLoading ? "Adding…" : "Add Income"}
              </button>
            </form>
          </div>

          {/* Income Table */}
          <div className="card table-section">
            <h2 className="card-section-title">All Income</h2>
            {loading ? (
              <Loader />
            ) : (
              <TransactionTable
                items={incomes}
                type="income"
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
        title="Edit Income"
      >
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
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
              name="amount"
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
              {INCOME_CATEGORIES.map((cat) => (
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

export default Income;
