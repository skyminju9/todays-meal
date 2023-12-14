import axios from "axios";

const BASE_URL = 'http://ceprj.gachon.ac.kr:60022';

export const login = async(userid, password) => {
    try{
        const response = await axios.post(`${BASE_URL}/login`, {userid, password});
        return response.data;
    }catch(error){
        throw error.response.data;
    }
};