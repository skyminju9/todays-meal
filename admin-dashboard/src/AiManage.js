import React from 'react';
import { Link } from 'react-router-dom';

const aiManage = () => {
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

  const buttonstyle = {

    margin: '3px 10px',
    color: 'black',
    fontWeight: 'normal',
    fontSize: '15px',
    backgroundColor: 'transparent',
    border: '0px solid transparent',
    width: 140,
    height: 50,
    cursor: 'pointer',

  };

  return (
    <div style={layoutStyle}>
      <nav style={navStyle}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/admin-page">
                <button style={buttonstyle}>
                    회원 관리
                </button>
            </Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/admin-recipe">
                <button style={buttonstyle}>
                    레시피 관리
                </button>
            </Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/admin-ai">
                <button style={buttonstyle}>
                    AI 성능 지표
                </button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};


export default aiManage;