const demoTree = `llm_customer_service_B_wiki/
├── atguigu_ai/                    # 核心框架
│   ├── __init__.py
│   ├── __main__.py                # CLI入口
│   ├── agent/                     # Agent模块
│   │   ├── agent.py               # Agent主类
│   │   ├── actions.py             # 动作系统
│   │   ├── message_processor.py   # 消息处理器
│   │   └── graph/                 # LangGraph编排
│   │       ├── builder.py         # 图构建器
│   │       ├── state.py           # 状态定义
│   │       ├── edges.py           # 条件边
│   │       └── nodes/             # 节点实现
│   │           ├── understand.py  # 理解节点
│   │           ├── policy.py      # 策略节点
│   │           ├── action.py      # 动作节点
│   │           ├── guard.py       # 保护节点
│   │           └── response.py    # 响应节点
│   ├── core/                      # 核心模块
│   │   ├── tracker.py             # 对话状态追踪器
│   │   ├── domain.py              # 领域定义
│   │   ├── slots.py               # 槽位系统
│   │   └── stores/                # 存储实现
│   │       ├── tracker_store.py   # 存储接口
│   │       ├── json_store.py      # JSON存储
│   │       └── mysql_store.py     # MySQL存储
│   ├── dialogue_understanding/    # 对话理解模块
│   │   ├── commands/              # 命令系统
│   │   │   ├── base.py            # 命令基类
│   │   │   ├── flow_commands.py   # Flow命令
│   │   │   ├── slot_commands.py   # 槽位命令
│   │   │   ├── answer_commands.py # 回答命令
│   │   │   └── session_commands.py# 会话命令
│   │   ├── generator/             # 命令生成
│   │   │   ├── llm_generator.py   # LLM生成器
│   │   │   ├── prompt_builder.py  # Prompt构建
│   │   │   └── command_parser.py  # 命令解析
│   │   ├── processor/             # 命令处理
│   │   │   └── command_processor.py
│   │   ├── stack/                 # 对话栈
│   │   │   ├── dialogue_stack.py  # 栈实现
│   │   │   └── stack_frame.py     # 栈帧定义
│   │   └── flow/                  # Flow系统
│   │       ├── flow.py            # Flow定义
│   │       ├── flow_loader.py     # Flow加载
│   │       └── flow_executor.py   # Flow执行
│   ├── policies/                  # 策略模块
│   │   ├── base_policy.py         # 策略基类
│   │   ├── flow_policy.py         # Flow策略
│   │   ├── enterprise_search_policy.py  # 搜索策略
│   │   └── policy_ensemble.py     # 策略集成
│   ├── nlg/                       # 自然语言生成
│   │   ├── nlg_generator.py       # NLG基类
│   │   ├── template_nlg.py        # 模板NLG
│   │   └── response_rephraser.py  # 响应重述
│   ├── channels/                  # 通道模块
│   │   ├── base_channel.py        # 通道基类
│   │   ├── rest_channel.py        # REST通道
│   │   ├── socketio_channel.py    # WebSocket通道
│   │   └── console_channel.py     # 控制台通道
│   ├── retrieval/                 # 检索模块
│   │   ├── base_retriever.py      # 检索器基类
│   │   ├── embedder.py            # 向量嵌入
│   │   └── flow_retriever.py      # Flow检索
│   ├── api/                       # API模块
│   │   └── server.py              # FastAPI服务
│   ├── cli/                       # 命令行工具
│   │   ├── __init__.py            # CLI入口
│   │   ├── init.py                # 初始化命令
│   │   ├── run.py                 # 运行命令
│   │   ├── train.py               # 训练命令
│   │   ├── shell.py               # 交互Shell
│   │   └── inspect.py             # 调试命令
│   ├── training/                  # 训练模块
│   │   ├── trainer.py             # 训练器
│   │   ├── model_storage.py       # 模型存储
│   │   └── finetune/              # 微调
│   └── shared/                    # 共享工具
│       ├── config.py              # 配置管理
│       ├── constants.py           # 常量定义
│       ├── exceptions.py          # 异常定义
│       ├── yaml_loader.py         # YAML加载
│       └── llm/                   # LLM客户端
│           ├── base_client.py     # 客户端基类
│           └── langchain_client.py# LangChain客户端
├── ecs_demo/                      # 电商客服示例
│   ├── config.yml                 # 配置文件
│   ├── endpoints.yml              # 端点配置
│   ├── data/
│   │   └── flows/                 # Flow定义
│   ├── actions/                   # 自定义Action
│   └── addons/                    # 扩展功能
├── docs/                          # 文档目录
├── reference/                     # 参考资料
├── setup.py                       # 安装配置
└── requirements-atguigu.txt       # 依赖列表`;

const catalogKey = "kg-graph-catalog";
const parserVersion = "20260703-document-content-root";
const nodeClickDelay = 320;

const state = {
  root: null,
  query: "",
  panning: null,
  editingNode: null,
  colorMap: loadColorMap(),
  catalog: loadCatalog(),
  activeGraphId: null,
  history: [],
  undoStack: [],
  zoom: 1,
  layoutMode: localStorage.getItem("kg-layout-mode") || "tree",
  networkPhysics: new Map(),
  networkEdges: [],
  networkBounds: null,
  networkFrame: null,
  dragPositions: new Map(),
  renderPositions: new Map(),
  draggingNode: null,
  suppressNodeClick: false,
  nodeClickTimer: null,
  resizingSidebar: false,
  sidebarTogglePress: null,
  suppressSidebarToggleClick: false,
};

const defaultTypeColors = {
  folder: "#c37d2d",
  file: "#6f5e9c",
  py: "#3572a5",
  yml: "#2f855a",
  yaml: "#2f855a",
  txt: "#7b6d4f",
  md: "#4f6f8f",
  js: "#b7791f",
  json: "#805ad5",
  html: "#d65f3a",
  css: "#197278",
};

const generatedColors = [
  "#3572a5",
  "#2f855a",
  "#805ad5",
  "#b7791f",
  "#d65f3a",
  "#197278",
  "#9f4f6f",
  "#4f6f8f",
  "#7b6d4f",
  "#5b6c8f",
];

const els = {
  shell: document.querySelector(".app-shell"),
  splitter: document.querySelector("#splitter"),
  sidebarToggle: document.querySelector("#sidebarToggle"),
  input: document.querySelector("#treeInput"),
  graph: document.querySelector("#graph"),
  viewport: document.querySelector("#graphViewport"),
  layoutMode: document.querySelector("#layoutMode"),
  title: document.querySelector("#graphTitle"),
  search: document.querySelector("#searchInput"),
  nodeCount: document.querySelector("#nodeCount"),
  dirCount: document.querySelector("#dirCount"),
  fileCount: document.querySelector("#fileCount"),
  openImportDialog: document.querySelector("#openImportDialog"),
  importDialog: document.querySelector("#importDialog"),
  fileInput: document.querySelector("#fileInput"),
  folderInput: document.querySelector("#folderInput"),
  openExportDialog: document.querySelector("#openExportDialog"),
  openSaveLocation: document.querySelector("#openSaveLocation"),
  exportDialog: document.querySelector("#exportDialog"),
  exportText: document.querySelector("#exportText"),
  exportImage: document.querySelector("#exportImage"),
  catalogList: document.querySelector("#catalogList"),
  backGraph: document.querySelector("#backGraph"),
  closeGraph: document.querySelector("#closeGraph"),
  emptyState: document.querySelector("#emptyState"),
  colorList: document.querySelector("#colorList"),
  resetColors: document.querySelector("#resetColors"),
  noteDialog: document.querySelector("#noteDialog"),
  childDialog: document.querySelector("#childDialog"),
  noteTitle: document.querySelector("#noteTitle"),
  noteInput: document.querySelector("#noteInput"),
  childNameInput: document.querySelector("#childNameInput"),
  importantToggle: document.querySelector("#importantToggle"),
  addChildButton: document.querySelector("#addChildButton"),
  saveNodeButton: document.querySelector("#saveNodeButton"),
  clearNote: document.querySelector("#clearNote"),
};

const savedSidebarWidth = parseFloat(localStorage.getItem("kg-sidebar-width"));
if (savedSidebarWidth) {
  setSidebarWidth(savedSidebarWidth);
}

if (localStorage.getItem("kg-sidebar-collapsed") === "true") {
  setSidebarCollapsed(true);
}

updateLayoutButton();

function makeNode(name, note = "", type = "folder") {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name: cleanName(name),
    note: note.trim(),
    type,
    fileType: type === "file" ? fileTypeFromName(name) : "folder",
    children: [],
    collapsed: false,
    important: false,
  };
}

function makeId(prefix = "id") {
  return crypto.randomUUID ? crypto.randomUUID() : `${prefix}-${Date.now()}-${Math.random()}`;
}

function cleanName(value) {
  return value.trim().replace(/\/$/, "") || "未命名";
}

function fileTypeFromName(name) {
  const clean = cleanName(name).toLowerCase();
  const parts = clean.split(".");
  if (parts.length <= 1 || clean.startsWith(".") && parts.length === 2) return "file";
  return parts[parts.length - 1] || "file";
}

function parseTreeText(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const stack = [];
  let root = null;

  for (const rawLine of lines) {
    const parsed = parseLine(rawLine);
    if (!parsed) continue;

    const node = makeNode(parsed.name, parsed.note, parsed.isDir ? "folder" : "file");

    if (parsed.depth === 0 || !root) {
      root = node;
      stack.length = 0;
      stack[0] = node;
      continue;
    }

    const parent = stack[parsed.depth - 1] || stack[stack.length - 1] || root;
    parent.children.push(node);
    parent.type = "folder";
    stack[parsed.depth] = node;
    stack.length = parsed.depth + 1;
  }

  return root || makeNode("空图谱");
}

