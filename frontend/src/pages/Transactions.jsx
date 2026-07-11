import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import "./Transactions.css";

function Transactions() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | 'income' | 'expense'
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      // Fetch both income and expense in parallel
      const [incRes, expRes] = await Promise.all([
        api.get("/api/income/get-all"),
        api.get("/api/expense/get-all"),
      ]);

      const incomes = (Array.isArray(incRes.data) ? incRes.data : []).map(
        (i) => ({
          ...i,
          type: "income",
        }),
      );
      const expenses = (Array.isArray(expRes.data) ? expRes.data : []).map(
        (e) => ({
          ...e,
          type: "expense",
        }),
      );

      // Combine income and expenses
      const combined = [...incomes, ...expenses];

      // Sort by transaction date, newest first
      combined.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      setAllTransactions(combined);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  // Apply filter
  const filtered = allTransactions.filter(function (tx) {
    const searchText = search.toLowerCase();

    const description = tx.description.toLowerCase();
    const category = tx.category.toLowerCase();

    const matchSearch =
      description.includes(searchText) || category.includes(searchText);

    const matchType = filter === "all" || tx.type === filter;

    const transactionDate = (tx.date || tx.createdAt).split("T")[0];

    const matchFromDate = fromDate === "" || transactionDate >= fromDate;

    const matchToDate = toDate === "" || transactionDate <= toDate;

    return matchSearch && matchType && matchFromDate && matchToDate;
  });

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <h1>Transactions</h1>
          <p>All your income and expenses in one place, sorted newest first.</p>
        </div>

        {/* Summary bar */}
        {/* Summary bar */}
        {!loading && (
          <div className="tx-summary">
            <div className="tx-summary-item">
              <span className="summary-label">Total Income</span>

              <span className="summary-val income-color">
                +{" "}
                {formatCurrency(
                  filtered
                    .filter(function (transaction) {
                      return transaction.type === "income";
                    })
                    .reduce(function (total, transaction) {
                      return total + Number(transaction.amount);
                    }, 0),
                )}
              </span>
            </div>

            <div className="tx-summary-item">
              <span className="summary-label">Total Expenses</span>

              <span className="summary-val expense-color">
                -{" "}
                {formatCurrency(
                  filtered
                    .filter(function (transaction) {
                      return transaction.type === "expense";
                    })
                    .reduce(function (total, transaction) {
                      return total + Number(transaction.amount);
                    }, 0),
                )}
              </span>
            </div>

            <div className="tx-summary-item">
              <span className="summary-label">Transactions</span>

              <span className="summary-val">{filtered.length}</span>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="transaction-search">
          <input
            type="text"
            placeholder="🔎 Search by description or category..."
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="date-filter">
          <div>
            <label>From Date🗓️</label>
            <input
              type="date"
              value={fromDate}
              onChange={function (e) {
                setFromDate(e.target.value);
              }}
            />
          </div>

          <div>
            <label>To Date🗓️</label>
            <input
              type="date"
              value={toDate}
              onChange={function (e) {
                setToDate(e.target.value);
              }}
            />
          </div>

          <button
            type="button"
            onClick={function () {
              setFromDate("");
              setToDate("");
            }}
          >
            Clear Dates
          </button>
        </div>
        <div className="range-tabs filter-tabs">
          {[
            { key: "all", label: `All (${allTransactions.length})` },
            {
              key: "income",
              label: `Income (${allTransactions.filter((t) => t.type === "income").length})`,
            },
            {
              key: "expense",
              label: `Expenses (${allTransactions.filter((t) => t.type === "expense").length})`,
            },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`range-tab ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Transactions list */}
        <div className="card" style={{ marginTop: "20px" }}>
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No transactions found"
              subtitle="Try a different filter or add some transactions."
            />
          ) : (
            <div className="tx-full-list">
              {filtered.map((tx) => (
                <div className="tx-full-row" key={tx._id}>
                  {/* Type indicator */}
                  <div className={`tx-type-badge ${tx.type}`}>
                    {tx.type === "income" ? "↑" : "↓"}
                  </div>

                  {/* Details */}
                  <div className="tx-details">
                    <p className="tx-full-desc">{tx.description}</p>
                    <p className="tx-full-meta">
                      <span className="tx-cat">{tx.category}</span>
                      <span className="tx-meta-sep">·</span>
                      <span>{formatDate(tx.date || tx.createdAt)}</span>
                      <span className="tx-meta-sep">·</span>
                      <span className={`tx-type-label ${tx.type}`}>
                        {tx.type === "income" ? "Income" : "Expense"}
                      </span>
                    </p>
                  </div>

                  {/* Amount */}
                  <span className={`tx-full-amount ${tx.type}`}>
                    {tx.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Transactions;
