/**
 * 稳定服务启动脚本
 * 自动检测端口占用并启动服务
 */

const { exec, spawn } = require('child_process');
const os = require('os');
const platform = os.platform();

// 端口配置
const FRONTEND_PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.SERVER_PORT || 3001;

// 根据操作系统获取查找进程的命令
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

// 根据操作系统获取终止进程的命令
const getKillCommand = (pid) => {
  switch (platform) {
    case 'win32':
      return `taskkill /F /PID ${pid}`;
    default: // macOS, Linux and others
      return `kill -9 ${pid}`;
  }
};

// 检查并关闭占用端口的进程
const closeProcessOnPort = (port) => {
  return new Promise((resolve, reject) => {
    console.log(`检查端口 ${port} 是否被占用...`);
    
    exec(getProcessCommand(port), (error, stdout, stderr) => {
      if (error) {
        console.log(`端口 ${port} 未被占用，可以使用。`);
        return resolve();
      }
      
      const pids = stdout.trim().split('\n').filter(Boolean);
      
      if (pids.length === 0) {
        console.log(`端口 ${port} 未被占用，可以使用。`);
        return resolve();
      }
      
      console.log(`端口 ${port} 被进程 ${pids.join(', ')} 占用，正在关闭...`);
      
      // 串行终止所有进程
      const killProcess = (index) => {
        if (index >= pids.length) {
          console.log(`已成功释放端口 ${port}`);
          return resolve();
        }
        
        const pid = pids[index];
        exec(getKillCommand(pid), (error) => {
          if (error) {
            console.error(`无法终止进程 ${pid}: ${error}`);
            // 继续尝试终止其他进程
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

// 启动服务
const startServices = async () => {
  try {
    // 确保环境变量加载
    require('dotenv').config();
    
    // 确保端口可用
    await closeProcessOnPort(FRONTEND_PORT);
    await closeProcessOnPort(BACKEND_PORT);
    
    console.log('正在启动服务...');
    
    // 使用npm run dev启动服务
    const child = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('error', (error) => {
      console.error(`启动服务出错: ${error.message}`);
      process.exit(1);
    });
    
    // 设置自动恢复
    process.on('uncaughtException', (error) => {
      console.error(`捕获到未处理的异常: ${error.message}`);
      console.log('正在尝试重新启动服务...');
      startServices();
    });
    
    console.log(`
======================================================
   服务已成功启动
   
   前端访问地址: http://localhost:${FRONTEND_PORT}
   后端API地址: http://localhost:${BACKEND_PORT}/api
   健康检查: http://localhost:${BACKEND_PORT}/health
======================================================
    `);
    
  } catch (error) {
    console.error(`启动服务失败: ${error.message}`);
    process.exit(1);
  }
};

// 执行启动流程
startServices(); 