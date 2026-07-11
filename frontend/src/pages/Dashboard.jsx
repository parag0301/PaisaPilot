import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, Percent } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import "./Dashboard.css";
import SmartTips from "../components/SmartTips";

// Colors for the pie chart slices
const PIE_COLORS = [
  "#5046e5",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchReminders();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await api.get("/api/dashboard");
      // Dashboard returns data inside response.data.data
      setData(res.data.data);
    } catch (err) {
      toast.error("Could not load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchReminders() {
    try {
      const res = await api.get("/api/recurring/get-all");
      const recurringExpenses = res.data.data || [];
      const upcomingExpenses = [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < recurringExpenses.length; i++) {
        const dueDate = new Date(recurringExpenses[i].nextDueDate);
        dueDate.setHours(0, 0, 0, 0);

        const difference = dueDate - today;
        const daysLeft = Math.round(difference / 86400000);

        if (daysLeft >= 0 && daysLeft <= 3) {
          recurringExpenses[i].daysLeft = daysLeft;
          upcomingExpenses.push(recurringExpenses[i]);
        }
      }

      setReminders(upcomingExpenses);
    } catch (error) {
      console.log("Could not load reminders");
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Here's your financial snapshot for this month.</p>
          </div>

          <div className="notification-box">
            <button
              className="notification-button"
              onClick={function () {
                setShowNotifications(!showNotifications);
              }}
            >
              🔔
              {reminders.length > 0 && (
                <span className="notification-number">{reminders.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-list">
                <h3>Upcoming Payments</h3>

                {reminders.length === 0 ? (
                  <p className="no-notification">No upcoming payments.</p>
                ) : (
                  reminders.map(function (item) {
                    return (
                      <div className="notification-item" key={item._id}>
                        <div>
                          <p className="notification-name">
                            {item.description}
                          </p>

                          <p className="notification-date">
                            {item.daysLeft === 0
                              ? "Due today"
                              : item.daysLeft === 1
                                ? "Due tomorrow"
                                : "Due in " + item.daysLeft + " days"}
                          </p>
                        </div>

                        <span className="notification-amount">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Stat Cards */}
            <div className="dashboard-stats">
              <StatCard
                title="Monthly Income"
                value={formatCurrency(data?.monthlyIncome || 0)}
                subtitle="This month's earnings"
                icon={<TrendingUp size={18} />}
                color="income"
              />
              <StatCard
                title="Monthly Expense"
                value={formatCurrency(data?.monthlyExpense || 0)}
                subtitle="This month's spending"
                icon={<TrendingDown size={18} />}
                color="expense"
              />
              <StatCard
                title="Net Savings"
                value={formatCurrency(data?.savings || 0)}
                subtitle="Income minus expenses"
                icon={<Wallet size={18} />}
                color="savings"
              />
              <StatCard
                title="Savings Rate"
                value={`${data?.savingsRate || 0}%`}
                subtitle="Of your income saved"
                icon={<Percent size={18} />}
                color="primary"
              />
            </div>
            <SmartTips
              income={data?.monthlyIncome || 0}
              expense={data?.monthlyExpense || 0}
              savingsRate={data?.savingsRate || 0}
            />

            {/* Chart + Recent Transactions */}
            <div className="dashboard-bottom">
              {/* Expense Distribution Chart */}
              <div className="card chart-card">
                <h2 className="card-title">Expense Breakdown</h2>
                <p className="card-subtitle">
                  Where your money went this month
                </p>

                {data?.expenseDistribution?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={data.expenseDistribution}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={55}
                        paddingAngle={3}
                      >
                        {data.expenseDistribution.map((entry, index) => (
                          <Cell
                            key={entry.category}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          fontFamily: "Plus Jakarta Sans, sans-serif",
                          fontSize: "0.85rem",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "0.8rem" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState
                    icon="📉"
                    title="No expense data"
                    subtitle="Add some expenses to see your spending breakdown."
                  />
                )}
              </div>

              {/* Recent Transactions */}
              <div className="card recent-card">
                <h2 className="card-title">Recent Transactions</h2>
                <p className="card-subtitle">Latest activity this month</p>

                {data?.recentTransactions?.length > 0 ? (
                  <div className="recent-list">
                    {data.recentTransactions
                      .sort(function (a, b) {
                        return new Date(b.date) - new Date(a.date);
                      })
                      .slice(0, 5)
                      .map((tx) => (
                        <div className="recent-item" key={tx._id}>
                          <div className="recent-left">
                            <div className={`recent-dot ${tx.type}`} />
                            <div>
                              <p className="recent-desc">{tx.description}</p>
                              <p className="recent-meta">
                                {tx.category} ·{" "}
                                {formatDate(tx.date || tx.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className={`recent-amount ${tx.type}`}>
                            {tx.type === "income" ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="📋"
                    title="No transactions yet"
                    subtitle="Add income or expenses to see them here."
                  />
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
