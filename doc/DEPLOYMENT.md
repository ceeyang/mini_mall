# 部署详细步骤文档

本文档提供 Mini Mall 独立站的详细部署步骤，适合不同技术水平的用户。

## 📋 部署前准备清单

在开始部署之前，请确保：

- [ ] 已安装 Git（用于版本控制）
- [ ] 已注册 GitHub 账号（用于代码托管）
- [ ] 已准备好部署平台账号（Vercel/Netlify 等）
- [ ] 已准备好域名（可选，用于自定义域名）

## 🚀 部署方案对比

| 方案 | 难度 | 速度 | 免费额度 | 推荐度 |
|------|------|------|----------|--------|
| Vercel | ⭐ 简单 | ⚡ 极快 | 充足 | ⭐⭐⭐⭐⭐ |
| Netlify | ⭐ 简单 | ⚡ 极快 | 充足 | ⭐⭐⭐⭐⭐ |
| GitHub Pages | ⭐⭐ 中等 | ⚡ 快 | 完全免费 | ⭐⭐⭐⭐ |
| 传统服务器 | ⭐⭐⭐⭐ 困难 | 🐌 慢 | 需付费 | ⭐⭐⭐ |

## 方案一：Vercel 部署（推荐）

### 为什么选择 Vercel？

- ✅ 部署速度最快（1-2 分钟）
- ✅ 自动 HTTPS 证书
- ✅ 全球 CDN 加速
- ✅ 免费额度充足
- ✅ 与 GitHub 无缝集成
- ✅ 自动部署（代码推送后自动更新）

### 详细步骤

#### 步骤 1: 准备代码仓库

1. **打开终端，进入项目目录**：
```bash
cd /Users/cee/Desktop/github/mini_mall
```

2. **检查 Git 状态**：
```bash
git status
```

3. **如果还没有初始化 Git，执行**：
```bash
git init
git add .
git commit -m "Initial commit: Mini Mall独立站"
```

4. **在 GitHub 创建新仓库**：
   - 访问 https://github.com/new
   - 仓库名称：`mini_mall`（或自定义）
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
   - 点击 "Create repository"

5. **连接本地仓库到 GitHub**：
```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/mini_mall.git
git branch -M main
git push -u origin main
```

**如果遇到认证问题**：
- 使用 Personal Access Token 代替密码
- 或使用 SSH：`git@github.com:YOUR_USERNAME/mini_mall.git`

#### 步骤 2: 部署到 Vercel

**方式 A: 通过网站部署（最简单）**

1. **访问 Vercel**：
   - 打开 https://vercel.com
   - 点击 "Sign Up" 或 "Log In"

2. **选择登录方式**：
   - 推荐使用 GitHub 账号登录（一键授权）

3. **导入项目**：
   - 登录后，点击 "Add New Project"
   - 在 "Import Git Repository" 中找到你的 `mini_mall` 仓库
   - 点击 "Import"

4. **配置项目**：
   - **Framework Preset**: 选择 "Other" 或 "Other (No Framework)"
   - **Root Directory**: 留空或填写 `./`
   - **Build Command**: 留空（静态站点无需构建）
   - **Output Directory**: 留空
   - **Install Command**: 留空

5. **环境变量**（本项目无需配置）：
   - 跳过此步骤

6. **部署**：
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟，Vercel 会自动：
     - 克隆你的代码
     - 检测项目类型
     - 部署到全球 CDN

7. **获取网站链接**：
   - 部署完成后，你会看到：
     - 生产环境链接：`https://mini-mall-xxxxx.vercel.app`
     - 预览链接（每次推送代码都会生成新的预览）

8. **访问网站**：
   - 点击链接即可访问你的网站
   - 网站已自动配置 HTTPS

**方式 B: 通过 CLI 部署**

1. **安装 Vercel CLI**：
```bash
npm install -g vercel
```

2. **登录 Vercel**：
```bash
vercel login
```
   - 会打开浏览器进行授权

3. **部署项目**：
```bash
cd /Users/cee/Desktop/github/mini_mall
vercel
```

4. **回答配置问题**：
```
? Set up and deploy "~/Desktop/github/mini_mall"? [Y/n] y
? Which scope do you want to deploy to? [选择你的账号]
? Link to existing project? [y/N] n
? What's your project's name? mini-mall
? In which directory is your code located? ./
```

5. **生产环境部署**：
```bash
vercel --prod
```

#### 步骤 3: 配置自定义域名（可选）

1. **在 Vercel 项目页面**：
   - 点击项目进入详情页
   - 点击 "Settings" → "Domains"

2. **添加域名**：
   - 输入你的域名（如 `www.yourdomain.com`）
   - 点击 "Add"

3. **配置 DNS**：
   - Vercel 会显示需要添加的 DNS 记录
   - 通常需要添加 CNAME 记录：
     ```
     类型: CNAME
     名称: www
     值: cname.vercel-dns.com
     ```
   - 或 A 记录（根域名）：
     ```
     类型: A
     名称: @
     值: 76.76.21.21
     ```

4. **等待 DNS 生效**：
   - 通常需要几分钟到几小时
   - 可以在 Vercel 页面查看状态

5. **SSL 证书**：
   - Vercel 会自动为你的域名配置 SSL 证书
   - 无需手动操作

#### 步骤 4: 自动部署设置

Vercel 默认已启用自动部署：

- **每次推送到 main 分支** → 自动部署到生产环境
- **每次推送到其他分支** → 创建预览部署

