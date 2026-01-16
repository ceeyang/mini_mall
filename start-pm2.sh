#!/bin/bash

# Mini Mall PM2 一键启动脚本
# 适用于生产环境部署，兼容 Ubuntu 和 macOS

echo "🚀 开始 Mini Mall PM2 部署..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检测操作系统
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # 检测 Linux 发行版
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$ID
        else
            OS="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    else
        OS="unknown"
    fi
    echo "$OS"
}

OS=$(detect_os)
echo -e "${BLUE}📱 检测到操作系统: $OS${NC}"

# 检查是否有 sudo 权限（Linux 需要）
check_sudo() {
    if [[ "$OS" != "macos" ]]; then
        if ! sudo -n true 2>/dev/null; then
            echo -e "${YELLOW}⚠️  需要 sudo 权限来安装系统包，请输入密码${NC}"
            sudo -v
        fi
    fi
}

# 检查并安装命令（Ubuntu/Debian）
install_command_ubuntu() {
    local cmd=$1
    local package=$2
    
    if ! command -v "$cmd" &> /dev/null; then
        echo -e "${YELLOW}⬇️  正在安装 $package (Ubuntu/Debian)...${NC}"
        check_sudo
        sudo apt-get update -qq
        sudo apt-get install -y "$package"
    else
        echo -e "${GREEN}✅ $cmd 已安装${NC}"
    fi
}

# 检查并安装命令（macOS）
install_command_macos() {
    local cmd=$1
    local package=$2
    
    if ! command -v "$cmd" &> /dev/null; then
        echo -e "${YELLOW}⬇️  正在安装 $package (macOS)...${NC}"
        
        # 检查是否有 Homebrew
        if ! command -v brew &> /dev/null; then
            echo -e "${YELLOW}📦 检测到 Homebrew 未安装，正在安装 Homebrew...${NC}"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            
            # 添加 Homebrew 到 PATH（针对 Apple Silicon Mac）
            if [[ -f "/opt/homebrew/bin/brew" ]]; then
                eval "$(/opt/homebrew/bin/brew shellenv)"
            elif [[ -f "/usr/local/bin/brew" ]]; then
                eval "$(/usr/local/bin/brew shellenv)"
            fi
        fi
        
        brew install "$package"
    else
        echo -e "${GREEN}✅ $cmd 已安装${NC}"
    fi
}

