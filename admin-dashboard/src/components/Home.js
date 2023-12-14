import React from "react";
import {Link} from 'react-router-dom';

function Home(){
    return(
        <div>
            <h1>Hello from the frontend!</h1>
            <Link to = "/admin-login">관리자용 로그인</Link>
        </div>
    );
}

export default Home;