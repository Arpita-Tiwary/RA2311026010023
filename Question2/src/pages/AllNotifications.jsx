import { useState, useEffect } from "react";
import { fetchNotifications } from "../api";
import { NotificationCard } from "../components/NotificationCard";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Log } from "../../../logging_middleware/index.js";

export function AllNotifications({ readStatus, markAsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const limit = 10;

  useEffect(() => {
    loadData();
  }, [page, typeFilter]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchNotifications({ page, limit, type: typeFilter });
    setNotifications(data);
    setLoading(false);
    
    await Log("frontend", "info", "page", "Loaded AllNotifications page");
  };

  const handleFilterChange = (e) => {
    setTypeFilter(e.target.value);
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Notifications</h1>
        <div className="controls-container">
          <select value={typeFilter} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="Event">Event</option>
            <option value="Result">Result</option>
            <option value="Placement">Placement</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} />
          <h2>No notifications found</h2>
          <p>Check back later or change your filters.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <NotificationCard 
              key={n.ID} 
              notification={n} 
              isRead={readStatus[n.ID]}
              onMarkRead={markAsRead}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button 
          className="btn" 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="page-info">Page {page}</span>
        <button 
          className="btn" 
          disabled={notifications.length < limit} 
          onClick={() => setPage(p => p + 1)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
