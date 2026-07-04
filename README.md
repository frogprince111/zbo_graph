# ZBO Graph

ZBO Graph 是一个桌面知识图谱工具，可以从项目目录、Markdown、Word、PDF 和文件夹结构中提取层级关系，生成可交互的知识图谱。

## 功能

- 导入 `.txt`、`.md`、`.markdown`、`.docx`、`.pdf`
- 导入本地文件夹结构
- 生成三种图谱布局：横向树、居中发散、关系网络
- 节点拖拽、注释、重点标记、新增子节点
- 撤销图谱编辑和拖拽操作
- 导出 TXT 文档和 PNG 图片
- 支持 Electron 桌面应用运行

## 方式一：直接打开网页版

适合临时体验或不想安装桌面应用的用户。

1. 下载或解压项目文件夹。
2. 双击打开 `index.html`。
3. 在左侧点击“导入”，选择文件或文件夹生成图谱。

说明：网页版可以使用大部分功能，但“打开保存位置”等桌面能力会受浏览器限制。

## 方式二：本地启动桌面应用

适合开发、调试或自己长期使用。

### 1. 安装 Node.js

建议使用 Node.js 20 或更高版本。

检查 Node.js：

```bash
node -v
npm -v
```

### 2. 进入项目目录

```bash
cd /Users/zbo/Documents/知识图谱
```

如果是从 GitHub 克隆：

```bash
git clone git@github.com:frogprince111/zbo_graph.git
cd zbo_graph
```

### 3. 安装依赖

```bash
npm install
```

如果 Electron 下载较慢，可以换镜像后再安装：

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install
```

### 4. 启动桌面应用

```bash
npm start
```

启动后会打开 ZBO Graph 桌面窗口。

## 方式三：打包后发给别人使用

适合把工具发给普通用户。

### 1. 打包

```bash
npm run dist
```

打包结果会生成到：

```bash
dist/
```

macOS 下一般会生成 `.dmg`、`.zip` 或 `.app` 相关文件。把生成的安装包发给别人即可。

### 2. 对方如何打开

如果 macOS 提示“无法打开，因为无法验证开发者”：

1. 右键点击 APP。
2. 选择“打开”。
3. 在弹窗里再次点击“打开”。

## 方式四：部署到 Render 固定网站

适合让别人通过浏览器直接访问，不需要安装桌面应用。

本项目已经提供 `render.yaml`，可以作为 Render Static Site 部署。

### 1. 确认代码已推送到 GitHub

```bash
git status
git push
```

GitHub 仓库地址：

```text
https://github.com/frogprince111/zbo_graph
```

### 2. 在 Render 新建静态网站

1. 打开 Render 控制台。
2. 选择 New。
3. 选择 Static Site 或 Blueprint。
4. 连接 GitHub 仓库 `frogprince111/zbo_graph`。
5. 如果选择 Static Site，参数填写：
   - Build Command：留空
   - Publish Directory：`.`
6. 如果选择 Blueprint，Render 会读取 `render.yaml`。
7. 点击 Deploy。

### 3. 访问网站

部署成功后，Render 会生成一个固定网址，通常类似：

```text
https://zbo-graph.onrender.com
```

实际网址以 Render 控制台显示为准。

说明：Render 网站版适合浏览器访问和轻量使用；桌面专属能力，比如直接打开系统下载目录，会受浏览器限制。

## Electron 常见问题

### Electron 安装不完整

如果启动时报：

```text
Electron failed to install correctly
```

可以重新安装：

```bash
rm -rf node_modules/electron
npm install electron@31.7.7 --save-dev
```

如果网络下载不稳定：

```bash
rm -rf node_modules/electron
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install electron@31.7.7 --save-dev
```

### macOS 签名或权限问题

如果 Electron 无法启动，可以尝试：

```bash
xattr -cr node_modules/electron/dist/Electron.app
codesign --force --deep --sign - node_modules/electron/dist/Electron.app
npm start
```

## GitHub 上传流程

首次上传：

```bash
git add .
git commit -m "Initial ZBO Graph desktop app"
git branch -M main
git remote add origin git@github.com:frogprince111/zbo_graph.git
git push -u origin main
```

后续更新：

```bash
git add .
git commit -m "Update ZBO Graph"
git push
```

## 项目结构

```text
.
├── index.html          # 页面结构
├── styles.css          # 页面样式
├── app.js              # 图谱逻辑、解析、导入导出
├── main.js             # Electron 主进程
├── preload.js          # Electron 安全桥接
├── package.json        # npm / Electron 配置
├── package-lock.json   # 依赖锁定
├── render.yaml         # Render 静态网站部署配置
└── assets/             # 图标资源
```
