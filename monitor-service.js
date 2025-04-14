/**
 * 服务监控脚本
 * 定期检查服务健康状态，在服务不可用时自动重启
 */

const axios = require('axios');
const { exec } = require('child_process');
const os = require('os');
const platform = os.platform();

// 配置项
const CONFIG = {
  // 健康检查间隔（毫秒）
  checkInterval: 30000, // 30秒
  
  // 重试次数，超过此次数才判断为不健康
  maxRetries: 3,
  
  // 前端服务配置
  frontend: {
    port: process.env.PORT || 3000,
    url: 'http://localhost:3000'
  },
  
  // 后端服务配置
  backend: {
    port: process.env.SERVER_PORT || 3001,
    healthUrl: 'http://localhost:3001/health'
  }
};

// 根据操作系统获取进程命令
const getProcessCommand = (port) => {
  switch (platform) {
    case 'win32':
      return `netstat -ano | findstr :${port}`;
    case 'darwin': // macOS
      return `lsof -i :${port} -t`;
    default: // Linux and others
      return `lsof -i :${port} -t`;
  }
};

// 根据操作系统获取终止进程命令
const getKillCommand = (pid) => {
  switch (platform) {
    case 'win32':
      return `taskkill /F /PID ${pid}`;
    default: // macOS, Linux and others
      return `kill -9 ${pid}`;
  }
};

// 终止指定端口上的进程
const killProcessOnPort = (port) => {
  return new Promise((resolve, reject) => {
    exec(getProcessCommand(port), (error, stdout, stderr) => {
      if (error || !stdout.trim()) {
        console.log(`端口 ${port} 上没有运行的进程`);
        return resolve();
      }
      
      const pids = stdout.trim().split('\n').filter(Boolean);
      if (pids.length === 0) {
        return resolve();
      }
      
      console.log(`正在终止端口 ${port} 上的进程: ${pids.join(', ')}`);
      
      // 串行终止所有进程
      const killProcess = (index) => {
        if (index >= pids.length) {
          return resolve();
        }
        
        const pid = pids[index];
        exec(getKillCommand(pid), (error) => {
          if (error) {
            console.error(`无法终止进程 ${pid}: ${error}`);
          } else {
            console.log(`已终止进程 ${pid}`);
          }
          killProcess(index + 1);
        });
      };
      
      killProcess(0);
    });
  });
};

// 重启服务
const restartService = async () => {
  console.log('正在重启服务...');
  
  try {
    // 停止现有服务
    await killProcessOnPort(CONFIG.frontend.port);
    await killProcessOnPort(CONFIG.backend.port);
    
    // 启动服务
    exec('node start-service.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`启动服务失败: ${error.message}`);
        return;
      }
      console.log('服务已重启');
    });
  } catch (error) {
    console.error(`重启服务出错: ${error.message}`);
  }
};

// 检查后端服务健康状态
const checkBackendHealth = async () => {
  let retries = 0;
  let healthy = false;
  
  while (retries < CONFIG.maxRetries && !healthy) {
    try {
      console.log(`检查后端服务健康状态 (尝试 ${retries + 1}/${CONFIG.maxRetries})...`);
      const response = await axios.get(CONFIG.backend.healthUrl, { timeout: 5000 });
      
      if (response.status === 200 && response.data.status === 'UP') {
        console.log('后端服务运行正常');
        healthy = true;
      } else {
        console.warn(`后端服务响应异常: ${JSON.stringify(response.data)}`);
        retries++;
      }
    } catch (error) {
      console.error(`后端健康检查失败: ${error.message}`);
      retries++;
    }
    
    if (!healthy && retries < CONFIG.maxRetries) {
      // 等待2秒再次尝试
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return healthy;
};

// 检查前端服务可用性
const checkFrontendAvailability = async () => {
  let retries = 0;
  let available = false;
  
  while (retries < CONFIG.maxRetries && !available) {
    try {
      console.log(`检查前端服务可用性 (尝试 ${retries + 1}/${CONFIG.maxRetries})...`);
      const response = await axios.get(CONFIG.frontend.url, { timeout: 5000 });
      
      if (response.status === 200) {
        console.log('前端服务运行正常');
        available = true;
      } else {
        console.warn(`前端服务响应异常: HTTP ${response.status}`);
        retries++;
      }
    } catch (error) {
      console.error(`前端可用性检查失败: ${error.message}`);
      retries++;
    }
    
    if (!available && retries < CONFIG.maxRetries) {
      // 等待2秒再次尝试
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return available;
};

// 执行健康检查
const performHealthCheck = async () => {
  console.log('开始执行服务健康检查...');
  
  const backendHealthy = await checkBackendHealth();
  const frontendAvailable = await checkFrontendAvailability();
  
  if (!backendHealthy || !frontendAvailable) {
    console.warn('服务健康检查失败，需要重启服务');
    await restartService();
  } else {
    console.log('服务健康检查通过，服务运行正常');
  }
};

// 启动监控
console.log(`
====================================================
   服务监控已启动
   健康检查间隔: ${CONFIG.checkInterval / 1000} 秒
   检查重试次数: ${CONFIG.maxRetries} 次
====================================================
`);

// 立即执行一次健康检查
performHealthCheck();

// 设置定期健康检查
setInterval(performHealthCheck, CONFIG.checkInterval); 