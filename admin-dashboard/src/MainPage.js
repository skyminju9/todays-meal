import React from 'react';
import { Link } from 'react-router-dom';
import logo from './img/logo.png';
import axios from 'axios';

const MainPage = () => {
  const navigationBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: 'white',
    color: 'black',
    borderBottom:'1px solid #e8e8e8',
    
  };

  const mainPageStyle = {
    backgroundColor: '#EDF6FF',
    textAlign: 'center',
    padding: '20px',
    height: '100vh',
    boxSizing: 'border-box',
  };

  const bodyContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
  };

  const appDescriptionStyle = {
    flex: 1,
    padding: '20px',
    textAlign: 'left',
  };

  const logoContainerStyle = {
    flex: 0.7,
    textAlign: 'right',
    padding: '20px',
    alignItems:'center',
  };

  const logoStyle = {
    maxWidth: '80%',
    height: 'auto',
  };

  const buttonContainerStyle = {
    margin:30,
  };

  const buttonStyle = {
    margin: '3px 10px',
    color: 'black',
    fontWeight: 'normal',
    fontSize: '15px',
    backgroundColor: 'transparent',
    border: '1px solid black',
    borderRadius: 30,
    width: 140,
    height: 50,
    cursor: 'pointer',
    
  };

  return (
    <div>
      <div style={navigationBarStyle}>
        <div style={{paddingLeft:'10px', fontSize:'25px', fontWeight:'bold'}}>TodaysMeal</div>
        <div>
          <Link to="/admin-login">
            <button style={buttonStyle}>
              Admin Login
            </button>
          </Link>
        </div>
      </div>
      <div style={mainPageStyle}>
        <div style={bodyContainerStyle}>
          <div style={appDescriptionStyle}>
            <p style={{ paddingLeft:'40px', paddingBottom: '15px', fontSize: 45, fontWeight: 'bold' }}>Today's Meal is ...</p>
            <p style={{ paddingLeft:'40px', fontSize: 25, fontWeight:600 }}>오늘 저녁은 또 뭘 먹어야 하지?</p>
            <p style={{ paddingLeft:'40px', fontSize: 20, paddingBottom: '30px' }}>고민이 많은 분들을 위한 맞춤형 집밥 메뉴 추천 및 레시피 제공 서비스</p>
            <p style={{ paddingLeft:'50px', fontSize: 15, paddingBottom: '20px' }}>① 하루 한 번, 당신을 위한 오늘의 집밥 메뉴를 푸시 알림으로 보내드려요.</p>
            <p style={{ paddingLeft:'50px', fontSize: 15, paddingBottom: '20px' }}>② 푸시 알림을 클릭하면 앱으로 이동해 추천 메뉴의 레시피를 볼 수 있어요.</p>
            <p style={{ paddingLeft:'50px', fontSize: 15, paddingBottom: '20px' }}>③ 메뉴가 마음에 들지 않을 때는 다시 추천받을 수 있어요.</p>
            <div style={buttonContainerStyle}>
              <button style={buttonStyle}>Download App</button>
            </div>
            
          </div>
          <div style={logoContainerStyle}>
            <img src={logo} alt="app logo" style={logoStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;