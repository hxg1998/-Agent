const { exec } = require('child_process');
const os = require('os');

// 根据操作系统类型使用不同的命令
const platform = os.platform();

console.log(`检测到操作系统: ${platform}`);

let command = '';

if (platform === 'win32') {
  // Windows系统
  command = 'netstat -ano | findstr :3001';
} else {
  // macOS或Linux系统
  command = 'lsof -i :3001';
}

console.log('尝试查找占用3001端口的进程...');

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行查找命令出错: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`查找命令返回错误: ${stderr}`);
    return;
  }
  
  if (!stdout) {
    console.log('没有找到占用3001端口的进程。');
    return;
  }
  
  console.log('找到占用3001端口的进程:');
  console.log(stdout);
  
  // 提取进程ID
  let pid;
  
  if (platform === 'win32') {
    // Windows系统
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        pid = parts[parts.length - 1];
        break;
      }
    }
  } else {
    // macOS或Linux系统
    const lines = stdout.split('\n');
    // 跳过标题行
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(/\s+/);
        pid = parts[1];
        break;
      }
    }
  }
  
  if (!pid) {
    console.log('无法从输出中提取进程ID。');
    return;
  }
  
  console.log(`找到进程ID: ${pid}`);
  
  // 杀死进程
  const killCommand = platform === 'win32' ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
  
  console.log(`尝试终止进程...`);
  
  exec(killCommand, (killError, killStdout, killStderr) => {
    if (killError) {
      console.error(`终止进程时出错: ${killError.message}`);
      return;
    }
    
    if (killStderr) {
      console.error(`终止进程返回错误: ${killStderr}`);
      return;
    }
    
    console.log('进程已成功终止！');
    console.log('现在可以重新启动服务器: npm run server');
  });
}); 