function parseMarkdownText(text, fileName = "Markdown文档") {
  const lines = text.split(/\r?\n/);
  const root = makeNode(fileName.replace(/\.(md|markdown)$/i, "") || "Markdown文档", "", "folder");
  const stack = [root];
  let inFence = false;
  let hasHeading = false;

  lines.forEach((line) => {
    if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!heading) {
      const current = stack[stack.length - 1];
      appendNodeNote(current === root ? null : current, cleanMarkdownText(line));
      return;
    }

    hasHeading = true;
    const level = heading[1].length;
    const title = cleanMarkdownText(heading[2]);
    if (!title) return;

    const parent = nearestParent(stack, level);
    const node = makeNode(title, "", "folder");
    node.markdownLevel = level;
    parent.children.push(node);
    stack[level] = node;
    stack.length = level + 1;
  });

  if (hasHeading && root.children.length) return normalizeDocumentRoot(root);
  return parseMarkdownListText(text, fileName);
}

function parseMarkdownListText(text, fileName = "Markdown文档") {
  const lines = text.split(/\r?\n/);
  const root = makeNode(fileName.replace(/\.(md|markdown)$/i, "") || "Markdown文档", "", "folder");
  const stack = [root];
  let hasList = false;

  lines.forEach((line) => {
    const item = line.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.+)$/);
    if (!item) return;

    hasList = true;
    const level = Math.floor(item[1].replace(/\t/g, "    ").length / 2) + 1;
    const title = cleanMarkdownText(item[2]);
    if (!title) return;

    const parent = nearestParent(stack, level);
    const node = makeNode(title, "", "folder");
    parent.children.push(node);
    stack[level] = node;
    stack.length = level + 1;
  });

  return hasList && root.children.length ? normalizeDocumentRoot(root) : parseTreeText(text);
}

function normalizeDocumentRoot(root) {
  if (root.children.length !== 1) return root;
  const onlyChild = root.children[0];
  if (onlyChild.markdownLevel && onlyChild.markdownLevel !== 1) return root;
  return onlyChild;
}

function appendNodeNote(node, text) {
  const clean = String(text || "").trim();
  if (!node || !clean) return;
  node.note = node.note ? `${node.note}\n${clean}` : clean;
}

function cleanMarkdownText(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

function looksLikeMarkdown(text) {
  return /(^|\n)#{1,6}\s+\S/.test(text) || /(^|\n)\s*(?:[-*+]|\d+[.)])\s+\S/.test(text);
}

async function parseDocxFile(file) {
  const buffer = await file.arrayBuffer();
  const xml = await readDocxEntry(buffer, "word/document.xml");
  if (!xml) {
    throw new Error("未找到 Word 正文内容");
  }
  const stylesXml = await readDocxEntry(buffer, "word/styles.xml");
  const styleLevelMap = stylesXml ? parseDocxStyleLevels(stylesXml) : new Map();

  const documentXml = new DOMParser().parseFromString(xml, "application/xml");
  const paragraphs = [...documentXml.getElementsByTagName("w:p")];
  const root = makeNode(file.name.replace(/\.docx$/i, "") || "Word文档", "", "folder");
  const stack = [root];
  const contentParagraphs = [];
  const seenHeadings = new Set();

  paragraphs.forEach((paragraph) => {
    const rawText = paragraphText(paragraph);
    const text = cleanDocxHeadingText(rawText);
    const content = cleanDocxContentText(rawText);
    if (!text && !content) return;
    const level = headingLevelFromParagraph(paragraph, text, styleLevelMap);
    contentParagraphs.push({ text: content || text, level });
    if (!level) {
      appendNodeNote(stack[stack.length - 1] === root ? null : stack[stack.length - 1], content);
      return;
    }
    const key = `${level}:${text}`;
    if (seenHeadings.has(key)) return;
    seenHeadings.add(key);

    const parent = nearestParent(stack, level);
    const node = makeNode(text, "", "folder");
    parent.children.push(node);
    stack[level] = node;
    stack.length = level + 1;
  });

  if (!root.children.length) {
    buildFallbackDocxTree(root, contentParagraphs);
  }

  return root;
}

async function parsePdfFile(file) {
  const buffer = await file.arrayBuffer();
  const text = await extractPdfText(new Uint8Array(buffer));
  if (!text.trim()) {
    throw new Error("未读取到 PDF 文本内容，可能是扫描版图片 PDF 或加密 PDF");
  }
  return parseDocumentPlainText(text, file.name.replace(/\.pdf$/i, "") || "PDF文档", "PDF");
}

function parseDocumentPlainText(text, title, source = "文档") {
  const root = makeNode(title, "", "folder");
  const stack = [root];
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  let hasHeading = false;

  lines.forEach((line, index) => {
    const level = levelFromNumberedHeading(line) || plainTextHeadingLevel(line, index);
    if (!level) {
      appendNodeNote(stack[stack.length - 1] === root ? null : stack[stack.length - 1], line);
      return;
    }

    hasHeading = true;
    const parent = nearestParent(stack, level);
    const node = makeNode(line, "", "folder");
    parent.children.push(node);
    stack[level] = node;
    stack.length = level + 1;
  });

  if (!hasHeading || !root.children.length) {
    root.children.push(makeNode("未识别到目录层级", `已从 ${source} 提取文本，但未识别到标题编号。`, "folder"));
  }

  return normalizeDocumentRoot(root);
}

function plainTextHeadingLevel(text, index) {
  if (index === 0 && text.length <= 60) return 1;
  if (/^(摘要|目录|引言|前言|结论|参考文献|附录)$/u.test(text)) return 1;
  if (/^第\s*[一二三四五六七八九十百千万\d]+\s*[章节篇]/u.test(text)) return 1;
  if (text.length <= 28 && !/[，。；：、,.!?！？]$/.test(text)) return 2;
  return 0;
}

async function extractPdfText(bytes) {
  const latin = new TextDecoder("latin1").decode(bytes);
  const chunks = [];
  const streamPattern = /(<<[\s\S]*?>>)\s*stream\r?\n?([\s\S]*?)\r?\n?endstream/g;
  let match;

  while ((match = streamPattern.exec(latin))) {
    const dict = match[1];
    const streamBytes = latinStringToBytes(match[2]);
    let content = "";
    try {
      if (/\/FlateDecode\b/.test(dict)) {
        content = await inflatePdfStreamToText(streamBytes);
      } else {
        content = new TextDecoder("latin1").decode(streamBytes);
      }
    } catch {
      content = "";
    }
    const text = extractPdfTextOperators(content);
    if (text.trim()) chunks.push(text);
  }

  if (!chunks.length) {
    chunks.push(extractPdfTextOperators(latin));
  }

  return normalizePdfText(chunks.join("\n"));
}

function latinStringToBytes(text) {
  const bytes = new Uint8Array(text.length);
  for (let index = 0; index < text.length; index += 1) {
    bytes[index] = text.charCodeAt(index) & 0xff;
  }
  return bytes;
}

async function inflatePdfStreamToText(data) {
  if ("DecompressionStream" in window) {
    try {
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate"));
      const inflated = await new Response(stream).arrayBuffer();
      return new TextDecoder("latin1").decode(inflated);
    } catch {
      const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      const inflated = await new Response(stream).arrayBuffer();
      return new TextDecoder("latin1").decode(inflated);
    }
  }

  const raw = data[0] === 0x78 ? data.slice(2, -4) : data;
  return new TextDecoder("latin1").decode(inflateRaw(raw));
}

function extractPdfTextOperators(content) {
  const lines = [];
  const textBlockPattern = /BT([\s\S]*?)ET/g;
  let blockMatch;

  while ((blockMatch = textBlockPattern.exec(content))) {
    const block = blockMatch[1];
    const parts = [];
    const stringPattern = /(\((?:\\.|[^\\)])*\)|<[0-9a-fA-F\s]+>)/g;
    let stringMatch;
    while ((stringMatch = stringPattern.exec(block))) {
      parts.push(decodePdfString(stringMatch[1]));
    }
    if (parts.length) lines.push(parts.join(" "));
  }

  return lines.join("\n");
}

function decodePdfString(value) {
  if (value.startsWith("<")) {
    const hex = value.replace(/[<>\s]/g, "");
    const bytes = [];
    for (let index = 0; index < hex.length; index += 2) {
      bytes.push(parseInt(hex.slice(index, index + 2), 16));
    }
    if (bytes[0] === 0xfe && bytes[1] === 0xff) {
      const chars = [];
      for (let index = 2; index < bytes.length; index += 2) {
        chars.push(String.fromCharCode((bytes[index] << 8) | (bytes[index + 1] || 0)));
      }
      return chars.join("");
    }
    if (bytes.length > 2 && bytes.filter((byte, index) => index % 2 === 0 && byte === 0).length > bytes.length / 4) {
      const chars = [];
      for (let index = 0; index < bytes.length; index += 2) {
        chars.push(String.fromCharCode((bytes[index] << 8) | (bytes[index + 1] || 0)));
      }
      return chars.join("");
    }
    return new TextDecoder("latin1").decode(new Uint8Array(bytes));
  }

  return value
    .slice(1, -1)
    .replace(/\\([nrtbf()\\])/g, (_, char) => ({
      n: "\n",
      r: "\r",
      t: "\t",
      b: "\b",
      f: "\f",
      "(": "(",
      ")": ")",
      "\\": "\\",
    })[char] || char)
    .replace(/\\(\d{1,3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)));
}

