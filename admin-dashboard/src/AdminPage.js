import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = ({ children }) => {
  const layoutStyle = {
    display: 'flex',
    height: '100vh',
  };

  const navStyle = {
    backgroundColor: '#EDF6FF',
    width: '200px',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const contentStyle = {
    flex: 1,
    padding: '20px',
    boxSizing: 'border-box',
  };

  return (
    <div style={layoutStyle}>
      <nav style={navStyle}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/admin/member">회원 관리</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/admin/recipe">레시피 관리</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/admin/ai">AI 성능 지표</Link>
          </li>
        </ul>
      </nav>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};


export default AdminPage;
