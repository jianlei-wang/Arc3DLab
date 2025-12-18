import http, { HttpRequest } from './index';

/**
 * 使用示例
 */

// 1. 基本 GET 请求
async function basicGetRequest() {
  try {
    const response = await http.get('/api/users');
    console.log('GET 请求结果:', response.data);
  } catch (error) {
    console.error('GET 请求失败:', error);
  }
}

// 2. 带参数的 POST 请求
async function postRequest() {
  try {
    const userData = { name: 'John', email: 'john@example.com' };
    const response = await http.post('/api/users', userData);
    console.log('POST 请求结果:', response.data);
  } catch (error) {
    console.error('POST 请求失败:', error);
  }
}

// 3. 启用请求合并的示例
async function mergedRequests() {
  try {
    // 这些请求将会被合并成一个请求
    const promises = [
      http.get('/api/data', { enableMerge: true, mergeWindow: 200 }),
      http.get('/api/data', { enableMerge: true, mergeWindow: 200 }),
      http.get('/api/data', { enableMerge: true, mergeWindow: 200 })
    ];
    
    const results = await Promise.all(promises);
    console.log('合并请求结果:', results);
  } catch (error) {
    console.error('合并请求失败:', error);
  }
}

// 4. 请求取消示例
async function cancelRequestExample() {
  // 创建一个新的请求实例
  const httpRequest = new HttpRequest();
  
  // 发起一个长时间运行的请求
  const longRequest = httpRequest.get('/api/long-operation');
  
  // 2秒后取消请求
  setTimeout(() => {
    httpRequest.cancelAllRequests('用户手动取消请求');
  }, 2000);
  
  try {
    const response = await longRequest;
    console.log('请求完成:', response.data);
  } catch (error) {
    console.error('请求被取消或失败:', error);
  }
}

// 5. 取消特定请求示例
async function cancelSpecificRequest() {
  const config = { url: '/api/specific', method: 'GET' };
  
  // 发起请求
  const request = http.request(config);
  
  // 1秒后取消这个特定请求
  setTimeout(() => {
    http.cancelRequest(config, '取消特定请求');
  }, 1000);
  
  try {
    const response = await request;
    console.log('特定请求完成:', response.data);
  } catch (error) {
    console.error('特定请求被取消或失败:', error);
  }
}

// 导出所有示例函数
export {
  basicGetRequest,
  postRequest,
  mergedRequests,
  cancelRequestExample,
  cancelSpecificRequest
};