import { useEffect, useState } from "react";
import { CheckCircle, SkipForward, XCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import "./Recurring.css";

function Recurring() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    fetchRecurringExpenses();
  }, []);

  async function fetchRecurringExpenses() {
    setLoading(true);

    try {
      const res = await api.get("/api/recurring/get-all");
      setItems(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load recurring expenses");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, action) {
    const confirmMessage = {
      accept: "Accept this recurring expense and add it to expenses?",
      skip: "Skip this recurring expense for this month?",
      cancel: "Cancel this recurring expense permanently?",
    };

    if (!window.confirm(confirmMessage[action])) return;

    setActionLoading(`${action}-${id}`);

    try {
      await api.put(`/api/recurring/${action}/${id}`);

      if (action === "accept") toast.success("Added to expenses!");
      if (action === "skip") toast.success("Skipped for this month");
      if (action === "cancel") toast.success("Recurring expense cancelled");

      fetchRecurringExpenses();
    } catch (err) {
      const msg = err.response?.data?.message || "Action failed";
      toast.error(msg);
    } finally {
      setActionLoading("");
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header recurring-header">
          <div>
            <h1>Recurring Expenses</h1>
            <p>Accept, skip, or cancel your upcoming monthly expenses.</p>
          </div>

          <button className="btn btn-outline" onClick={fetchRecurringExpenses}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="card recurring-info-card">
          <h2>How this works</h2>
          <p>
            When you mark an expense as recurring, it appears here every month.
            Accept adds it to your normal expense list, skip moves it to next
            month, and cancel stops it permanently.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState
            title="No recurring expenses yet"
            message="Add an expense and tick the recurring checkbox to see it here."
          />
        ) : (
          <div className="recurring-grid">
            {items.map((item) => (
              <div className="card recurring-card" key={item._id}>
                <div className="recurring-card-top">
                  <div>
                    <h2>{item.description}</h2>
                    <span className="badge badge-expense">{item.category}</span>
                  </div>

                  <p className="recurring-amount">
                    {formatCurrency(item.amount)}
                  </p>
                </div>

                <div className="recurring-details">
                  <div>
                    <span>Frequency</span>
                    <strong>Monthly</strong>
                  </div>

                  <div>
                    <span>Next Due Date</span>
                    <strong>{formatDate(item.nextDueDate)}</strong>
                  </div>
                </div>

                <div className="recurring-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleAction(item._id, "accept")}
                    disabled={actionLoading === `accept-${item._id}`}
                  >
                    <CheckCircle size={16} />
                    Accept
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => handleAction(item._id, "skip")}
                    disabled={actionLoading === `skip-${item._id}`}
                  >
                    <SkipForward size={16} />
                    Skip
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleAction(item._id, "cancel")}
                    disabled={actionLoading === `cancel-${item._id}`}
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Recurring;