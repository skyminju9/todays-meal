import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import { login } from "../services/api";

function AdminLogin(){
    
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async() => {
        try{
            const result = await login(userid, password);
            history.push('/admin');
        }catch(error){
            console.log('Login error', error);
        }
    };

    return(
        <div>
            <h1>관리자용 로그인</h1>
            <div>
                <label>아이디:</label>
                <input type="text" value={userid} onChange={(e)=>setUserid(e.target.value)}/>
            </div>
            <div>
                <label>비밀번호:</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button onClick = {handleLogin}>로그인</button>
            <Link to="/">홈으로 이동</Link>
        </div>
    )
}

export default AdminLogin;