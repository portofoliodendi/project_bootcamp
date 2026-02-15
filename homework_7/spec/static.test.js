import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINT, HEADERS, LOGIN_PAYLOAD } from '../config/endpoint.js';

export let options = {
  stages: [
    { duration: '5s', target: 20 },
    { duration: '10s', target: 20 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  }
};

export default function () {
    const loginRes = http.post(`${BASE_URL}${ENDPOINT.LOGIN}`, LOGIN_PAYLOAD, { headers: HEADERS });

    check(loginRes, {
        'Login: status code 200': (r) => r.status === 200,
        'Login: response time < 1s': (r) => r.timings.duration < 1000,
        'Login: has token': (r) => r.json().token !== undefined,
    });

    const token = loginRes.json('token');

    if (token) {
        const authParams = {
            headers: Object.assign({}, HEADERS, { 'Authorization': `Bearer ${token}` })
        };

        const usersRes = http.get(`${BASE_URL}${ENDPOINT.GET_USERS}`, authParams);

        check(usersRes, {
            'List Users: status code 200': (r) => r.status === 200,
            'List Users: response time < 1s': (r) => r.timings.duration < 1000,
            'List Users: data is array': (r) => Array.isArray(r.json().users),
        });
    }

    sleep(1);
}