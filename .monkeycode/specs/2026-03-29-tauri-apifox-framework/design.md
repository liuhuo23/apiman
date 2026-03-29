# Tauri + Vue API 管理应用技术方案

需求名称：tauri-apifox-framework
更新日期：2026-03-29
状态：已完成

## 1. 概述

### 1.1 项目背景

基于 Tauri 2.x + Vue 3 + Element Plus 构建一款轻量级 API 管理桌面应用，类比 Apifox 的核心功能。第一期专注于 API 接口文档的增删改查和分类管理。

### 1.2 技术选型

| 组件 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 桌面框架 | Tauri | 2.x | 跨平台桌面应用框架 |
| 前端框架 | Vue | 3.4+ | 渐进式 JavaScript 框架 |
| 构建工具 | Vite | 5.x | 快速前端构建工具 |
| UI 组件库 | Element Plus | 2.x | Vue 3 UI 组件库 |
| 状态管理 | Pinia | 2.x | Vue 状态管理库 |
| 前端路由 | Vue Router | 4.x | Vue 官方路由 |
| 后端语言 | Rust | 1.75+ | Tauri 后端语言 |
| 数据库 | SQLite | - | 本地结构化存储 |

### 1.3 约束

- 目标平台：Windows、macOS、Linux
- 数据存储：本地 SQLite，不涉及云同步
- 第一期范围：仅 API 文档管理功能

---

## 2. 架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        桌面应用                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Vue 3 前端                         │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐  │   │
│  │  │  Views  │ │Components│ │ Stores │ │   Router   │  │   │
│  │  │ (页面)  │ │(组件)   │ │(状态)  │ │  (路由)    │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │ IPC                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Tauri Rust 后端                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │   │
│  │  │   命令接口   │ │   数据库     │ │   文件系统      │  │   │
│  │  │  (Commands) │ │  (SQLite)  │ │   (fs)          │  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 前端架构

```
src/
├── api/                    # API 请求层
│   └── index.ts           # Tauri IPC 调用封装
├── assets/                # 静态资源
├── components/             # 通用组件
│   ├── common/            # 通用业务组件
│   └── layout/            # 布局组件
├── router/
│   └── index.ts           # 路由配置
├── stores/                 # Pinia 状态管理
│   ├── project.ts         # 项目状态
│   ├── api.ts             # API 文档状态
│   └── ui.ts              # UI 状态
├── types/                  # TypeScript 类型定义
│   └── index.ts
├── views/                  # 页面视图
│   ├── ProjectView.vue    # 项目列表
│   ├── ApiListView.vue    # API 列表
│   └── ApiDetailView.vue  # API 详情
├── App.vue
└── main.ts
```

### 2.3 后端架构

```
src-tauri/
├── src/
│   ├── main.rs            # 应用入口
│   ├── lib.rs             # 库入口
│   ├── commands/          # Tauri 命令
│   │   ├── mod.rs
│   │   ├── project.rs     # 项目管理命令
│   │   └── api.rs         # API 管理命令
│   ├── db/                # 数据库层
│   │   ├── mod.rs
│   │   ├── schema.rs      # 表结构
│   │   └── migrations.rs  # 迁移
│   └── models/            # 数据模型
│       ├── mod.rs
│       ├── project.rs
│       └── api.rs
├── Cargo.toml
└── tauri.conf.json
```

### 2.4 数据流

```
用户操作 → Vue Component → Pinia Store → Tauri IPC → Rust Command → SQLite
                                                                      ↓
                                              UI 更新 ← Pinia Store ← Response
```

---

## 3. 组件与接口

### 3.1 前端页面组件

| 组件 | 路由 | 说明 |
|------|------|------|
| ProjectView | `/` | 项目列表页 |
| ApiListView | `/project/:id` | API 列表页 |
| ApiDetailView | `/project/:id/api/:apiId` | API 详情编辑页 |

### 3.2 通用组件

| 组件 | 说明 |
|------|------|
| AppHeader | 顶部导航栏 |
| AppSidebar | 左侧项目导航 |
| ApiTable | API 列表表格 |
| ApiForm | API 编辑表单 |
| JsonEditor | JSON 编辑器 |

### 3.3 Tauri IPC 命令

#### 项目管理
| 命令 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `create_project` | `name: String, description: String` | `Project` | 创建项目 |
| `get_projects` | - | `Vec<Project>` | 获取所有项目 |
| `get_project` | `id: i64` | `Option<Project>` | 获取单个项目 |
| `update_project` | `id: i64, name: String, description: String` | `Project` | 更新项目 |
| `delete_project` | `id: i64` | `bool` | 删除项目 |

