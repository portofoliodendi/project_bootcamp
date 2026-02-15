import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINT, HEADERS, LOGIN_PAYLOAD } from '../config/endpoint.js';
import { htmlReport } from '../dist/bundle.js';
import { textSummary } from '../dist/index.js';

export function handleSummary(data) {
  return {
    '../report/single_test.html': htmlReport(data, { title: 'Performance Test Report' }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
    const loginRes = http.post(`${BASE_URL}${ENDPOINT.LOGIN}`, LOGIN_PAYLOAD, { headers: HEADERS });

    check(loginRes, {
        'Status is 200 (Login)': (r) => r.status === 200,
        'Response time < 1s (Login)': (r) => r.timings.duration < 1000,
    });

    const token = loginRes.json('token');

    if (token) {
        const authParams = {
            headers: Object.assign({}, HEADERS, { 'Authorization': `Bearer ${token}` })
        };

        const usersRes = http.get(`${BASE_URL}${ENDPOINT.GET_USERS}`, authParams);

        check(usersRes, {
            'Status is 200 (Users)': (r) => r.status === 200,
            'Response time < 1s (Users)': (r) => r.timings.duration < 1000,
        });
    }

    sleep(1);
}