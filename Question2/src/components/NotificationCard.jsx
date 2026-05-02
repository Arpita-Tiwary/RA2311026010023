import { Briefcase, FileText, Calendar } from "lucide-react";

export function NotificationCard({ notification, isRead, onMarkRead }) {
  const getIcon = () => {
    switch (notification.Type) {
      case "Placement": return <Briefcase size={20} />;
      case "Result": return <FileText size={20} />;
      case "Event": return <Calendar size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getCardClass = () => {
    return `notification-card ${!isRead ? "unread" : ""}`;
  };

  const getIconClass = () => {
    return `card-icon icon-${notification.Type.toLowerCase()}`;
  };

  const getTypeClass = () => {
    return `card-type type-${notification.Type.toLowerCase()}`;
  };

  const formattedTime = new Date(notification.Timestamp).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={getCardClass()} onClick={() => onMarkRead(notification.ID)}>
      {!isRead && <div className="unread-badge"></div>}
      
      <div className={getIconClass()}>
        {getIcon()}
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <span className={getTypeClass()}>{notification.Type}</span>
          <span className="card-time">{formattedTime}</span>
        </div>
        <div className="card-message">
          {notification.Message}
        </div>
      </div>
    </div>
  );
}