无需额外配置！

### 验证部署

1. **访问网站**：打开你的 Vercel 链接
2. **检查功能**：
   - [ ] 页面正常加载
   - [ ] 导航链接工作正常
   - [ ] 商品卡片显示正常
   - [ ] 表单可以提交
   - [ ] 移动端响应式正常

### 常见问题

**Q: 部署后显示 404？**
A: 检查 `vercel.json` 配置是否正确，确保路由配置正确。

**Q: 样式丢失？**
A: 检查网络连接，确保可以访问 Tailwind CDN。考虑使用本地 Tailwind 文件。

**Q: 如何回滚到之前的版本？**
A: 在 Vercel 项目页面 → Deployments → 选择之前的版本 → "Promote to Production"

## 方案二：Netlify 部署

### 详细步骤

#### 步骤 1: 准备代码仓库

同 Vercel 方案步骤 1。

#### 步骤 2: 部署到 Netlify

1. **访问 Netlify**：
   - 打开 https://www.netlify.com
   - 使用 GitHub 账号登录

2. **导入项目**：
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "GitHub"
   - 授权 Netlify 访问你的 GitHub
   - 选择 `mini_mall` 仓库

3. **配置构建设置**：
   - **Branch to deploy**: `main`
   - **Build command**: 留空
   - **Publish directory**: `.`

4. **部署**：
   - 点击 "Deploy site"
   - 等待部署完成

5. **获取网站链接**：
   - 格式：`https://mini-mall-xxxxx.netlify.app`

#### 步骤 3: 配置自定义域名

1. **在 Netlify 项目页面**：
   - 点击 "Domain settings"
   - 点击 "Add custom domain"

2. **添加域名并配置 DNS**：
   - 按照 Netlify 提示配置 DNS 记录
   - Netlify 会自动配置 SSL

## 方案三：GitHub Pages 部署

### 详细步骤

#### 步骤 1: 准备仓库

确保代码已推送到 GitHub（同 Vercel 步骤 1）。

#### 步骤 2: 启用 GitHub Pages

1. **进入仓库设置**：
   - 在 GitHub 仓库页面
   - 点击 "Settings"（设置）

2. **找到 Pages 选项**：
   - 在左侧菜单找到 "Pages"
   - 或在设置页面搜索 "Pages"

3. **配置源**：
   - **Source**: 选择 "Deploy from a branch"
   - **Branch**: 选择 `main`（或 `master`）
   - **Folder**: 选择 `/ (root)`

4. **保存**：
   - 点击 "Save"
   - 等待几分钟

5. **获取链接**：
   - 格式：`https://YOUR_USERNAME.github.io/mini_mall/`
   - 在仓库设置页面可以看到链接

**注意**：GitHub Pages 使用 Jekyll，如果遇到问题，可以添加 `.nojekyll` 文件：
```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll for GitHub Pages"
git push
```

## 📝 部署后检查清单

部署完成后，请检查以下项目：

### 功能检查

- [ ] 网站可以正常访问
- [ ] 所有页面链接正常工作
- [ ] 导航栏功能正常
- [ ] 商品卡片显示正常
- [ ] 联系表单可以提交（前端验证）
- [ ] 移动端响应式正常
- [ ] 页面加载速度正常

### 技术检查

- [ ] HTTPS 证书正常（自动配置）
- [ ] 控制台无错误（F12 打开开发者工具）
- [ ] 网络请求正常（检查 Network 标签）
- [ ] 移动端测试通过
- [ ] 不同浏览器测试通过（Chrome、Firefox、Safari）

### SEO 检查

- [ ] 页面标题正确
- [ ] Meta 描述正确
- [ ] 图片有 alt 属性
- [ ] 链接有正确的文本

## 🔄 更新网站

### 更新内容

1. **修改代码**：
```bash
# 编辑 index.html 或其他文件
# ...

# 提交更改
git add .
git commit -m "更新网站内容"
git push
```

2. **自动部署**：
   - Vercel/Netlify：自动检测推送并部署
   - GitHub Pages：可能需要等待几分钟

3. **验证更新**：
   - 访问网站查看更新
   - 清除浏览器缓存（Ctrl+Shift+R 或 Cmd+Shift+R）

## 🛠️ 故障排除

### 问题 1: 部署失败

**可能原因**：
- 配置文件错误
- 代码语法错误
- 网络问题

**解决方法**：
1. 检查部署日志
2. 本地测试代码是否正常
3. 检查配置文件格式

### 问题 2: 样式丢失

**可能原因**：
- Tailwind CDN 无法访问
- 网络问题

**解决方法**：
1. 检查浏览器控制台错误
2. 考虑使用本地 Tailwind CSS
3. 使用其他 CDN（如 unpkg.com）

### 问题 3: 页面空白

**可能原因**：
- 路由配置错误
- 文件路径错误

**解决方法**：
1. 检查 `vercel.json` 或 `netlify.toml` 配置
2. 确保 `index.html` 在根目录
3. 检查文件路径是否正确

## 📞 获取帮助

如果遇到问题：

1. **查看部署平台文档**：
   - Vercel: https://vercel.com/docs
   - Netlify: https://docs.netlify.com
   - GitHub Pages: https://docs.github.com/pages

2. **检查项目 README.md**：
   - 查看常见问题部分

3. **提交 Issue**：
   - 在 GitHub 仓库提交 Issue 描述问题

---

**部署愉快！** 🎉
