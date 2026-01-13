# 快速开始指南

5 分钟快速部署你的独立站！

## 🚀 最快方式：Vercel（推荐）

### 1. 准备代码（2 分钟）

```bash
# 进入项目目录
cd /Users/cee/Desktop/github/mini_mall

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit"
```

**注意**：前端代码在 `frontend/` 目录下。

### 2. 推送到 GitHub（1 分钟）

1. 在 GitHub 创建新仓库：https://github.com/new
2. 仓库名：`mini_mall`
3. 不要勾选任何初始化选项
4. 复制仓库链接

```bash
# 连接并推送（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/mini_mall.git
git branch -M main
git push -u origin main
```

### 3. 部署到 Vercel（2 分钟）

1. 访问：https://vercel.com
2. 使用 GitHub 登录
3. 点击 "Add New Project"
4. 选择 `mini_mall` 仓库
5. 点击 "Deploy"（无需修改任何设置）
6. 等待 1-2 分钟
7. 获得你的网站链接！🎉

**完成！** 你的网站已经上线了！

---

## 📱 本地预览

在部署前，可以先在本地预览：

```bash
# 进入前端目录
cd frontend

# 方法 1: 使用 serve（需要 Node.js）
npm install
npm run dev

# 方法 2: 使用 Python（无需安装）
python3 -m http.server 8000
```

然后访问：http://localhost:8000

---

## 🔄 更新网站

修改代码后：

```bash
git add .
git commit -m "更新内容"
git push
```

Vercel 会自动重新部署！✨

---

## 📚 更多信息

- 详细部署步骤：查看 `doc/DEPLOYMENT.md`
- 项目说明：查看 `README.md`
- 遇到问题：查看文档中的"常见问题"部分

---

**需要帮助？** 查看 `doc/DEPLOYMENT.md` 获取详细步骤！
