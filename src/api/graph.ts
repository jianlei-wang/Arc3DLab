import http from '@/utils/request';

const baseUrl = 'http://localhost:8086/ggdk/';
export function graphSourceData() {
  return http.get(baseUrl + 'result.json');
}
