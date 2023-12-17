import React from 'react';

const AdminLoginPage = () => {
  const mainPageStyle = {
    backgroundColor: '#EDF6FF',
    textAlign: 'center',
    padding: '20px',
    height: '100vh',
    boxSizing: 'border-box',
  };

  const loginContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 반투명한 흰색 배경
    padding: '40px',
    borderRadius: '10px',
    maxWidth: '450px',
    height: '450px',
    margin: 'auto', // 수평 가운데 정렬
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '20px',
    paddingBottom:'20px',
    color:'#484a49',
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    borderRadius:'10px',
    border:'solid 1px #e8e8e8',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#feb1b9',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize:'20px',
    fontWeight:'bold',
  };
  

  return (
    <div style={mainPageStyle}>
      <h1 style={{paddingBottom:'50px'}}>어서오세요, 관리자님!</h1>
      <div style={loginContainerStyle}>
        <div style={headerStyle}>관리자 로그인</div>

        <input
          type="text"
          placeholder="아이디"
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="비밀번호"
          style={inputStyle}
        />

        <button style={buttonStyle}>로그인</button>
      </div>
    </div>
  );
};

export default AdminLoginPage;