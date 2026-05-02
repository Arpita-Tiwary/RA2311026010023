import { useState, useEffect } from "react";
import { fetchNotifications } from "../api";
import { NotificationCard } from "../components/NotificationCard";
import { Inbox } from "lucide-react";
import { Log } from "../../../logging_middleware/index.js";

const WEIGHTS = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};

export function PriorityInbox({ readStatus, markAsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    loadAndSortData();
  }, [topN]);

  const loadAndSortData = async () => {
    setLoading(true);
    
    // Fetch a large pool to find the top priority ones (simulating continuous stream processing)
    const rawData = await fetchNotifications({ page: 1, limit: 10 });
    
    const processed = rawData.map(n => ({
      ...n,
      weight: WEIGHTS[n.Type] || 0,
      timestampVal: new Date(n.Timestamp).getTime()
    }));

    processed.sort((a, b) => {
      if (a.weight !== b.weight) {
        return b.weight - a.weight; // Descending weight
      }
      return b.timestampVal - a.timestampVal; // Descending timestamp
    });

    setNotifications(processed.slice(0, topN));
    setLoading(false);
    
    await Log("frontend", "info", "page", "Loaded PriorityInbox");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Priority Inbox</h1>
        <div className="controls-container">
          <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
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
          <h2>Inbox Zero!</h2>
          <p>You have caught up with all important updates.</p>
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
    </div>
  );
}