# 加载环境变量（解决 NVM 或自定义路径找不到 Node 的问题）
load_environment() {
    # 加载 .bashrc 和 .profile (针对 Ubuntu 等 Linux 发行版)
    if [ -f "$HOME/.bashrc" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
    fi
    
    # 再次明确检查 NVM 默认路径
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
    
    # 增加常用系统路径
    export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$PATH
}

load_environment

# 1. 检查并安装 Node.js 和 npm
install_nodejs() {
    NODE_CMD=""
    
    # 首先尝试通过 command -v 查找
    if command -v node &> /dev/null 2>&1; then
        NODE_CMD="node"
    elif command -v nodejs &> /dev/null 2>&1; then
        NODE_CMD="nodejs"
        echo -e "${YELLOW}⚠️  检测到 nodejs 命令，但未找到 node 命令${NC}"
        # 尝试创建软链接（需要权限）
        if [ -x "/usr/bin/nodejs" ] && [ ! -f "/usr/bin/node" ]; then
            echo -e "${YELLOW}   正在创建 node 软链接...${NC}"
            if sudo ln -sf /usr/bin/nodejs /usr/bin/node 2>/dev/null; then
                NODE_CMD="node"
                echo -e "${GREEN}✅ 已创建 node 软链接${NC}"
            fi
        fi
    elif [ -x "/usr/bin/nodejs" ]; then
        NODE_CMD="/usr/bin/nodejs"
        export PATH="/usr/bin:$PATH"
    elif [ -x "/usr/bin/node" ]; then
        NODE_CMD="/usr/bin/node"
        export PATH="/usr/bin:$PATH"
    elif [ -x "/usr/local/bin/node" ]; then
        NODE_CMD="/usr/local/bin/node"
        export PATH="/usr/local/bin:$PATH"
    elif [ -x "/opt/homebrew/bin/node" ]; then
        NODE_CMD="/opt/homebrew/bin/node"
        export PATH="/opt/homebrew/bin:$PATH"
    else
        # 未找到 Node.js，尝试安装
        echo -e "${YELLOW}📦 Node.js 未安装，正在自动安装...${NC}"
        
        if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
            check_sudo
            sudo apt-get update -qq
            sudo apt-get install -y nodejs npm
            # 重新加载环境
            load_environment
            # 再次检查
            if command -v nodejs &> /dev/null 2>&1; then
                NODE_CMD="nodejs"
                # 创建软链接
                if [ -x "/usr/bin/nodejs" ] && [ ! -f "/usr/bin/node" ]; then
                    sudo ln -sf /usr/bin/nodejs /usr/bin/node
                    NODE_CMD="node"
                fi
            elif command -v node &> /dev/null 2>&1; then
                NODE_CMD="node"
            else
                echo -e "${RED}❌ Node.js 安装失败，请手动安装${NC}"
                exit 1
            fi
        elif [[ "$OS" == "macos" ]]; then
            # macOS 使用 Homebrew 安装
            if ! command -v brew &> /dev/null; then
                echo -e "${YELLOW}📦 正在安装 Homebrew...${NC}"
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                
                # 添加 Homebrew 到 PATH
                if [[ -f "/opt/homebrew/bin/brew" ]]; then
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                elif [[ -f "/usr/local/bin/brew" ]]; then
                    eval "$(/usr/local/bin/brew shellenv)"
                fi
            fi
            
            brew install node
            load_environment
            
            if command -v node &> /dev/null 2>&1; then
                NODE_CMD="node"
            else
                echo -e "${RED}❌ Node.js 安装失败，请手动安装${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ 无法自动安装 Node.js，请手动安装${NC}"
            echo -e "Ubuntu/Debian: sudo apt-get install nodejs npm"
            echo -e "macOS: brew install node"
            exit 1
        fi
    fi
    
    # 验证 Node.js 版本
    NODE_VERSION=$($NODE_CMD --version 2>/dev/null || echo "unknown")
    if [[ "$NODE_VERSION" != "unknown" ]]; then
        echo -e "${GREEN}✅ 检测到 Node.js: $NODE_VERSION (使用命令: $NODE_CMD)${NC}"
    else
        echo -e "${RED}❌ 无法获取 Node.js 版本信息${NC}"
        exit 1
    fi
}

install_nodejs

# 2. 检查并安装 npm
install_npm() {
    NPM_CMD=""
    
    if command -v npm &> /dev/null 2>&1; then
        NPM_CMD="npm"
    elif [ -x "/usr/bin/npm" ]; then
        NPM_CMD="/usr/bin/npm"
        export PATH="/usr/bin:$PATH"
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        fi
    elif [ -x "/usr/local/bin/npm" ]; then
        NPM_CMD="/usr/local/bin/npm"
        export PATH="/usr/local/bin:$PATH"
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        fi
    elif [ -x "/opt/homebrew/bin/npm" ]; then
        NPM_CMD="/opt/homebrew/bin/npm"
        export PATH="/opt/homebrew/bin:$PATH"
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        fi
    else
        # npm 通常随 Node.js 一起安装，如果找不到，可能是安装不完整
        echo -e "${RED}❌ npm 未找到，但 Node.js 已安装${NC}"
        echo -e "${YELLOW}   尝试重新安装 Node.js 和 npm...${NC}"
        
        if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
            check_sudo
            sudo apt-get install -y --reinstall nodejs npm
            load_environment
        elif [[ "$OS" == "macos" ]]; then
            brew reinstall node
            load_environment
        fi
        
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        else
            echo -e "${RED}❌ npm 安装失败，请手动安装${NC}"
            exit 1
        fi
    fi
    
    # 验证 npm 版本
    NPM_VERSION=$(npm --version 2>/dev/null || echo "unknown")
    if [[ "$NPM_VERSION" != "unknown" ]]; then
        echo -e "${GREEN}✅ 检测到 npm: $NPM_VERSION${NC}"
    else
        echo -e "${RED}❌ 无法获取 npm 版本信息${NC}"
        exit 1
    fi
}

install_npm

# 3. 检查并安装 PM2
install_pm2() {
    if ! command -v pm2 &> /dev/null 2>&1; then
        echo -e "${YELLOW}⬇️  正在全局安装 PM2...${NC}"
        npm install -g pm2
        
        # 验证安装
        if command -v pm2 &> /dev/null 2>&1; then
            echo -e "${GREEN}✅ PM2 安装成功${NC}"
        else
            # 如果还是找不到，可能需要添加到 PATH
            if [ -d "$HOME/.npm-global/bin" ]; then
                export PATH="$HOME/.npm-global/bin:$PATH"
                if command -v pm2 &> /dev/null 2>&1; then
                    echo -e "${GREEN}✅ PM2 安装成功（已添加到 PATH）${NC}"
                else
                    echo -e "${RED}❌ PM2 安装失败${NC}"
                    exit 1
                fi
            else
                echo -e "${RED}❌ PM2 安装失败${NC}"
                exit 1
            fi
        fi
    else
        echo -e "${GREEN}✅ PM2 已安装${NC}"
    fi
}

install_pm2

# 4. 安装后端依赖
echo -e "${YELLOW}📦 安装后端依赖...${NC}"
if [ -d "backend" ]; then
    cd backend
    if npm install --production; then
        echo -e "${GREEN}✅ 后端依赖安装成功${NC}"
    else
        echo -e "${RED}❌ 后端依赖安装失败${NC}"
        cd ..
        exit 1
    fi
    # 检查并创建 .env
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        echo -e "${YELLOW}⚠️  创建后端 .env 文件...${NC}"
        cp .env.example .env
    fi
    cd ..
else
    echo -e "${RED}❌ backend 目录不存在${NC}"
    exit 1
fi

# 5. 安装前端依赖
echo -e "${YELLOW}📦 安装前端依赖...${NC}"
if [ -d "frontend" ]; then
    cd frontend
    if npm install; then
        echo -e "${GREEN}✅ 前端依赖安装成功${NC}"
    else
        echo -e "${RED}❌ 前端依赖安装失败${NC}"
        cd ..
        exit 1
    fi
    # 检查并创建 .env
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        echo -e "${YELLOW}⚠️  创建前端 .env 文件...${NC}"
        cp .env.example .env
    fi
    cd ..
else
    echo -e "${RED}❌ frontend 目录不存在${NC}"
    exit 1
fi

# 6. 使用 PM2 启动
echo -e "${GREEN}🚀 使用 PM2 启动服务...${NC}"
if [ -f "ecosystem.config.cjs" ]; then
    if pm2 start ecosystem.config.cjs; then
        echo -e "${GREEN}✅ PM2 启动成功${NC}"
    else
        echo -e "${RED}❌ PM2 启动失败${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ ecosystem.config.cjs 文件不存在${NC}"
    exit 1
fi

# 7. 保存 PM2 列表 (确保重启后自动恢复)
echo -e "${YELLOW}💾 保存 PM2 进程列表...${NC}"
if pm2 save; then
    echo -e "${GREEN}✅ PM2 进程列表已保存${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 进程列表保存失败（可能没有权限）${NC}"
fi

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "前端运行在: http://localhost:8080"
echo -e "后端运行在: http://localhost:3000/api"
echo ""
echo -e "常用 PM2 命令:"
echo -e "  pm2 list        # 查看进程状态"
echo -e "  pm2 logs        # 查看日志"
echo -e "  pm2 stop all    # 停止所有服务"
echo -e "  pm2 restart all # 重启所有服务"
echo -e "  pm2 delete all  # 删除所有进程"
