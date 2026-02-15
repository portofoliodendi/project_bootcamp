export const BASE_URL = 'https://belajar-bareng.onrender.com';

export const ENDPOINT = {
    LOGIN: '/api/login',
    GET_USERS: '/api/users'
}

export const LOGIN_PAYLOAD = JSON.stringify({
    username: "admin", 
    password: "admin" 
});

export const HEADERS = {
    'Content-Type': 'application/json'
};