function normalizePdfText(text) {
  return text
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildFallbackDocxTree(root, paragraphs) {
  const stack = [root];
  const seen = new Set();
  paragraphs.forEach(({ text }, index) => {
    if (seen.has(text)) return;
    const level = levelFromNumberedHeading(text) || fallbackParagraphLevel(text, index);
    if (!levelFromNumberedHeading(text) && stack.length > 1) {
      appendNodeNote(stack[stack.length - 1], text);
      return;
    }
    seen.add(text);
    const parent = nearestParent(stack, level);
    const node = makeNode(text, "", "folder");
    parent.children.push(node);
    stack[level] = node;
    stack.length = level + 1;
  });

  if (!root.children.length) {
    root.children.push(
      makeNode(
        "未读取到 Word 正文内容",
        "请确认文档不是扫描图片、受保护文档，或删除左侧旧记录后重新上传",
        "folder",
      ),
    );
  }
}

function fallbackParagraphLevel(text, index) {
  if (index === 0) return 1;
  if (text.length <= 40) return 2;
  return 3;
}

function parseDocxStyleLevels(stylesXml) {
  const xml = new DOMParser().parseFromString(stylesXml, "application/xml");
  const map = new Map();
  const styles = [
    ...xml.getElementsByTagName("w:style"),
    ...xml.getElementsByTagName("style"),
  ];

  styles.forEach((style) => {
    const styleId = style.getAttribute("w:styleId") || style.getAttribute("styleId");
    if (!styleId) return;

    const styleNameNode = style.getElementsByTagName("w:name")[0]
      || style.getElementsByTagName("name")[0];
    const styleName = styleNameNode?.getAttribute("w:val") || styleNameNode?.getAttribute("val") || "";
    const outlineNode = style.getElementsByTagName("w:outlineLvl")[0]
      || style.getElementsByTagName("outlineLvl")[0];
    const outline = outlineNode?.getAttribute("w:val") || outlineNode?.getAttribute("val");

    const level = levelFromStyleName(normalizeStyleName(styleId))
      || levelFromStyleName(normalizeStyleName(styleName))
      || (/^\d+$/.test(outline || "") ? Number(outline) + 1 : 0)
      || numberingLevelFromNode(style);
    if (level) map.set(styleId, level);
  });

  return map;
}

function nearestParent(stack, level) {
  for (let index = level - 1; index >= 0; index -= 1) {
    if (stack[index]) return stack[index];
  }
  return stack[0];
}

async function readDocxEntry(buffer, entryName) {
  const bytes = new Uint8Array(buffer);
  const eocdOffset = findEndOfCentralDirectory(bytes);
  if (eocdOffset < 0) throw new Error("DOCX 文件结构不完整");

  const entries = readUint16(bytes, eocdOffset + 10);
  let offset = readUint32(bytes, eocdOffset + 16);

  for (let index = 0; index < entries; index += 1) {
    if (readUint32(bytes, offset) !== 0x02014b50) break;

    const method = readUint16(bytes, offset + 10);
    const compressedSize = readUint32(bytes, offset + 20);
    const uncompressedSize = readUint32(bytes, offset + 24);
    const nameLength = readUint16(bytes, offset + 28);
    const extraLength = readUint16(bytes, offset + 30);
    const commentLength = readUint16(bytes, offset + 32);
    const localHeaderOffset = readUint32(bytes, offset + 42);
    const nameStart = offset + 46;
    const nameEnd = nameStart + nameLength;
    const name = new TextDecoder().decode(bytes.slice(nameStart, nameEnd));

    if (name === entryName) {
      const localNameLength = readUint16(bytes, localHeaderOffset + 26);
      const localExtraLength = readUint16(bytes, localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const dataEnd = dataStart + compressedSize;
      const data = bytes.slice(dataStart, dataEnd);
      if (method === 0) return new TextDecoder("utf-8").decode(data);
      if (method === 8) return inflateRawToText(data, uncompressedSize);
      throw new Error(`暂不支持的 DOCX 压缩方式：${method}`);
    }

    offset = nameEnd + extraLength + commentLength;
  }

  return "";
}

function findEndOfCentralDirectory(bytes) {
  for (let offset = bytes.length - 22; offset >= 0; offset -= 1) {
    if (readUint32(bytes, offset) === 0x06054b50) return offset;
  }
  return -1;
}

async function inflateRawToText(data, expectedSize) {
  if ("DecompressionStream" in window) {
    const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const inflated = await new Response(stream).arrayBuffer();
    return new TextDecoder("utf-8").decode(inflated);
  }

  const inflated = inflateRaw(data);
  if (expectedSize && inflated.length !== expectedSize) {
    return new TextDecoder("utf-8").decode(inflated);
  }
  return new TextDecoder("utf-8").decode(inflated);
}

function inflateRaw(data) {
  const reader = new BitReader(data);
  const output = [];
  let finalBlock = false;

  while (!finalBlock) {
    finalBlock = reader.readBits(1) === 1;
    const type = reader.readBits(2);

    if (type === 0) {
      reader.alignByte();
      const length = reader.readByte() | (reader.readByte() << 8);
      reader.readByte();
      reader.readByte();
      for (let index = 0; index < length; index += 1) output.push(reader.readByte());
      continue;
    }

    if (type === 1 || type === 2) {
      const tables = type === 1 ? fixedHuffmanTables() : dynamicHuffmanTables(reader);
      inflateHuffmanBlock(reader, output, tables.literalLength, tables.distance);
      continue;
    }

    throw new Error("DOCX 压缩数据格式不受支持");
  }

  return new Uint8Array(output);
}

class BitReader {
  constructor(data) {
    this.data = data;
    this.index = 0;
    this.bitBuffer = 0;
    this.bitLength = 0;
  }

  readBits(count) {
    while (this.bitLength < count) {
      this.bitBuffer |= this.readByte() << this.bitLength;
      this.bitLength += 8;
    }
    const value = this.bitBuffer & ((1 << count) - 1);
    this.bitBuffer >>= count;
    this.bitLength -= count;
    return value;
  }

  readByte() {
    if (this.index >= this.data.length) throw new Error("DOCX 压缩数据不完整");
    return this.data[this.index++];
  }

  alignByte() {
    this.bitBuffer = 0;
    this.bitLength = 0;
  }
}

function fixedHuffmanTables() {
  const literalLengths = [];
  for (let symbol = 0; symbol <= 287; symbol += 1) {
    literalLengths[symbol] = symbol <= 143 ? 8 : symbol <= 255 ? 9 : symbol <= 279 ? 7 : 8;
  }
  return {
    literalLength: buildHuffman(literalLengths),
    distance: buildHuffman(Array(32).fill(5)),
  };
}

function dynamicHuffmanTables(reader) {
  const literalCount = reader.readBits(5) + 257;
  const distanceCount = reader.readBits(5) + 1;
  const codeLengthCount = reader.readBits(4) + 4;
  const order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  const codeLengths = Array(19).fill(0);
  for (let index = 0; index < codeLengthCount; index += 1) {
    codeLengths[order[index]] = reader.readBits(3);
  }

  const codeTable = buildHuffman(codeLengths);
  const lengths = [];
  while (lengths.length < literalCount + distanceCount) {
    const symbol = decodeSymbol(reader, codeTable);
    if (symbol <= 15) {
      lengths.push(symbol);
    } else if (symbol === 16) {
      const repeat = reader.readBits(2) + 3;
      const previous = lengths[lengths.length - 1] || 0;
      for (let index = 0; index < repeat; index += 1) lengths.push(previous);
    } else if (symbol === 17) {
      const repeat = reader.readBits(3) + 3;
      for (let index = 0; index < repeat; index += 1) lengths.push(0);
    } else if (symbol === 18) {
      const repeat = reader.readBits(7) + 11;
      for (let index = 0; index < repeat; index += 1) lengths.push(0);
    }
  }

  return {
    literalLength: buildHuffman(lengths.slice(0, literalCount)),
    distance: buildHuffman(lengths.slice(literalCount)),
  };
}

function buildHuffman(lengths) {
  const maxBits = Math.max(...lengths);
  const counts = Array(maxBits + 1).fill(0);
  lengths.forEach((length) => {
    if (length) counts[length] += 1;
  });

  const nextCode = Array(maxBits + 1).fill(0);
  let code = 0;
  for (let bits = 1; bits <= maxBits; bits += 1) {
    code = (code + (counts[bits - 1] || 0)) << 1;
    nextCode[bits] = code;
  }

  const table = Array.from({ length: maxBits + 1 }, () => ({}));
  lengths.forEach((length, symbol) => {
    if (!length) return;
    const reversed = reverseBits(nextCode[length], length);
    table[length][reversed] = symbol;
    nextCode[length] += 1;
  });

  return { maxBits, table };
}

function reverseBits(value, length) {
  let result = 0;
  for (let index = 0; index < length; index += 1) {
    result = (result << 1) | (value & 1);
    value >>= 1;
  }
  return result;
}

function decodeSymbol(reader, huffman) {
  let code = 0;
  for (let length = 1; length <= huffman.maxBits; length += 1) {
    code |= reader.readBits(1) << (length - 1);
    const symbol = huffman.table[length][code];
    if (symbol !== undefined) return symbol;
  }
  throw new Error("DOCX 压缩数据无法解码");
}

function inflateHuffmanBlock(reader, output, literalTable, distanceTable) {
  const lengthBase = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  const lengthExtra = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  const distanceBase = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  const distanceExtra = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];

  while (true) {
    const symbol = decodeSymbol(reader, literalTable);
    if (symbol < 256) {
      output.push(symbol);
      continue;
    }
    if (symbol === 256) return;

    const lengthIndex = symbol - 257;
    const length = lengthBase[lengthIndex] + reader.readBits(lengthExtra[lengthIndex]);
    const distanceSymbol = decodeSymbol(reader, distanceTable);
    const distance = distanceBase[distanceSymbol] + reader.readBits(distanceExtra[distanceSymbol]);
    const start = output.length - distance;
    if (start < 0) throw new Error("DOCX 压缩数据引用无效");
    for (let index = 0; index < length; index += 1) {
      output.push(output[start + index]);
    }
  }
}

function headingLevelFromParagraph(paragraph, text = "", styleLevelMap = new Map()) {
  const paragraphNumberLevel = numberingLevelFromNode(paragraph);
  if (paragraphNumberLevel) return paragraphNumberLevel;

  const styleNode = paragraph.getElementsByTagName("w:pStyle")[0]
    || paragraph.getElementsByTagName("pStyle")[0];
  const style = styleNode?.getAttribute("w:val") || styleNode?.getAttribute("val") || "";
  if (styleLevelMap.has(style)) return styleLevelMap.get(style);

  const normalized = normalizeStyleName(style);
  const styleLevel = levelFromStyleName(normalized);
  if (styleLevel) return styleLevel;

  const outlineNode = paragraph.getElementsByTagName("w:outlineLvl")[0]
    || paragraph.getElementsByTagName("outlineLvl")[0];
  const outline = outlineNode?.getAttribute("w:val") || outlineNode?.getAttribute("val");
  if (/^\d+$/.test(outline || "")) return Number(outline) + 1;

  return levelFromNumberedHeading(text);
}

function numberingLevelFromNode(node) {
  const ilvlNode = node.getElementsByTagName("w:ilvl")[0]
    || node.getElementsByTagName("ilvl")[0];
  const ilvl = ilvlNode?.getAttribute("w:val") || ilvlNode?.getAttribute("val");
  if (/^\d+$/.test(ilvl || "")) return Number(ilvl) + 1;
  return 0;
}

function levelFromStyleName(style) {
  const tocMatch = style.match(/^(toc|目录)(\d+)$/);
  if (tocMatch) return Number(tocMatch[2]);

  const headingMatch = style.match(/^(heading|title|标题)(\d+)$/);
  if (headingMatch) return Number(headingMatch[2]);

  if (/^标题[一二三四五六七八九]$/.test(style)) {
    return chineseNumberToInt(style.slice(2));
  }

  return 0;
}

function normalizeStyleName(style) {
  return String(style || "")
    .replace(/\s+/g, "")
    .replace(/[._-]+/g, "")
    .toLowerCase();
}

function levelFromNumberedHeading(text) {
  const normalized = text.trim();
  if (/^第\s*[一二三四五六七八九十百千万\d]+\s*[章节篇]/.test(normalized)) return 1;

  const dotted = normalized.match(/^(\d+(?:\.\d+)+)\.?(?=\D|$)/);
  if (dotted) return dotted[1].split(".").length;

  const section = normalized.match(/^(\d+)[\.、]\s*\S+/);
  if (section) return 1;

  return 0;
}

function chineseNumberToInt(value) {
  const map = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };
  return map[value] || 0;
}

