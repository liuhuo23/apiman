# API Manager

基于 Tauri + Vue 3 + Element Plus 构建的轻量级 API 管理桌面应用。

## 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| 桌面框架 | Tauri | 2.x |
| 前端框架 | Vue | 3.4+ |
| 构建工具 | Vite | 5.x |
| UI 组件库 | Element Plus | 2.x |
| 状态管理 | Pinia | 2.x |
| 路由 | Vue Router | 4.x |
| 后端语言 | Rust | 1.77+ |
| 数据库 | SQLite | - |

## 功能特性

- [x] 项目管理（创建、编辑、删除）
- [x] API 文档管理（CRUD）
- [x] 支持 GET/POST/PUT/DELETE/PATCH 方法
- [x] 请求参数配置（Headers、Params、Body）
- [x] 响应参数配置（成功/错误响应）
- [ ] API 请求测试（开发中）
- [ ] 数据导入/导出（规划中）

## 项目结构

```
.
├── src/                      # Vue 前端源码
│   ├── api/                  # 数据库 API 封装
│   ├── components/           # Vue 组件
│   │   ├── common/           # 通用组件
│   │   └── layout/           # 布局组件
│   ├── router/               # 路由配置
│   ├── stores/               # Pinia 状态管理
│   │   ├── api.ts           # API 状态
│   │   └── project.ts       # 项目状态
│   ├── types/                # TypeScript 类型定义
│   ├── views/                # 页面视图
│   │   ├── ProjectView.vue  # 项目列表
│   │   ├── ApiListView.vue  # API 列表
│   │   └── ApiDetailView.vue# API 详情
│   ├── App.vue
│   └── main.ts
├── src-tauri/                # Tauri Rust 后端
│   ├── src/
│   │   ├── lib.rs           # 数据库迁移
│   │   └── main.rs          # 入口
│   ├── capabilities/         # Tauri 权限配置
│   └── tauri.conf.json
└── dist/                     # 构建输出目录
```

## 快速开始

### 环境要求

- Node.js >= 18
- Rust >= 1.77
- pnpm / npm / yarn

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# 前端开发模式（无 Tauri）
npm run dev

# Tauri 开发模式（需要系统依赖）
npm run tauri:dev

# 构建前端
npm run build

# 构建 Tauri 应用
npm run tauri:build
```

### Tauri 系统依赖

Tauri 需要以下系统依赖才能构建：

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

**macOS (Intel):**
```bash
brew installwebkitgtk
```

**macOS (Apple Silicon):**
```bash
brew installwebkitgtk
```

**Windows:**
需要 Visual Studio Build Tools 和 WebView2 Runtime。

详细安装说明请参考 [Tauri 官方文档](https://v2.tauri.app/start/prerequisites/)。

## 许可证

MIT
