#!/bin/bash

# Mini Mall 部署脚本
# 使用方法: ./deploy.sh

echo "🚀 Mini Mall 部署助手"
echo "===================="
echo ""

# 检查 Git 状态
echo "📋 检查 Git 状态..."
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ 工作区干净，可以部署"
else
    echo "⚠️  检测到未提交的更改"
    read -p "是否先提交所有更改？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "请输入提交信息: " commit_msg
        git commit -m "${commit_msg:-Update project}"
    fi
fi

# 检查远程仓库
echo ""
echo "🔍 检查远程仓库配置..."
if git remote | grep -q "origin"; then
    echo "✅ 已配置远程仓库:"
    git remote -v
    echo ""
    read -p "是否推送到远程仓库？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 推送到远程仓库..."
        git push -u origin main
        echo "✅ 代码已推送到 GitHub"
    fi
else
    echo "⚠️  未配置远程仓库"
    echo ""
    echo "请按照以下步骤操作："
    echo "1. 在 GitHub 创建新仓库: https://github.com/new"
    echo "2. 仓库名称: mini_mall"
    echo "3. 不要勾选任何初始化选项"
    echo "4. 创建后，执行以下命令："
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/mini_mall.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
fi

echo ""
echo "📦 部署选项："
echo "1. Vercel (推荐) - https://vercel.com"
echo "2. Netlify - https://www.netlify.com"
echo "3. GitHub Pages - 在仓库 Settings → Pages 中配置"
echo ""
echo "详细步骤请查看 doc/DEPLOY_NOW.md 文件"
echo ""
echo "✨ 部署完成后，你的网站就可以访问了！"
