import React, { useSelector } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="...">
      {/* Other sidebar items */}
      
      {user?.role !== 'admin' && (
        <Link to="/feedback/new" className="...">
          <span className="flex items-center">
            <svg>...</svg>
            Submit Feedback
          </span>
        </Link>
      )}
      
      {/* Other sidebar items */}
    </nav>
  );
}

export default Sidebar; 