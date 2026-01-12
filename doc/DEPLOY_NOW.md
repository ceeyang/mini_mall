# 🚀 立即部署指南

按照以下步骤快速部署你的 Mini Mall 网站！

## 方式一：Vercel 部署（推荐，最简单）

### 步骤 1: 检查代码状态

你的项目已经在 Git 仓库中。现在需要推送到 GitHub。

### 步骤 2: 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`mini_mall`（或你喜欢的名称）
3. **不要**勾选任何初始化选项（README、.gitignore、license）
4. 点击 "Create repository"

### 步骤 3: 推送代码到 GitHub

在终端执行以下命令（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
cd /Users/cee/Desktop/github/mini_mall

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/mini_mall.git

# 如果已经有远程仓库，先移除再添加
# git remote remove origin
# git remote add origin https://github.com/YOUR_USERNAME/mini_mall.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**如果遇到认证问题**：
- 使用 Personal Access Token 代替密码
- 或者使用 SSH：`git@github.com:YOUR_USERNAME/mini_mall.git`

### 步骤 4: 部署到 Vercel

1. **访问 Vercel**：https://vercel.com
2. **登录**：使用 GitHub 账号登录（推荐）
3. **导入项目**：
   - 点击 "Add New Project" 或 "Import Project"
   - 选择你的 `mini_mall` 仓库
   - 点击 "Import"
4. **配置项目**（通常无需修改）：
   - Framework Preset: **Other** 或 **Other (No Framework)**
   - Root Directory: `./`（留空或填写 `./`）
   - Build Command: **留空**（静态站点无需构建）
   - Output Directory: **留空**
   - Install Command: **留空**
5. **部署**：
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟
6. **完成**：
   - 部署完成后，你会看到你的网站链接
   - 格式：`https://mini-mall-xxxxx.vercel.app`
   - 网站已自动配置 HTTPS！

### 步骤 5: 配置自定义域名（可选）

1. 在 Vercel 项目页面，点击 "Settings" → "Domains"
2. 输入你的域名（如 `www.yourdomain.com`）
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

---

## 方式二：Netlify 部署

### 步骤 1-3: 同 Vercel（推送到 GitHub）

### 步骤 4: 部署到 Netlify

1. **访问 Netlify**：https://www.netlify.com
2. **登录**：使用 GitHub 账号登录
3. **导入项目**：
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "GitHub"
   - 授权 Netlify 访问你的 GitHub
   - 选择 `mini_mall` 仓库
4. **配置构建设置**：
   - Branch to deploy: `main`
   - Build command: **留空**
   - Publish directory: `.`
5. **部署**：
   - 点击 "Deploy site"
   - 等待部署完成
6. **完成**：
   - 获得网站链接：`https://mini-mall-xxxxx.netlify.app`

---

## 方式三：GitHub Pages 部署

### 步骤 1-3: 推送到 GitHub（同上）

### 步骤 4: 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings"
2. 在左侧菜单找到 "Pages"
3. 配置：
   - Source: 选择 "Deploy from a branch"
   - Branch: 选择 `main`
   - Folder: 选择 `/ (root)`
4. 点击 "Save"
5. 等待几分钟，访问：`https://YOUR_USERNAME.github.io/mini_mall/`

---

## 🔍 部署前检查清单

- [ ] 所有文件已提交到 Git
- [ ] 代码已推送到 GitHub
- [ ] 本地测试通过（可选但推荐）

### 本地测试

在部署前，建议先在本地测试：

```bash
# 方法 1: 使用 Python
cd /Users/cee/Desktop/github/mini_mall
python3 -m http.server 8000
# 然后访问 http://localhost:8000

# 方法 2: 使用 serve
npm install
npm run dev
# 然后访问 http://localhost:3000
```

---

## ⚠️ 常见问题

### Q: 推送代码时提示认证失败？

**A:** 使用 Personal Access Token：
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 生成新 token，勾选 `repo` 权限
3. 使用 token 代替密码

### Q: 部署后页面空白？

**A:** 检查：
1. 浏览器控制台是否有错误（F12）
2. 确保所有文件路径正确（使用相对路径）
3. 检查网络连接，确保可以访问 Tailwind CDN

### Q: 样式丢失？

**A:** 
1. 检查 Tailwind CDN 是否可以访问
2. 查看浏览器控制台网络请求
3. 考虑使用本地 Tailwind CSS 文件

### Q: ES6 模块不工作？

**A:** 确保：
1. 通过 HTTP 服务器访问（不能直接打开 HTML 文件）
2. 所有导入路径使用相对路径
3. 文件扩展名正确（`.js`）

---

## 📞 需要帮助？

- 查看 `doc/DEPLOYMENT.md` 获取详细步骤
- 查看 `README.md` 了解项目结构
- 提交 GitHub Issue 获取支持

---

**祝部署顺利！** 🎉
