# ZBO Graph

ZBO Graph 是一个桌面知识图谱工具，可以从项目目录、Markdown、Word、PDF 和文件夹结构中提取层级关系，生成可交互的知识图谱。

## 当前能力

- 导入 `.txt`、`.md`、`.markdown`、`.docx`、`.pdf`
- 导入本地文件夹结构
- 生成三种图谱布局：横向树、居中发散、关系网络
- 节点拖拽、注释、重点标记、新增子节点
- 撤销图谱编辑和拖拽操作
- 导出 TXT 文档和 PNG 图片
- Electron 桌面应用入口

## 本地运行

```bash
npm install
npm start
```

## 打包桌面应用

```bash
npm run dist
```

打包结果会输出到 `dist/` 目录。

## GitHub 记录

首次上传 GitHub 时：

```bash
git add .
git commit -m "Initial ZBO Graph desktop app"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```
