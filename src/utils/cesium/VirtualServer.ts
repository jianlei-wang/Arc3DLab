import { Resource } from 'cesium';

// 添加 loadImage 函数定义
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function normalizePath(p: string) {
  // 解码URL编码的字符，然后标准化路径
  try {
    return decodeURIComponent(
      p.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+/g, '/')
    );
  } catch (e) {
    // 如果解码失败，回退到原始处理
    return p.replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+/g, '/');
  }
}

export function createVirtualServer(files: any[], baseUrl: string) {
  const map = new Map();
  files.forEach((f) => {
    const key = normalizePath(f.webkitRelativePath || f.name);
    map.set(key, f);
  });

  // 保存原始方法的引用
  const orig: any = {
    fetchArrayBuffer: Resource.prototype.fetchArrayBuffer,
    fetchJson: Resource.prototype.fetchJson,
    fetchText: Resource.prototype.fetchText,
    fetchBlob: Resource.prototype.fetchBlob,
    fetchImage: Resource.prototype.fetchImage,
  };

  // 用于跟踪已加载的资源，避免重复加载
  const loadedResources = new Set();

  function getFileFromUrl(url: string) {
    if (!url) return null;

    // 检查 URL 是否以 baseUrl 开头
    if (url.startsWith(baseUrl)) {
      // 提取相对路径部分
      const rel = normalizePath(url.substring(baseUrl.length));

      const f = map.get(rel);
      if (f) {
        return f;
      }

      // 如果直接匹配失败，尝试其他可能的路径格式
      const f2 = map.get(rel.startsWith('/') ? rel.substring(1) : '/' + rel);
      if (f2) {
        return f2;
      }
    }

    return null;
  }

  function enable() {
    // 创建新的方法而不是直接替换，以避免某些冲突
    Resource.prototype.fetchArrayBuffer = function (options: any) {
      const f = getFileFromUrl(this.url);
      if (f) {
        const resourceKey = this.url;
        if (!loadedResources.has(resourceKey)) {
          loadedResources.add(resourceKey);
        }
        return f.arrayBuffer();
      }
      return orig.fetchArrayBuffer.call(this, options);
    };
    
    Resource.prototype.fetchJson = function (options: any) {
      const f = getFileFromUrl(this.url);
      if (f) {
        const resourceKey = this.url;
        if (!loadedResources.has(resourceKey)) {
          loadedResources.add(resourceKey);
        }
        return f.text().then((t: any) => JSON.parse(t));
      }
      return orig.fetchJson.call(this, options);
    };
    
    Resource.prototype.fetchText = function (options: any) {
      const f = getFileFromUrl(this.url);
      if (f) {
        const resourceKey = this.url;
        if (!loadedResources.has(resourceKey)) {
          loadedResources.add(resourceKey);
        }
        return f.text();
      }
      return orig.fetchText.call(this, options);
    };
    
    Resource.prototype.fetchBlob = function (options: any) {
      const f = getFileFromUrl(this.url);
      if (f) {
        const resourceKey = this.url;
        if (!loadedResources.has(resourceKey)) {
          loadedResources.add(resourceKey);
        }
        return Promise.resolve(f);
      }
      return orig.fetchBlob.call(this, options);
    };
    
    Resource.prototype.fetchImage = function (options) {
      const f = getFileFromUrl(this.url);
      if (f) {
        const resourceKey = this.url;
        if (!loadedResources.has(resourceKey)) {
          loadedResources.add(resourceKey);
        }
        const u = URL.createObjectURL(f);

        return loadImage(u).then((img) => {
          URL.revokeObjectURL(u);
          return img;
        });
      }
      return orig.fetchImage.call(this, options);
    };
  }
  
  function disable() {
    // 恢复原始方法
    Resource.prototype.fetchArrayBuffer = orig.fetchArrayBuffer;
    Resource.prototype.fetchJson = orig.fetchJson;
    Resource.prototype.fetchText = orig.fetchText;
    Resource.prototype.fetchBlob = orig.fetchBlob;
    Resource.prototype.fetchImage = orig.fetchImage;
    
    // 清空已加载资源记录
    loadedResources.clear();
  }
  
  return { enable, disable };
}

export function create3DTilesServer(files: any[]) {
  const BASE_URL = 'https://local-tiles/';
  const vServer = createVirtualServer(files, BASE_URL);
  vServer.enable();
  let tilesetFile: any = null;
  for (const f of files) {
    //@ts-ignore
    const name = (f.webkitRelativePath || f.name).split('/').pop() || '';
    if (/^tileset\.json$/i.test(name)) {
      tilesetFile = f;
      break;
    }
  }
  if (!tilesetFile) {
    alert('未找到 tileset.json');
    return;
  }
  const rel = normalizePath(tilesetFile.webkitRelativePath || tilesetFile.name);
  const url = BASE_URL + rel;
  return url;
}