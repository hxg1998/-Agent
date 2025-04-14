/**
 * 简单的ESLint和Prettier检查脚本
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}开始执行代码质量检查${colors.reset}`);

// 确保src目录存在
if (!fs.existsSync(path.join(process.cwd(), 'src'))) {
  console.error(`${colors.red}错误: src目录不存在!${colors.reset}`);
  process.exit(1);
}

try {
  // 运行ESLint检查
  console.log(`\n${colors.blue}🔍 执行ESLint检查...${colors.reset}`);
  execSync('npx eslint src --ext .js,.jsx', { stdio: 'inherit' });
  console.log(`${colors.green}✅ ESLint检查通过${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ ESLint检查失败${colors.reset}`);
  console.error(`${colors.yellow}提示: 尝试运行 'npm run lint:fix' 自动修复问题${colors.reset}`);
}

try {
  // 运行Prettier检查
  console.log(`\n${colors.blue}🔍 执行Prettier格式检查...${colors.reset}`);
  execSync('npx prettier --check "src/**/*.{js,jsx,json,css}"', { stdio: 'inherit' });
  console.log(`${colors.green}✅ Prettier检查通过${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Prettier检查失败${colors.reset}`);
  console.error(`${colors.yellow}提示: 尝试运行 'npx prettier --write "src/**/*.{js,jsx,json,css}"' 自动修复格式问题${colors.reset}`);
}

try {
  // 运行StyleLint检查
  console.log(`\n${colors.blue}🔍 执行StyleLint检查...${colors.reset}`);
  execSync('npx stylelint "src/**/*.css"', { stdio: 'inherit' });
  console.log(`${colors.green}✅ StyleLint检查通过${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ StyleLint检查失败${colors.reset}`);
  console.error(`${colors.yellow}提示: 尝试运行 'npx stylelint --fix "src/**/*.css"' 自动修复样式问题${colors.reset}`);
}

console.log(`\n${colors.cyan}代码质量检查完成${colors.reset}`);