import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';

/**
 * 请求配置接口
 */
interface RequestConfig extends AxiosRequestConfig {
  // 是否启用请求合并
  enableMerge?: boolean;
  // 合并时间窗口（毫秒）
  mergeWindow?: number;
}

/**
 * 请求合并队列项
 */
interface MergeQueueItem {
  config: RequestConfig;
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: any) => void;
}

/**
 * 基于 Axios 的请求封装类
 */
class HttpRequest {
  private axiosInstance: AxiosInstance;
  private pendingRequests: Map<string, CancelTokenSource>;
  private mergeQueue: Map<string, MergeQueueItem[]>;
  private mergeTimers: Map<string, NodeJS.Timeout>;

  constructor(config?: AxiosRequestConfig) {
    // 创建 axios 实例
    this.axiosInstance = axios.create(config);

    // 存储待处理的请求（用于取消）
    this.pendingRequests = new Map();

    // 存储待合并的请求队列
    this.mergeQueue = new Map();

    // 存储合并定时器
    this.mergeTimers = new Map();

    // 设置拦截器
    this.setupInterceptors();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在发送请求之前做些什么
        return config;
      },
      (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 对响应数据做点什么
        return response;
      },
      (error) => {
        // 对响应错误做点什么
        return Promise.reject(error);
      }
    );
  }

  /**
   * 生成请求唯一标识
   */
  private generateRequestKey(config: RequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
  }

  /**
   * 添加请求到待处理列表
   */
  private addPendingRequest(config: RequestConfig): void {
    const requestKey = this.generateRequestKey(config);

    // 如果已经存在相同请求且允许取消，则先取消之前的请求
    if (this.pendingRequests.has(requestKey)) {
      const cancelToken = this.pendingRequests.get(requestKey);
      cancelToken && cancelToken.cancel(`重复请求: ${requestKey}`);
    }

    // 创建新的取消令牌
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    this.pendingRequests.set(requestKey, cancelTokenSource);
  }

  /**
   * 从待处理列表中移除请求
   */
  private removePendingRequest(config: RequestConfig): void {
    const requestKey = this.generateRequestKey(config);
    if (this.pendingRequests.has(requestKey)) {
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * 发起 GET 请求
   */
  public get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * 发起 POST 请求
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * 发起 PUT 请求
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * 发起 DELETE 请求
   */
  public delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * 通用请求方法
   */
  public async request<T = any>(
    config: RequestConfig
  ): Promise<AxiosResponse<T>> {
    const { enableMerge = false, mergeWindow = 100 } = config;

    // 如果启用了请求合并
    if (enableMerge) {
      return this.mergedRequest<T>(config);
    }

    // 添加到待处理请求
    this.addPendingRequest(config);

    try {
      // 发起请求
      const response = await this.axiosInstance.request<T>(config);

      // 请求完成后从待处理列表中移除
      this.removePendingRequest(config);

      return response;
    } catch (error) {
      // 请求失败也从待处理列表中移除
      this.removePendingRequest(config);

      return Promise.reject(error);
    }
  }

  /**
   * 支持合并的请求方法
   */
  private mergedRequest<T = any>(
    config: RequestConfig
  ): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      const requestKey = this.generateRequestKey(config);
      const { mergeWindow = 100 } = config;

      // 如果队列中已存在相同请求，则加入队列
      if (this.mergeQueue.has(requestKey)) {
        this.mergeQueue.get(requestKey)?.push({ config, resolve, reject });
        return;
      }

      // 创建新的队列
      this.mergeQueue.set(requestKey, [{ config, resolve, reject }]);

      // 设置合并定时器
      const timer = setTimeout(async () => {
        // 获取队列中的所有请求
        const queue = this.mergeQueue.get(requestKey) || [];
        this.mergeQueue.delete(requestKey);
        this.mergeTimers.delete(requestKey);

        if (queue.length === 0) return;

        try {
          // 发起请求
          const response = await this.axiosInstance.request<T>(config);

          // 通知队列中的所有请求
          queue.forEach((item) => {
            item.resolve(response);
          });
        } catch (error) {
          // 通知队列中的所有请求
          queue.forEach((item) => {
            item.reject(error);
          });
        }
      }, mergeWindow);

      this.mergeTimers.set(requestKey, timer);
    });
  }

  /**
   * 取消所有待处理的请求
   */
  public cancelAllRequests(reason?: string): void {
    this.pendingRequests.forEach((cancelTokenSource, requestKey) => {
      cancelTokenSource.cancel(reason || `取消所有请求: ${requestKey}`);
    });

    // 清空待处理请求列表
    this.pendingRequests.clear();

    // 清空合并队列
    this.mergeQueue.forEach((queue) => {
      queue.forEach((item) => {
        item.reject(new Error('请求已被取消'));
      });
    });

    this.mergeQueue.clear();

    // 清空合并定时器
    this.mergeTimers.forEach((timer) => {
      clearTimeout(timer);
    });

    this.mergeTimers.clear();
  }

  /**
   * 取消特定请求
   */
  public cancelRequest(config: RequestConfig, reason?: string): void {
    const requestKey = this.generateRequestKey(config);

    if (this.pendingRequests.has(requestKey)) {
      const cancelTokenSource = this.pendingRequests.get(requestKey);
      cancelTokenSource &&
        cancelTokenSource.cancel(reason || `取消请求: ${requestKey}`);
      this.pendingRequests.delete(requestKey);
    }

    // 如果在合并队列中，也需要移除
    if (this.mergeQueue.has(requestKey)) {
      const queue = this.mergeQueue.get(requestKey) || [];
      queue.forEach((item) => {
        item.reject(new Error(reason || `请求已被取消: ${requestKey}`));
      });
      this.mergeQueue.delete(requestKey);

      // 清除定时器
      if (this.mergeTimers.has(requestKey)) {
        const timer = this.mergeTimers.get(requestKey);
        timer && clearTimeout(timer);
        this.mergeTimers.delete(requestKey);
      }
    }
  }
}

// 创建默认实例
const http = new HttpRequest({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 导出默认实例和类
export default http;
export { HttpRequest, type RequestConfig };