function cleanDocxHeadingText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/^HYPERLINK\s+\\l\s+".*?"\s*/i, "")
    .replace(/[\t ]+\d+\s*$/u, "")
    .replace(/[.·•…\s]{2,}\d+\s*$/u, "")
    .trim();
}

function cleanDocxContentText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function paragraphText(paragraph) {
  const parts = [];
  collectParagraphText(paragraph, parts);
  return parts.join("").trim();
}

function collectParagraphText(node, parts) {
  [...node.childNodes].forEach((child) => {
    const name = child.nodeName.toLowerCase();
    if (name === "w:t" || name === "t") {
      parts.push(child.textContent);
      return;
    }
    if (name === "w:tab" || name === "tab") {
      parts.push("\t");
      return;
    }
    collectParagraphText(child, parts);
  });
}

function readUint16(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUint32(bytes, offset) {
  return (
    bytes[offset]
    | (bytes[offset + 1] << 8)
    | (bytes[offset + 2] << 16)
    | (bytes[offset + 3] << 24)
  ) >>> 0;
}

function parseLine(line) {
  const withoutComment = splitComment(line);
  const branchIndex = withoutComment.body.search(/[├└]\s*──/);
  let depth = 0;
  let label = withoutComment.body;

  if (branchIndex >= 0) {
    const prefix = withoutComment.body.slice(0, branchIndex);
    depth = Math.floor(prefix.length / 4) + 1;
    label = withoutComment.body.slice(branchIndex).replace(/^[├└]\s*──\s*/, "");
  } else {
    const leadingSpaces = line.match(/^\s*/)[0].length;
    depth = Math.floor(leadingSpaces / 2);
    label = withoutComment.body.trim();
  }

  label = label.trim();
  if (!label || /^[│\s]+$/.test(label)) return null;

  const isDir = /\/$/.test(label) || !/\.[a-z0-9]+$/i.test(label);
  return {
    depth,
    name: label,
    note: withoutComment.comment,
    isDir,
  };
}

function splitComment(line) {
  const index = line.indexOf("#");
  if (index === -1) return { body: line, comment: "" };
  return {
    body: line.slice(0, index).trimEnd(),
    comment: line.slice(index + 1),
  };
}

function buildFromFileList(files) {
  const rootName = inferRootName(files);
  const root = makeNode(rootName, "从上传文件夹生成", "folder");

  for (const file of files) {
    const path = file.webkitRelativePath || file.name;
    const parts = path.split("/").filter(Boolean);
    const normalized = parts[0] === rootName ? parts.slice(1) : parts;
    insertPath(root, normalized, file.size);
  }

  sortTree(root);
  return root;
}

function inferRootName(files) {
  const first = files[0];
  if (!first) return "上传文件夹";
  const path = first.webkitRelativePath || first.name;
  return path.split("/").filter(Boolean)[0] || "上传文件夹";
}

function insertPath(root, parts, size) {
  let current = root;
  parts.forEach((part, index) => {
    const isFile = index === parts.length - 1;
    let next = current.children.find((child) => child.name === part);
    if (!next) {
      next = makeNode(part, isFile ? formatSize(size) : "", isFile ? "file" : "folder");
      current.children.push(next);
    }
    current = next;
  });
}

function sortTree(node) {
  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, "zh-CN");
  });
  node.children.forEach(sortTree);
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function visibleTree(node, depth = 0, rows = [], parent = null) {
  rows.push({ node, depth, parent });
  if (!node.collapsed) {
    node.children.forEach((child) => visibleTree(child, depth + 1, rows, node));
  }
  return rows;
}

function render() {
  const root = state.root;
  if (!root) {
    renderEmptyGraph();
    return;
  }

  const rows = visibleTree(root);
  const rowHeight = 48;
  const colWidth = 210;
  const margin = { top: 44, right: 80, bottom: 44, left: 44 };
  const layout = layoutGraph(root, rows, { rowHeight, colWidth, margin });
  const baseWidth = layout.baseWidth;
  const baseHeight = layout.baseHeight;
  const width = Math.round(baseWidth * state.zoom);
  const height = Math.round(baseHeight * state.zoom);
  const positions = layout.positions;
  if (state.layoutMode !== "network") {
    rows.forEach(({ node }) => {
      const saved = state.dragPositions.get(node.id);
      if (saved) positions.set(node.id, { ...saved });
    });
  }
  state.renderPositions = positions;

  els.graph.setAttribute("width", width);
  els.graph.setAttribute("height", height);
  els.graph.setAttribute("viewBox", `0 0 ${baseWidth} ${baseHeight}`);
  els.graph.innerHTML = "";

  const defs = svgEl("defs");
  defs.append(
    svgEl("marker", {
      id: "linkArrow",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerWidth: "6",
      markerHeight: "6",
      orient: "auto",
      markerUnits: "strokeWidth",
    }),
  );
  defs.querySelector("#linkArrow").append(svgEl("path", { d: "M 0 0 L 10 5 L 0 10 z" }));
  const linkLayer = svgEl("g", { class: "links" });
  const nodeLayer = svgEl("g", { class: "nodes" });
  els.graph.append(defs, linkLayer, nodeLayer);

  rows.forEach((row) => {
    if (!row.parent) return;
    const source = positions.get(row.parent.id);
    const target = positions.get(row.node.id);
    linkLayer.append(
      svgEl("path", {
        class: "link",
        "data-source": row.parent.id,
        "data-target": row.node.id,
        "marker-end": "url(#linkArrow)",
        d: linkPath(source, target),
      }),
    );
  });

  rows.forEach((row) => {
    const pos = positions.get(row.node.id);
    const group = svgEl("g", {
      class: nodeClass(row.node, row.depth),
      transform: `translate(${pos.x}, ${pos.y})`,
      tabindex: "0",
      "data-node-id": row.node.id,
    });
    group.addEventListener("mousedown", (event) => startNodeDrag(event, row.node));
    group.addEventListener("click", (event) => {
      if (state.suppressNodeClick) {
        state.suppressNodeClick = false;
        clearTimeout(state.nodeClickTimer);
        state.nodeClickTimer = null;
        return;
      }
      clearTimeout(state.nodeClickTimer);
      if (event.detail > 1) {
        state.nodeClickTimer = null;
        return;
      }
      state.nodeClickTimer = setTimeout(() => {
        state.nodeClickTimer = null;
        toggleNode(row.node);
      }, nodeClickDelay);
    });
    group.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearTimeout(state.nodeClickTimer);
      state.nodeClickTimer = null;
      toggleNodeNote(row.node);
    });
    group.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openNoteEditor(row.node);
    });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleNode(row.node);
      }
    });

    group.append(
      svgEl("circle", {
        r: row.node.children.length ? 11 : 7,
        style: `fill: ${colorForNode(row.node)}`,
      }),
    );
    const textAttrs = nodeTextAttrs(row.node, 4);
    group.append(svgEl("text", textAttrs, row.node.name));

    const meta = metaText(row.node);
    if (meta) {
      group.append(svgEl("text", { ...nodeTextAttrs(row.node, 21), class: "meta" }, meta));
    }
    appendPinnedNote(group, row.node);
    nodeLayer.append(group);
  });

  updateStats(root);
  renderColorControls(root);
  renderCatalog();
  els.emptyState.classList.add("hidden");
  if (state.layoutMode === "network") {
    startNetworkAnimation(rows, positions, baseWidth, baseHeight);
  } else {
    stopNetworkAnimation();
  }
}

function layoutGraph(root, rows, options) {
  if (state.layoutMode === "radial") return centeredLayout(root, rows, options);
  if (state.layoutMode === "network") return networkLayout(root, rows, options);
  return treeLayout(root, rows, options);
}

function treeLayout(root, rows, { rowHeight, colWidth, margin }) {
  const positions = new Map();
  const baseWidth = Math.max(
    els.viewport.clientWidth,
    margin.left + margin.right + (maxDepth(root) + 1) * colWidth,
  );
  const baseHeight = Math.max(
    els.viewport.clientHeight,
    margin.top + margin.bottom + rows.length * rowHeight,
  );

  rows.forEach((row, index) => {
    positions.set(row.node.id, {
      x: margin.left + row.depth * colWidth,
      y: margin.top + index * rowHeight,
    });
  });

  return { baseWidth, baseHeight, positions };
}

