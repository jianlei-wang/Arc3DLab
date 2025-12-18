import http from './index';

console.log('Axios 请求库测试');

// 测试基本功能
async function testBasicFunctionality() {
  try {
    console.log('测试 GET 请求...');
    const response = await http.get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('GET 请求成功:', response.status);
    
    console.log('测试 POST 请求...');
    const postResponse = await http.post('https://jsonplaceholder.typicode.com/posts', {
      title: '测试标题',
      body: '测试内容',
      userId: 1
    });
    console.log('POST 请求成功:', postResponse.status);
    
    console.log('所有基本功能测试通过！');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testBasicFunctionality();

export { testBasicFunctionality };