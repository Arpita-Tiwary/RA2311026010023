import { Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Bell size={24} />
        Campus Alerts
      </Link>
      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          All Notifications
        </Link>
        <Link 
          to="/priority" 
          className={`nav-link ${location.pathname === "/priority" ? "active" : ""}`}
        >
          Priority Inbox
        </Link>
      </div>
    </nav>
  );
}