function centeredLayout(root, rows, { rowHeight, colWidth, margin }) {
  const positions = new Map();
  const children = root.collapsed ? [] : root.children;
  const branches = [];
  children.forEach((child, index) => {
    collectBranchRows(child, 1, index % 2 === 0 ? -1 : 1, branches);
  });

  const upper = branches.filter((row) => row.side === -1);
  const lower = branches.filter((row) => row.side === 1);
  const upperHeight = Math.max(1, upper.length) * rowHeight;
  const lowerHeight = Math.max(1, lower.length) * rowHeight;
  const centerY = margin.top + upperHeight + rowHeight;
  const baseHeight = Math.max(
    els.viewport.clientHeight,
    margin.top + margin.bottom + upperHeight + lowerHeight + rowHeight * 2,
  );
  const baseWidth = Math.max(
    els.viewport.clientWidth,
    margin.left + margin.right + (maxDepth(root) + 1) * colWidth,
  );
  const centerX = margin.left + 30;

  positions.set(root.id, { x: centerX, y: centerY });
  placeBranchRows(upper, positions, centerX, centerY, colWidth, rowHeight, -1);
  placeBranchRows(lower, positions, centerX, centerY, colWidth, rowHeight, 1);

  rows.forEach(({ node }) => {
    if (!positions.has(node.id)) positions.set(node.id, { x: centerX, y: centerY });
  });

  return { baseWidth, baseHeight, positions };
}

function collectBranchRows(node, depth, side, rows) {
  rows.push({ node, depth, side });
  if (!node.collapsed) {
    node.children.forEach((child) => collectBranchRows(child, depth + 1, side, rows));
  }
}

function placeBranchRows(rows, positions, centerX, centerY, colWidth, rowHeight, side) {
  rows.forEach((row, index) => {
    const offset = (index + 1) * rowHeight * side;
    positions.set(row.node.id, {
      x: centerX + row.depth * colWidth,
      y: centerY + offset,
    });
  });
}

function networkLayout(root, rows, { margin }) {
  const positions = new Map();
  const maxDepthValue = maxDepth(root);
  const ringGap = 230;
  const baseWidth = Math.max(
    els.viewport.clientWidth,
    margin.left + margin.right + Math.max(980, maxDepthValue * ringGap * 2 + 360),
  );
  const baseHeight = Math.max(
    els.viewport.clientHeight,
    margin.top + margin.bottom + Math.max(720, rows.length * 58),
  );
  const centerX = baseWidth / 2;
  const centerY = baseHeight / 2;

  positions.set(root.id, { x: centerX, y: centerY });
  if (!root.collapsed && root.children.length) {
    placeNetworkChildren(root, positions, centerX, centerY, 0, -Math.PI / 2, Math.PI * 1.5, ringGap);
  }

  rows.forEach(({ node }) => {
    if (!positions.has(node.id)) positions.set(node.id, { x: centerX, y: centerY });
  });

  return { baseWidth, baseHeight, positions };
}

function placeNetworkChildren(parent, positions, parentX, parentY, depth, startAngle, endAngle, ringGap) {
  const children = parent.children.filter((child) => visibleTree(child).length || child);
  if (!children.length || parent.collapsed) return;

  const span = endAngle - startAngle;
  const radius = depth === 0 ? ringGap : Math.max(140, ringGap * 0.78);
  children.forEach((child, index) => {
    const angle = startAngle + span * ((index + 0.5) / children.length);
    const x = parentX + Math.cos(angle) * radius;
    const y = parentY + Math.sin(angle) * radius;
    positions.set(child.id, { x, y });

    if (!child.collapsed && child.children.length) {
      const childSpan = Math.max(Math.PI / 8, span / Math.max(children.length, 2));
      placeNetworkChildren(
        child,
        positions,
        x,
        y,
        depth + 1,
        angle - childSpan / 2,
        angle + childSpan / 2,
        ringGap,
      );
    }
  });
}

function startNetworkAnimation(rows, positions, baseWidth, baseHeight) {
  const visibleIds = new Set(rows.map(({ node }) => node.id));
  for (const id of state.networkPhysics.keys()) {
    if (!visibleIds.has(id)) state.networkPhysics.delete(id);
  }

  rows.forEach(({ node }) => {
    const pos = positions.get(node.id);
    if (!pos) return;
    if (!state.networkPhysics.has(node.id)) {
      state.networkPhysics.set(node.id, {
        id: node.id,
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      });
      return;
    }

    const current = state.networkPhysics.get(node.id);
    current.x = Number.isFinite(current.x) ? current.x : pos.x;
    current.y = Number.isFinite(current.y) ? current.y : pos.y;
  });

  state.networkEdges = rows
    .filter(({ parent }) => parent)
    .map(({ node, parent }) => ({ source: parent.id, target: node.id }));
  state.networkBounds = { width: baseWidth, height: baseHeight, padding: 80 };

  if (!state.networkFrame) {
    state.networkFrame = requestAnimationFrame(networkTick);
  }
}

function stopNetworkAnimation() {
  if (state.networkFrame) {
    cancelAnimationFrame(state.networkFrame);
    state.networkFrame = null;
  }
}

function networkTick() {
  state.networkFrame = null;
  if (state.layoutMode !== "network" || !state.root || !state.networkBounds) return;

  const nodes = [...state.networkPhysics.values()];
  const bounds = state.networkBounds;
  const minDistance = 190;
  const repulsion = 0.035;
  const spring = 0.006;
  const desiredLink = 220;

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let distance = Math.hypot(dx, dy) || 0.01;
      if (distance >= minDistance) continue;

      const force = (minDistance - distance) * repulsion;
      dx /= distance;
      dy /= distance;
      a.vx -= dx * force;
      a.vy -= dy * force;
      b.vx += dx * force;
      b.vy += dy * force;
    }
  }

  state.networkEdges.forEach(({ source, target }) => {
    const a = state.networkPhysics.get(source);
    const b = state.networkPhysics.get(target);
    if (!a || !b) return;

    let dx = b.x - a.x;
    let dy = b.y - a.y;
    const distance = Math.hypot(dx, dy) || 0.01;
    const force = (distance - desiredLink) * spring;
    dx /= distance;
    dy /= distance;
    a.vx += dx * force;
    a.vy += dy * force;
    b.vx -= dx * force;
    b.vy -= dy * force;
  });

  nodes.forEach((node) => {
    node.vx += (Math.random() - 0.5) * 0.018;
    node.vy += (Math.random() - 0.5) * 0.018;
    node.vx *= 0.88;
    node.vy *= 0.88;
    node.x += node.vx;
    node.y += node.vy;
    bounceNode(node, bounds);
  });

  updateNetworkDom();
  state.networkFrame = requestAnimationFrame(networkTick);
}

function bounceNode(node, bounds) {
  const p = bounds.padding;
  if (node.x < p) {
    node.x = p;
    node.vx = Math.abs(node.vx) + 0.25;
  } else if (node.x > bounds.width - p) {
    node.x = bounds.width - p;
    node.vx = -Math.abs(node.vx) - 0.25;
  }

  if (node.y < p) {
    node.y = p;
    node.vy = Math.abs(node.vy) + 0.25;
  } else if (node.y > bounds.height - p) {
    node.y = bounds.height - p;
    node.vy = -Math.abs(node.vy) - 0.25;
  }
}

function updateNetworkDom() {
  state.networkPhysics.forEach((node, id) => {
    const group = els.graph.querySelector(`.node[data-node-id="${cssEscape(id)}"]`);
    if (group) group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
  });

  els.graph.querySelectorAll(".link[data-source]").forEach((link) => {
    const source = state.networkPhysics.get(link.getAttribute("data-source"));
    const target = state.networkPhysics.get(link.getAttribute("data-target"));
    if (!source || !target) return;
    link.setAttribute("d", linkPath(source, target));
  });
}

function updateStaticDraggedDom() {
  state.renderPositions.forEach((node, id) => {
    const group = els.graph.querySelector(`.node[data-node-id="${cssEscape(id)}"]`);
    if (group) group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
  });

  els.graph.querySelectorAll(".link[data-source]").forEach((link) => {
    const source = state.renderPositions.get(link.getAttribute("data-source"));
    const target = state.renderPositions.get(link.getAttribute("data-target"));
    if (!source || !target) return;
    link.setAttribute("d", linkPath(source, target));
  });
}

function clampStaticNode(node) {
  const viewBox = els.graph.viewBox.baseVal;
  const padding = 48;
  node.x = clamp(node.x, viewBox.x + padding, viewBox.x + viewBox.width - padding);
  node.y = clamp(node.y, viewBox.y + padding, viewBox.y + viewBox.height - padding);
}

function startNodeDrag(event, node) {
  if (event.button !== 0) return;
  const current = state.layoutMode === "network"
    ? state.networkPhysics.get(node.id)
    : state.renderPositions.get(node.id);
  if (!current) return;

  event.preventDefault();
  event.stopPropagation();
  const point = svgPointFromEvent(event);
  state.draggingNode = {
    id: node.id,
    mode: state.layoutMode,
    offsetX: current.x - point.x,
    offsetY: current.y - point.y,
    moved: false,
    beforeSnapshot: graphSnapshot(),
  };
}

function dragNode(event) {
  if (!state.draggingNode) return;
  event.preventDefault();
  const isNetworkDrag = state.draggingNode.mode === "network";
  const current = isNetworkDrag
    ? state.networkPhysics.get(state.draggingNode.id)
    : state.renderPositions.get(state.draggingNode.id);
  if (!current) return;

  const point = svgPointFromEvent(event);
  current.x = point.x + state.draggingNode.offsetX;
  current.y = point.y + state.draggingNode.offsetY;
  state.draggingNode.moved = true;
  if (isNetworkDrag) {
    current.vx = 0;
    current.vy = 0;
    if (state.networkBounds) bounceNode(current, state.networkBounds);
    updateNetworkDom();
    return;
  }

  clampStaticNode(current);
  state.dragPositions.set(state.draggingNode.id, { x: current.x, y: current.y });
  updateStaticDraggedDom();
}

function stopNodeDrag() {
  if (!state.draggingNode) return;
  if (state.draggingNode.moved) {
    pushUndoSnapshot(state.draggingNode.beforeSnapshot);
  }
  state.suppressNodeClick = state.draggingNode.moved;
  state.draggingNode = null;
}

function svgPointFromEvent(event) {
  const rect = els.graph.getBoundingClientRect();
  const viewBox = els.graph.viewBox.baseVal;
  return {
    x: viewBox.x + ((event.clientX - rect.left) / rect.width) * viewBox.width,
    y: viewBox.y + ((event.clientY - rect.top) / rect.height) * viewBox.height,
  };
}