#### API 管理
| 命令 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `create_api` | `project_id: i64, data: ApiData` | `Api` | 创建 API |
| `get_apis` | `project_id: i64` | `Vec<Api>` | 获取项目下所有 API |
| `get_api` | `id: i64` | `Option<Api>` | 获取单个 API |
| `update_api` | `id: i64, data: ApiData` | `Api` | 更新 API |
| `delete_api` | `id: i64` | `bool` | 删除 API |

---

## 4. 数据模型

### 4.1 数据库表结构

```sql
-- 项目表
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API 文档表
CREATE TABLE apis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'GET',
    path TEXT NOT NULL,
    description TEXT,
    request_headers TEXT,        -- JSON
    request_params TEXT,         -- JSON
    request_body TEXT,           -- JSON
    response_success TEXT,       -- JSON
    response_error TEXT,         -- JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### 4.2 Rust 结构体

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Api {
    pub id: i64,
    pub project_id: i64,
    pub name: String,
    pub method: String,
    pub path: String,
    pub description: Option<String>,
    pub request_headers: Option<String>,
    pub request_params: Option<String>,
    pub request_body: Option<String>,
    pub response_success: Option<String>,
    pub response_error: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}
```

### 4.3 TypeScript 类型

```typescript
interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Api {
  id: number;
  projectId: number;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description?: string;
  requestHeaders?: Record<string, string>;
  requestParams?: Record<string, any>;
  requestBody?: any;
  responseSuccess?: any;
  responseError?: any;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. 正确性属性

### 5.1 功能正确性

- **项目创建**：项目名称必填，最大长度 100 字符
- **API 创建**：名称、路径必填，HTTP 方法必须是合法枚举值
- **级联删除**：删除项目时自动删除该项目下所有 API
- **数据校验**：JSON 字段存储前进行格式校验

### 5.2 状态管理正确性

- Pinia store 使用 `defineStore` 正确封装
- 异步操作使用 `async/await` 并正确处理错误
- 状态变更触发 Vue 组件响应式更新

### 5.3 IPC 通信正确性

- 所有 Tauri 命令调用使用 `invoke<T>` 泛型方法
- 错误通过 `Result<T, String>` 统一处理
- 前端错误通过 Element Plus Message 组件提示用户

---

## 6. 错误处理

### 6.1 前端错误处理

| 场景 | 处理方式 |
|------|----------|
| Tauri 命令调用失败 | Element Plus ElMessage 展示错误信息 |
| 表单校验失败 | Element Plus Form 表单内联提示 |
| 网络/通信异常 | 捕获并展示友好错误信息 |

### 6.2 后端错误处理

| 场景 | 处理方式 |
|------|----------|
| 数据库连接失败 | 返回错误信息，程序终止并提示 |
| SQL 执行失败 | Rust Result 错误向上传播 |
| 数据不存在 | 返回 `Option::None` |
| 数据校验失败 | 返回 `Err(String)` 描述错误 |

### 6.3 错误响应格式

```typescript
// 前端统一错误格式
interface ApiError {
  code: string;
  message: string;
}
```

---

## 7. 测试策略

### 7.1 前端单元测试

- **框架**：Vitest + Vue Test Utils
- **测试范围**：
  - Pinia store 状态逻辑
  - 工具函数
  - 组件渲染（可选）
- **执行命令**：`npm run test`

### 7.2 后端单元测试

- **框架**：Rust 内置 `#[test]`
- **测试范围**：
  - 数据库操作函数
  - 数据模型序列化/反序列化
- **执行命令**：`cargo test`

### 7.3 集成测试

- Tauri 命令端到端测试
- 数据库读写一致性测试

---

## 8. 项目初始化命令

### 8.1 创建项目

```bash
# 创建 Tauri + Vue 项目
npm create tauri-app@latest my-api-app -- --template vue-ts --manager npm

# 进入项目
cd my-api-app

# 安装依赖
npm install

# 安装 Element Plus
npm install element-plus @element-plus/icons-vue

# 安装 Pinia
npm install pinia

# 安装 Vue Router
npm install vue-router
```

### 8.2 开发命令

```bash
# 启动开发服务器
npm run tauri dev

# 构建生产版本
npm run tauri build
```

---

## 9. 参考链接

- [Tauri 官方文档](https://tauri.app/start/)
- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Tauri 2.x 数据库插件](https://tauri.app/plugin/sql/)
