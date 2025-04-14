#!/bin/bash
# AI聊天应用启动脚本
# 黄祥国智能体项目

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}           AI聊天应用启动脚本                  ${NC}"
echo -e "${BLUE}=================================================${NC}"

# 检查Node.js安装
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: Node.js未安装!${NC}"
    echo -e "请访问 https://nodejs.org 下载并安装Node.js"
    exit 1
fi

# 检查当前目录是否为项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 当前目录不是项目根目录!${NC}"
    echo -e "请确保在项目根目录运行此脚本"
    exit 1
fi

# 显示选项菜单
echo -e "${GREEN}请选择操作:${NC}"
echo -e "1) 启动应用（前端+后端）"
echo -e "2) 启动应用并监控（推荐）"
echo -e "3) 停止所有运行的服务"
echo -e "4) 查看服务状态"
echo -e "5) 退出"

read -p "请输入选项 [1-5]: " option

case $option in
    1)
        echo -e "${GREEN}正在启动应用...${NC}"
        node start-service.js
        ;;
    2)
        echo -e "${GREEN}正在启动应用并开启监控...${NC}"
        node start-service.js &
        sleep 5
        node monitor-service.js
        ;;
    3)
        echo -e "${YELLOW}正在停止所有服务...${NC}"
        # 查找并杀死3000和3001端口上的进程
        PORT_3000=$(lsof -ti:3000)
        PORT_3001=$(lsof -ti:3001)
        
        if [ ! -z "$PORT_3000" ]; then
            echo "正在终止端口3000进程: $PORT_3000"
            kill -9 $PORT_3000
        else
            echo "端口3000没有运行的进程"
        fi
        
        if [ ! -z "$PORT_3001" ]; then
            echo "正在终止端口3001进程: $PORT_3001"
            kill -9 $PORT_3001
        else
            echo "端口3001没有运行的进程"
        fi
        
        echo -e "${GREEN}所有服务已停止${NC}"
        ;;
    4)
        echo -e "${BLUE}正在检查服务状态...${NC}"
        echo -e "${YELLOW}前端服务 (端口3000):${NC}"
        if lsof -ti:3000 &> /dev/null; then
            echo -e "${GREEN}✓ 运行中${NC}"
            lsof -i:3000
        else
            echo -e "${RED}✗ 未运行${NC}"
        fi
        
        echo -e "${YELLOW}后端服务 (端口3001):${NC}"
        if lsof -ti:3001 &> /dev/null; then
            echo -e "${GREEN}✓ 运行中${NC}"
            lsof -i:3001
        else
            echo -e "${RED}✗ 未运行${NC}"
        fi
        ;;
    5)
        echo -e "${BLUE}退出脚本${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}无效选项!${NC}"
        exit 1
        ;;
esac

echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}感谢使用AI聊天应用!${NC}"
echo -e "${BLUE}=================================================${NC}" 