function toggleNodeNote(node) {
  pushUndoSnapshot();
  if (!node.note) {
    const current = node.noteSide || "hidden";
    node.noteSide = current === "left" ? "right" : "left";
    node.lastNoteSide = node.noteSide;
    saveActiveGraph();
    render();
    return;
  }
  const current = node.noteSide || "hidden";
  if (current === "hidden") {
    node.noteSide = node.lastNoteSide || "right";
    node.noteFlipReady = true;
  } else if (node.noteFlipReady) {
    node.noteSide = current === "right" ? "left" : "right";
    node.lastNoteSide = node.noteSide;
    node.noteFlipReady = false;
  } else {
    node.noteSide = "hidden";
    node.noteFlipReady = true;
  }
  saveActiveGraph();
  render();
}

function appendPinnedNote(group, node) {
  if (!node.note || node.noteSide === "hidden" || !node.noteSide) return;
  const side = node.noteSide === "left" ? -1 : 1;
  const x = side === 1 ? 36 : -36;
  const anchor = side === 1 ? "start" : "end";
  const note = svgEl("g", { class: `pinned-note ${node.noteSide}` });
  note.append(svgEl("text", { x, y: 42, "text-anchor": anchor }, node.note));
  group.append(note);
}

function nodeTextAttrs(node, y) {
  const isLeft = node.noteSide === "left";
  return {
    x: isLeft ? -18 : 18,
    y,
    "text-anchor": isLeft ? "end" : "start",
  };
}

