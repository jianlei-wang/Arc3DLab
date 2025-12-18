import http from './index';

/**
 * 测试文件
 */

async function testBasicRequest() {
  console.log('开始测试基本请求功能...');
  
  try {
    // 测试 GET 请求（使用一个公共的测试 API）
    const response = await http.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('GET 请求成功:', {
      status: response.status,
      data: response.data
    });
  } catch (error) {
    console.error('GET 请求失败:', error);
  }
}

async function testPostRequest() {
  console.log('开始测试 POST 请求功能...');
  
  try {
    const postData = {
      title: '测试标题',
      body: '测试内容',
      userId: 1
    };
    
    const response = await http.post('https://jsonplaceholder.typicode.com/posts', postData);
    console.log('POST 请求成功:', {
      status: response.status,
      data: response.data
    });
  } catch (error) {
    console.error('POST 请求失败:', error);
  }
}

async function testRequestCancellation() {
  console.log('开始测试请求取消功能...');
  
  try {
    // 发起一个请求
    const request = http.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // 立即取消请求
    setTimeout(() => {
      http.cancelAllRequests('测试取消功能');
    }, 10);
    
    const response = await request;
    console.log('请求完成:', response.data);
  } catch (error) {
    console.log('请求被成功取消:', error.message);
  }
}

// 运行测试
testBasicRequest();
testPostRequest();
setTimeout(testRequestCancellation, 1000); // 延迟执行取消测试

export { testBasicRequest, testPostRequest, testRequestCancellation };