function cssEscape(value) {
  return String(value).replace(/["\\]/g, "\\$&");
}

function renderEmptyGraph() {
  els.graph.innerHTML = "";
  els.graph.removeAttribute("width");
  els.graph.removeAttribute("height");
  els.graph.removeAttribute("viewBox");
  els.title.textContent = "未打开图谱";
  els.nodeCount.textContent = "0";
  els.dirCount.textContent = "0";
  els.fileCount.textContent = "0";
  els.colorList.innerHTML = "";
  els.emptyState.classList.remove("hidden");
  stopNetworkAnimation();
  renderCatalog();
}

function linkPath(source, target) {
  if (state.layoutMode === "network") {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.hypot(dx, dy) || 1;
    const sourceOffset = 14;
    const targetOffset = 16;
    const startX = source.x + (dx / distance) * sourceOffset;
    const startY = source.y + (dy / distance) * sourceOffset;
    const endX = target.x - (dx / distance) * targetOffset;
    const endY = target.y - (dy / distance) * targetOffset;
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.hypot(dx, dy) || 1;
  const startX = source.x + (dx / distance) * 14;
  const startY = source.y + (dy / distance) * 14;
  const endX = target.x - (dx / distance) * 16;
  const endY = target.y - (dy / distance) * 16;
  const mid = (source.x + target.x) / 2;
  return `M ${startX} ${startY} C ${mid} ${startY}, ${mid} ${endY}, ${endX} ${endY}`;
}

function svgEl(tag, attrs = {}, text = "") {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  if (text) el.textContent = text;
  return el;
}

function nodeClass(node, depth = 0) {
  const classes = ["node", node.type];
  if (depth === 0) classes.push("root-node");
  if (node.collapsed && node.children.length) classes.push("collapsed");
  if (node.important) classes.push("important");
  if (state.query && node.name.toLowerCase().includes(state.query)) classes.push("match");
  return classes.join(" ");
}

function metaText(node) {
  if (node.children.length) return `${node.children.length} 个子节点${node.note ? ` · ${node.note}` : ""}`;
  return node.note;
}

function colorForNode(node) {
  const key = node.type === "folder" ? "folder" : node.fileType;
  return state.colorMap[key] || defaultTypeColors[key] || generatedColor(key);
}

function generatedColor(key) {
  let total = 0;
  for (const char of key) total += char.charCodeAt(0);
  return generatedColors[total % generatedColors.length];
}

function loadColorMap() {
  try {
    return JSON.parse(localStorage.getItem("kg-file-type-colors") || "{}");
  } catch {
    return {};
  }
}

function saveColorMap() {
  localStorage.setItem("kg-file-type-colors", JSON.stringify(state.colorMap));
}

function fileTypesInTree(root) {
  const types = new Map();
  flatten(root).forEach((node) => {
    const key = node.type === "folder" ? "folder" : node.fileType;
    const count = types.get(key) || 0;
    types.set(key, count + 1);
  });
  return [...types.entries()].sort(([a], [b]) => {
    if (a === "folder") return -1;
    if (b === "folder") return 1;
    return a.localeCompare(b);
  });
}

function renderColorControls(root) {
  els.colorList.innerHTML = "";
  fileTypesInTree(root).forEach(([type, count]) => {
    const row = document.createElement("label");
    row.className = "color-row";
    const input = document.createElement("input");
    input.type = "color";
    input.value = colorForType(type);
    input.addEventListener("input", () => {
      state.colorMap[type] = input.value;
      saveColorMap();
      render();
    });

    const name = document.createElement("strong");
    name.textContent = type === "folder" ? "目录" : `.${type}`;
    const meta = document.createElement("span");
    meta.textContent = `${count} 个`;
    row.append(input, name, meta);
    els.colorList.append(row);
  });
}

function colorForType(type) {
  return state.colorMap[type] || defaultTypeColors[type] || generatedColor(type);
}

function resetColors() {
  state.colorMap = {};
  saveColorMap();
  render();
}

function loadCatalog() {
  try {
    const saved = JSON.parse(localStorage.getItem(catalogKey) || "[]");
    return Array.isArray(saved)
      ? saved.map((item) => ({ ...item, root: prepareNode(item.root) })).filter((item) => item.root)
      : [];
  } catch {
    return [];
  }
}

function saveCatalog() {
  localStorage.setItem(catalogKey, JSON.stringify(state.catalog));
}

function prepareNode(node) {
  if (!node || typeof node !== "object") return null;
  node.id = node.id || makeId("node");
  node.name = cleanName(node.name || "未命名");
  node.children = Array.isArray(node.children) ? node.children.map(prepareNode).filter(Boolean) : [];
  node.type = node.children.length ? "folder" : node.type || "file";
  node.note = typeof node.note === "string" ? node.note : "";
  node.fileType = node.type === "file" ? node.fileType || fileTypeFromName(node.name) : "folder";
  node.collapsed = Boolean(node.collapsed);
  node.important = Boolean(node.important);
  node.noteSide = node.noteSide || "hidden";
  node.lastNoteSide = node.lastNoteSide === "left" ? "left" : "right";
  node.noteFlipReady = typeof node.noteFlipReady === "boolean" ? node.noteFlipReady : true;
  delete node.markdownLevel;
  return node;
}

function addGraphToCatalog(root, options = {}) {
  const preparedRoot = prepareNode(root);
  const now = new Date().toISOString();
  if (state.activeGraphId) {
    state.history.push(state.activeGraphId);
  }
  const item = {
    id: makeId("graph"),
    title: options.title || preparedRoot.name,
    source: options.source || "手动生成",
    inputText: options.inputText || "",
    parserVersion,
    root: preparedRoot,
    createdAt: now,
    updatedAt: now,
  };
  state.catalog.unshift(item);
  state.catalog = state.catalog.slice(0, 30);
  state.activeGraphId = item.id;
  state.root = item.root;
  state.undoStack = [];
  state.dragPositions.clear();
  saveCatalog();
  render();
}

function saveActiveGraph() {
  const item = activeCatalogItem();
  if (!item || !state.root) return;
  item.title = state.root.name;
  item.root = state.root;
  item.inputText = els.input.value;
  item.updatedAt = new Date().toISOString();
  saveCatalog();
  renderCatalog();
}

function activeCatalogItem() {
  return state.catalog.find((item) => item.id === state.activeGraphId) || null;
}

function openCatalogItem(id, trackHistory = true) {
  const item = state.catalog.find((entry) => entry.id === id);
  if (!item) return;
  if (trackHistory && state.activeGraphId && state.activeGraphId !== id) {
    state.history.push(state.activeGraphId);
  }
  state.activeGraphId = item.id;
  state.root = prepareNode(item.root);
  item.root = state.root;
  state.undoStack = [];
  state.dragPositions.clear();
  els.input.value = item.inputText || treeTextFromNode(item.root);
  state.query = "";
  state.zoom = 1;
  els.search.value = "";
  render();
}

function deleteCatalogItem(id) {
  const item = state.catalog.find((entry) => entry.id === id);
  if (!item) return;

  state.catalog = state.catalog.filter((entry) => entry.id !== id);
  state.history = state.history.filter((entryId) => entryId !== id);
  if (state.activeGraphId === id) {
    closeGraph();
  }
  saveCatalog();
  renderCatalog();
}

function renderCatalog() {
  els.catalogList.innerHTML = "";
  if (!state.catalog.length) {
    const empty = document.createElement("div");
    empty.className = "catalog-empty";
    empty.textContent = "上传或预览图谱后会出现在这里";
    els.catalogList.append(empty);
    return;
  }

  state.catalog.forEach((item) => {
    const row = document.createElement("div");
    row.className = `catalog-item${item.id === state.activeGraphId ? " active" : ""}`;

    const openButton = document.createElement("button");
    openButton.className = "catalog-open";
    openButton.type = "button";
    openButton.addEventListener("click", () => openCatalogItem(item.id));

    const title = document.createElement("strong");
    title.textContent = item.title;
    const meta = document.createElement("span");
    meta.textContent = `${item.source} · ${formatDate(item.updatedAt)}`;
    openButton.append(title, meta);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.title = "删除目录记录";
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteCatalogItem(item.id));

    row.append(openButton, deleteButton);
    els.catalogList.append(row);
  });
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function treeTextFromNode(node, depth = 0) {
  const prefix = depth === 0 ? "" : `${"│   ".repeat(Math.max(depth - 1, 0))}├── `;
  const suffix = node.type === "folder" ? "/" : "";
  const note = node.note ? ` # ${node.note}` : "";
  return [
    `${prefix}${node.name}${suffix}${note}`,
    ...node.children.map((child) => treeTextFromNode(child, depth + 1)),
  ].join("\n");
}

function exportGraph(format) {
  if (!state.root) {
    window.alert("请先生成或打开一个图谱");
    return;
  }
  const title = cleanFileName(state.root.name || "知识图谱");
  if (format === "image") {
    exportGraphImage(title);
    return;
  }

  downloadText(`${title}.txt`, textDocumentFromGraph(state.root), "text/plain");
}

function textDocumentFromGraph(root) {
  const lines = [
    root.name,
    "=".repeat(Math.max(6, root.name.length)),
    "",
    `导出时间：${formatDate(new Date().toISOString())}`,
    `节点数量：${flatten(root).length}`,
    "",
  ];
  if (root.note) lines.push("主节点说明：", root.note, "");
  lines.push("知识架构：", ...textLinesFromNode(root, 0));
  return lines.join("\n").trimEnd() + "\n";
}

function textLinesFromNode(node, depth) {
  const indent = "  ".repeat(depth);
  const marker = depth === 0 ? "●" : node.children.length ? "├─" : "└─";
  const important = node.important ? " [重点]" : "";
  const lines = [`${indent}${marker} ${node.name}${important}`];
  if (node.note) {
    node.note.split(/\r?\n/).forEach((line) => {
      if (line.trim()) lines.push(`${indent}   说明：${line.trim()}`);
    });
  }
  node.children.forEach((child) => lines.push(...textLinesFromNode(child, depth + 1)));
  return lines;
}

function exportGraphImage(title) {
  const clone = els.graph.cloneNode(true);
  const viewBox = els.graph.getAttribute("viewBox");
  if (!viewBox) {
    window.alert("当前没有可导出的图谱画面");
    return;
  }
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const [, , widthValue, heightValue] = viewBox.split(/\s+/).map(Number);
  const width = Math.max(1, Math.ceil(widthValue || els.graph.clientWidth || 1200));
  const height = Math.max(1, Math.ceil(heightValue || els.graph.clientHeight || 800));
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
    .link{fill:none;stroke:#bac7bf;stroke-width:1.6}
    #linkArrow path{fill:#9fb0a7}
    .node circle{stroke:white;stroke-width:2.5;filter:none}
    .node.root-node circle{stroke:#0f766e;stroke-width:3}
    .node.important circle{stroke:#f2c94c;stroke-width:5}
    .node text{paint-order:stroke;stroke:rgba(246,247,244,.92);stroke-width:5px;fill:#17211b;font-size:13px;font-weight:680;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .node .meta{fill:#53615a;font-size:12px;font-weight:650}
    .pinned-note text{paint-order:stroke;stroke:rgba(255,255,255,.95);stroke-width:6px;fill:#0f3d3e;font-size:12px;font-weight:750}
  `;
  clone.insertBefore(style, clone.firstChild);

  const source = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#f7f8f4";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      downloadBlob(`${title}.png`, pngBlob);
    }, "image/png");
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    window.alert("图片导出失败，请尝试切换图谱样式后再导出");
  };
  image.src = url;
}

function downloadText(filename, content, mimeType) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  downloadBlob(filename, blob);
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function openSaveLocation() {
  if (window.zboDesktop?.openDownloadsFolder) {
    window.zboDesktop.openDownloadsFolder().then((result) => {
      if (!result?.ok) window.alert("打开下载文件夹失败，请手动查看系统下载目录。");
    });
    return;
  }
  const downloadsPage = window.open("chrome://downloads/", "_blank");
  if (!downloadsPage) {
    window.alert("浏览器限制网页直接打开本地文件夹，请在浏览器下载记录中查看导出的文件。");
  }
}

function cleanFileName(name) {
  return String(name || "知识图谱")
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

function closeGraph() {
  state.root = null;
  state.activeGraphId = null;
  state.undoStack = [];
  state.query = "";
  state.zoom = 1;
  els.search.value = "";
  render();
}

function graphSnapshot() {
  if (!state.root) return null;
  return {
    root: JSON.parse(JSON.stringify(state.root)),
    layoutMode: state.layoutMode,
    dragPositions: [...state.dragPositions.entries()].map(([id, position]) => [
      id,
      { x: position.x, y: position.y },
    ]),
    networkPhysics: [...state.networkPhysics.entries()].map(([id, node]) => [
      id,
      {
        id,
        x: node.x,
        y: node.y,
        vx: node.vx || 0,
        vy: node.vy || 0,
      },
    ]),
  };
}

function pushUndoSnapshot(snapshot = graphSnapshot()) {
  if (!snapshot) return;
  state.undoStack.push(JSON.parse(JSON.stringify(snapshot)));
  if (state.undoStack.length > 50) state.undoStack.shift();
}

function undoGraphOperation() {
  if (!state.root || !state.undoStack.length) return;
  const previous = state.undoStack.pop();
  const previousRoot = previous.root || previous;
  state.root = prepareNode(previousRoot);
  state.layoutMode = previous.layoutMode || state.layoutMode;
  localStorage.setItem("kg-layout-mode", state.layoutMode);
  updateLayoutButton();
  state.dragPositions = new Map((previous.dragPositions || []).map(([id, position]) => [
    id,
    { x: position.x, y: position.y },
  ]));
  state.networkPhysics = new Map((previous.networkPhysics || []).map(([id, node]) => [
    id,
    {
      id,
      x: node.x,
      y: node.y,
      vx: node.vx || 0,
      vy: node.vy || 0,
    },
  ]));
  const item = activeCatalogItem();
  if (item) {
    item.title = state.root.name;
    item.root = state.root;
    item.updatedAt = new Date().toISOString();
    saveCatalog();
  }
  renderCatalog();
  render();
}

function toggleNode(node) {
  if (!node.children.length) return;
  pushUndoSnapshot();
  node.collapsed = !node.collapsed;
  saveActiveGraph();
  render();
}

function maxDepth(node, depth = 0) {
  if (!node.children.length || node.collapsed) return depth;
  return Math.max(...node.children.map((child) => maxDepth(child, depth + 1)));
}

function updateStats(root) {
  const all = flatten(root);
  els.nodeCount.textContent = all.length;
  els.dirCount.textContent = all.filter((node) => node.type === "folder").length;
  els.fileCount.textContent = all.filter((node) => node.type === "file").length;
  els.title.textContent = root.name;
}

function flatten(node) {
  return [node, ...node.children.flatMap(flatten)];
}

function setCollapsed(node, collapsed, includeRoot = false) {
  if (includeRoot || node.children.length) node.collapsed = collapsed;
  node.children.forEach((child) => setCollapsed(child, collapsed, true));
}

function expandOneLevel() {
  if (!state.root) return;
  const before = graphSnapshot();
  const rows = visibleTree(state.root);
  let changed = false;

  rows.forEach(({ node }) => {
    if (node.children.length && node.collapsed) {
      node.collapsed = false;
      changed = true;
    }
  });

  if (!changed) {
    const visibleIds = new Set(rows.map(({ node }) => node.id));
    rows.forEach(({ node }) => {
      node.children.forEach((child) => {
        if (visibleIds.has(child.id) && child.children.length && child.collapsed) {
          child.collapsed = false;
          changed = true;
        }
      });
    });
  }

  if (changed) {
    pushUndoSnapshot(before);
    saveActiveGraph();
    render();
  }
}

function collapseOneLevel() {
  if (!state.root) return;
  const rows = visibleTree(state.root);
  const candidates = rows.filter(
    ({ node, depth }) => depth > 0 && node.children.length && !node.collapsed,
  );
  if (!candidates.length) return;

  pushUndoSnapshot();
  const deepest = Math.max(...candidates.map(({ depth }) => depth));
  candidates
    .filter(({ depth }) => depth === deepest)
    .forEach(({ node }) => {
      node.collapsed = true;
    });
  saveActiveGraph();
  render();
}

function hasCollapsedNode(node) {
  return (node.children.length && node.collapsed) || node.children.some(hasCollapsedNode);
}

function toggleAllLevels() {
  if (!state.root) return;
  const shouldExpand = hasCollapsedNode(state.root);
  pushUndoSnapshot();
  setCollapsed(state.root, !shouldExpand, false);
  state.root.collapsed = false;
  saveActiveGraph();
  render();
}

function openNoteEditor(node) {
  state.editingNode = node;
  els.noteTitle.textContent = "编辑节点";
  els.noteInput.value = node.note || "";
  els.importantToggle.checked = Boolean(node.important);
  els.noteDialog.showModal();
  els.noteInput.focus();
}

function saveNote() {
  if (!state.editingNode) return;
  const node = state.editingNode;
  const nextNote = els.noteInput.value.trim();
  const nextImportant = els.importantToggle.checked;
  if (node.note !== nextNote || Boolean(node.important) !== nextImportant) {
    pushUndoSnapshot();
  }
  node.note = nextNote;
  node.important = nextImportant;
  state.editingNode = null;
  saveActiveGraph();
  render();
}

function addChildNode() {
  if (!state.editingNode) return;
  const childName = els.childNameInput.value.trim();
  if (!childName) return;
  const node = state.editingNode;
  pushUndoSnapshot();
  node.children.push(makeNode(childName, "", "folder"));
  node.type = "folder";
  node.fileType = "folder";
  node.collapsed = false;
  els.childNameInput.value = "";
  saveActiveGraph();
  render();
}

function clearNote() {
  if (!state.editingNode) return;
  els.noteInput.value = "";
}

function applyTree(root, options = {}) {
  root.collapsed = false;
  addGraphToCatalog(root, {
    title: options.title || root.name,
    source: options.source || "手动生成",
    inputText: options.inputText || els.input.value,
  });
}

function readTextFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    els.input.value = String(reader.result || "");
    const isMarkdown = /\.(md|markdown)$/i.test(file.name);
    const root = isMarkdown
      ? parseMarkdownText(els.input.value, file.name)
      : parseTreeText(els.input.value);
    applyTree(root, {
      title: root.name || file.name,
      source: `${isMarkdown ? "Markdown" : "文件"} ${file.name}`,
      inputText: els.input.value,
    });
  };
  reader.readAsText(file, "UTF-8");
}

async function readWordFile(file) {
  try {
    const root = await parseDocxFile(file);
    const inputText = treeTextFromNode(root);
    els.input.value = inputText;
    applyTree(root, {
      title: root.name || file.name,
      source: `Word ${file.name}`,
      inputText,
    });
  } catch (error) {
    window.alert(`Word 解析失败：${error.message}`);
  }
}

async function readPdfFile(file) {
  try {
    const root = await parsePdfFile(file);
    const inputText = treeTextFromNode(root);
    els.input.value = inputText;
    applyTree(root, {
      title: root.name || file.name,
      source: `PDF ${file.name}`,
      inputText,
    });
  } catch (error) {
    window.alert(`PDF 解析失败：${error.message}`);
  }
}

document.querySelector("#loadDemo").addEventListener("click", () => {
  const currentText = els.input.value.trim();
  if (!currentText) {
    window.alert("输入框为空，请先上传文件或粘贴目录结构");
    return;
  }
  const existing = state.catalog.find((item) => (
    item.parserVersion === parserVersion
    && normalizeInputText(item.inputText) === normalizeInputText(currentText)
  ));
  if (existing) {
    openCatalogItem(existing.id);
    return;
  }
  const root = looksLikeMarkdown(currentText)
    ? parseMarkdownText(currentText, "输入框 Markdown")
    : parseTreeText(currentText);
  applyTree(root, {
    title: root.name,
    source: "预览",
    inputText: currentText,
  });
});

function normalizeInputText(text) {
  return String(text || "").replace(/\r\n/g, "\n").trim();
}

els.openImportDialog.addEventListener("click", () => {
  els.importDialog.showModal();
});

els.importDialog.addEventListener("close", () => {
  if (els.importDialog.returnValue === "file") els.fileInput.click();
  if (els.importDialog.returnValue === "folder") els.folderInput.click();
});

els.fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (/\.docx$/i.test(file.name)) {
    readWordFile(file);
  } else if (/\.pdf$/i.test(file.name)) {
    readPdfFile(file);
  } else {
    readTextFile(file);
  }
  event.target.value = "";
});

els.folderInput.addEventListener("change", (event) => {
  const files = [...event.target.files];
  if (files.length) {
    els.input.value = `${inferRootName(files)}/\n${files
      .map((file) => `  ${file.webkitRelativePath || file.name}`)
      .join("\n")}`;
    const root = buildFromFileList(files);
    applyTree(root, {
      title: root.name,
      source: "文件夹上传",
      inputText: els.input.value,
    });
  }
  event.target.value = "";
});

document.querySelector("#expandOne").addEventListener("click", expandOneLevel);

document.querySelector("#collapseOne").addEventListener("click", collapseOneLevel);

document.querySelector("#toggleAll").addEventListener("click", toggleAllLevels);

els.resetColors.addEventListener("click", resetColors);

els.openExportDialog.addEventListener("click", () => {
  if (!state.root) {
    window.alert("请先生成或打开一个图谱");
    return;
  }
  els.exportDialog.showModal();
});

els.openSaveLocation.addEventListener("click", openSaveLocation);

els.exportDialog.addEventListener("close", () => {
  if (els.exportDialog.returnValue === "text") exportGraph("text");
  if (els.exportDialog.returnValue === "image") exportGraph("image");
});

els.backGraph.addEventListener("click", undoGraphOperation);

els.closeGraph.addEventListener("click", closeGraph);

els.noteDialog.addEventListener("close", () => {
  if (els.noteDialog.returnValue === "save" || els.noteDialog.returnValue === "save-node") {
    saveNote();
  }
});

els.addChildButton.addEventListener("click", () => {
  els.childNameInput.value = "";
  els.childDialog.showModal();
  els.childNameInput.focus();
});

els.childDialog.addEventListener("close", () => {
  if (els.childDialog.returnValue === "save-child") addChildNode();
});

els.clearNote.addEventListener("click", clearNote);

els.search.addEventListener("input", (event) => {
  if (!state.root) return;
  state.query = event.target.value.trim().toLowerCase();
  if (state.query) revealMatches(state.root, state.query);
  render();
});

els.layoutMode.addEventListener("click", () => {
  const modes = ["tree", "radial", "network"];
  const nextIndex = (modes.indexOf(state.layoutMode) + 1) % modes.length;
  state.layoutMode = modes[nextIndex];
  state.dragPositions.clear();
  localStorage.setItem("kg-layout-mode", state.layoutMode);
  updateLayoutButton();
  render();
});

function updateLayoutButton() {
  const names = {
    tree: "横向树",
    radial: "居中发散",
    network: "关系网络",
  };
  const current = names[state.layoutMode] || names.tree;
  els.layoutMode.setAttribute("title", `切换图谱样式：当前 ${current}`);
  els.layoutMode.setAttribute("aria-label", `切换图谱样式，当前 ${current}`);
}

function revealMatches(node, query) {
  const ownMatch = node.name.toLowerCase().includes(query);
  const childMatch = node.children.map((child) => revealMatches(child, query)).some(Boolean);
  if (childMatch) node.collapsed = false;
  return ownMatch || childMatch;
}

window.addEventListener("resize", render);

els.sidebarToggle.addEventListener("mousedown", (event) => {
  if (event.button !== 0) return;
  event.stopPropagation();
  event.preventDefault();
  if (els.shell.classList.contains("sidebar-collapsed")) {
    state.sidebarTogglePress = { x: event.clientX, moved: false, collapsedAtStart: true };
    return;
  }
  state.sidebarTogglePress = { x: event.clientX, moved: false, collapsedAtStart: false };
  state.resizingSidebar = true;
  els.shell.classList.add("resizing");
});

els.sidebarToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  if (state.sidebarTogglePress?.moved) {
    state.sidebarTogglePress = null;
    return;
  }
  if (state.suppressSidebarToggleClick) {
    state.suppressSidebarToggleClick = false;
    return;
  }
  setSidebarCollapsed(!els.shell.classList.contains("sidebar-collapsed"));
  state.sidebarTogglePress = null;
});

function setSidebarCollapsed(collapsed) {
  state.resizingSidebar = false;
  state.sidebarTogglePress = null;
  els.shell.classList.toggle("sidebar-collapsed", collapsed);
  els.shell.classList.remove("resizing");
  localStorage.setItem("kg-sidebar-collapsed", String(collapsed));
  els.sidebarToggle.textContent = collapsed ? "›" : "‹";
  els.sidebarToggle.setAttribute("aria-label", collapsed ? "展开左侧栏" : "收起左侧栏");
  els.sidebarToggle.setAttribute("title", collapsed ? "展开左侧栏" : "收起左侧栏");
  requestAnimationFrame(render);
}

els.splitter.addEventListener("mousedown", (event) => {
  if (els.shell.classList.contains("sidebar-collapsed")) return;
  event.preventDefault();
  state.resizingSidebar = true;
  els.shell.classList.add("resizing");
});

window.addEventListener("mousemove", (event) => {
  if (state.draggingNode) {
    dragNode(event);
    return;
  }
  if (!state.resizingSidebar) return;
  if (state.sidebarTogglePress && Math.abs(event.clientX - state.sidebarTogglePress.x) > 3) {
    state.sidebarTogglePress.moved = true;
  }
  if (event.clientX <= 120) {
    state.suppressSidebarToggleClick = true;
    setSidebarCollapsed(true);
    return;
  }
  const width = clamp(event.clientX, 280, Math.min(680, window.innerWidth - 420));
  setSidebarWidth(width);
  render();
});

function stopSidebarResize() {
  if (!state.resizingSidebar) return;
  state.resizingSidebar = false;
  state.sidebarTogglePress = null;
  els.shell.classList.remove("resizing");
  localStorage.setItem("kg-sidebar-width", getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width"));
}

function setSidebarWidth(width) {
  document.documentElement.style.setProperty("--sidebar-width", `${Math.round(width)}px`);
}

els.viewport.addEventListener("contextmenu", (event) => {
  if (!event.target.closest(".node")) event.preventDefault();
});

els.viewport.addEventListener("mousedown", (event) => {
  if (event.button !== 2 || event.target.closest(".node")) return;
  event.preventDefault();
  state.panning = {
    x: event.clientX,
    y: event.clientY,
    left: els.viewport.scrollLeft,
    top: els.viewport.scrollTop,
  };
  els.viewport.classList.add("dragging");
});

window.addEventListener("mousemove", (event) => {
  if (!state.panning) return;
  event.preventDefault();
  els.viewport.scrollLeft = state.panning.left - (event.clientX - state.panning.x);
  els.viewport.scrollTop = state.panning.top - (event.clientY - state.panning.y);
});

function stopPanning() {
  if (!state.panning) return;
  state.panning = null;
  els.viewport.classList.remove("dragging");
}

window.addEventListener("mouseup", stopPanning);
window.addEventListener("mouseup", stopSidebarResize);
window.addEventListener("mouseup", stopNodeDrag);
window.addEventListener("blur", stopPanning);
window.addEventListener("blur", stopSidebarResize);
window.addEventListener("blur", stopNodeDrag);

els.viewport.addEventListener(
  "wheel",
  (event) => {
    if (!event.ctrlKey || !state.root) return;
    event.preventDefault();

    const previousZoom = state.zoom;
    const direction = event.deltaY > 0 ? -1 : 1;
    const nextZoom = clamp(previousZoom + direction * 0.1, 0.5, 2.5);
    if (nextZoom === previousZoom) return;

    const rect = els.viewport.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const contentX = (els.viewport.scrollLeft + pointerX) / previousZoom;
    const contentY = (els.viewport.scrollTop + pointerY) / previousZoom;

    state.zoom = nextZoom;
    render();

    els.viewport.scrollLeft = contentX * nextZoom - pointerX;
    els.viewport.scrollTop = contentY * nextZoom - pointerY;
  },
  { passive: false },
);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Math.round(value * 100) / 100));
}

if (!state.catalog.length) {
  els.input.value = demoTree;
  applyTree(parseTreeText(demoTree), {
    title: "llm_customer_service_B_wiki",
    source: "示例",
    inputText: demoTree,
  });
} else {
  renderCatalog();
  openCatalogItem(state.catalog[0].id, false);
}
