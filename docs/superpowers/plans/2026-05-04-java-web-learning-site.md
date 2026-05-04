# Java Web 学习网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 Java Web 学习网站的 VitePress 项目骨架，包含完整的侧边栏导航、首页、7个模块目录结构和第一节课的示例内容。

**Architecture:** 使用 VitePress 构建静态教程站，Markdown 驱动内容，侧边栏按 7 个学习模块组织，提供练习项目目录结构。

**Tech Stack:** VitePress (静态站点生成器) + Markdown

---

### Task 1: 初始化项目 — 安装 VitePress 并配置 package.json

**Files:**
- Create: `package.json`
- Create: `README.md`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "java-web-learning",
  "version": "1.0.0",
  "description": "Java Web 学习网站 — 面向大一学生，聚焦 Spring Boot + MyBatis Plus",
  "type": "module",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.6.0"
  }
}
```

- [ ] **Step 2: 创建 README.md**

```markdown
# JavaWeb-Learning

Java Web 学习路线，目标是**不借助 AI 和文档，手写一个简单的聊天后端**，通过科技协会面试。

## 技术栈

Java 17 + Spring Boot + Maven + MyBatis Plus + MySQL

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173 开始学习。
```

- [ ] **Step 3: 安装依赖**

Run: `cd /Users/allenwdk/JavaWeb-Learning && npm install`

- [ ] **Step 4: 验证安装**

Run: `npx vitepress --version`
Expected: 输出 VitePress 版本号

- [ ] **Step 5: Commit**

```bash
git init
git add package.json README.md
git commit -m "init: 初始化项目，安装 VitePress 依赖"
```

---

### Task 2: 创建 VitePress 站点配置

**Files:**
- Create: `docs/.vitepress/config.ts`

- [ ] **Step 1: 创建 config.ts**

```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'JavaWeb 学习路线',
  description: '从零基础到手写聊天后端 — 大一学生友好',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '学习路线', link: '/modules/intro' },
    ],

    sidebar: {
      '/modules/': [
        {
          text: 'Web 基础',
          items: [
            { text: 'HTTP 协议', link: '/modules/01-http' },
            { text: 'Servlet 与 Spring Boot', link: '/modules/02-servlet' },
          ],
        },
        {
          text: 'Java 基础补强',
          items: [
            { text: 'Java 17 新特性', link: '/modules/03-java17' },
            { text: '集合框架', link: '/modules/04-collections' },
            { text: '面向对象实战', link: '/modules/05-oop' },
          ],
        },
        {
          text: 'Maven',
          items: [
            { text: 'Maven 基础', link: '/modules/06-maven' },
            { text: 'Spring Boot 项目结构', link: '/modules/07-project-structure' },
          ],
        },
        {
          text: 'Spring Boot 核心',
          items: [
            { text: '第一个 Spring Boot 应用', link: '/modules/08-first-app' },
            { text: '注解驱动', link: '/modules/09-annotations' },
            { text: 'RESTful API 设计', link: '/modules/10-restful' },
            { text: '配置文件', link: '/modules/11-config' },
          ],
        },
        {
          text: 'MyBatis Plus',
          items: [
            { text: 'ORM 概念', link: '/modules/12-orm' },
            { text: '基本 CRUD', link: '/modules/13-crud' },
            { text: '条件构造器', link: '/modules/14-query-builder' },
            { text: 'MySQL 连接', link: '/modules/15-mysql-connect' },
          ],
        },
        {
          text: '综合项目 — 聊天后端',
          items: [
            { text: '数据库设计', link: '/modules/16-db-design' },
            { text: '实体类编写', link: '/modules/17-entities' },
            { text: 'Service 层', link: '/modules/18-service' },
            { text: 'Controller 层', link: '/modules/19-controller' },
            { text: '测试与运行', link: '/modules/20-test-run' },
          ],
        },
        {
          text: '面试准备',
          items: [
            { text: '常见面试问题', link: '/modules/21-interview-questions' },
            { text: '项目部署基础', link: '/modules/22-deployment' },
          ],
        },
      ],
    },

    socialLinks: [],
  },
})
```

- [ ] **Step 2: 验证配置**

Run: `npx vitepress dev docs --port 5173`
Expected: 启动成功，控制台输出 `  ➜  Local:   http://localhost:5173/`

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/config.ts
git commit -m "feat: 创建 VitePress 站点配置，包含完整侧边栏导航"
```

---

### Task 3: 创建首页

**Files:**
- Create: `docs/index.md`

- [ ] **Step 1: 创建首页 index.md**

```markdown
---
layout: home

hero:
  name: JavaWeb 学习路线
  text: 从零基础到手写聊天后端
  tagline: 面向大一学生，有 Java 基础，目标是通过科技协会面试
  actions:
    - theme: brand
      text: 开始学习 →
      link: /modules/intro
    - theme: alt
      text: 练习项目
      link: https://github.com/your-repo/exercises
  image:
    alt: JavaWeb Learning
---

## 学习目标

学完本教程后，你将能够：

- 理解 HTTP 协议、浏览器与服务器通信模型
- 使用 Spring Boot 搭建 RESTful API
- 使用 MyBatis Plus 操作 MySQL 数据库
- **不借助 AI 和文档，手写一个聊天后端项目**

## 技术栈

| 技术 | 用途 |
|------|------|
| Java 17 | 编程语言 |
| Spring Boot | Web 框架 |
| Maven | 项目构建 |
| MyBatis Plus | ORM 框架 |
| MySQL | 数据库 |

## 学习路线

<div class="module-grid">

| 模块 | 内容 | 课时 |
|------|------|------|
| 📡 Web 基础 | HTTP、Servlet | 2 |
| ☕ Java 补强 | Java 17、集合、OOP | 3 |
| 📦 Maven | 依赖管理、项目结构 | 2 |
| 🚀 Spring Boot | 注解、RESTful、配置 | 4 |
| 🗄️ MyBatis Plus | ORM、CRUD、查询 | 4 |
| 💬 聊天后端 | 综合项目 | 5 |
| 🎯 面试准备 | 常见问题、部署 | 2 |

</div>

## 每节课结构

1. **学习目标** — 学完后能做什么
2. **知识点讲解** — 文字 + 代码示例
3. **练习任务** — 在本地项目中动手
4. **参考代码** — 折叠的参考答案
5. **自测题** — 检验是否掌握

## 练习方式

每节课提供一个**练习项目模板**，你需要：

1. 在本地创建 Spring Boot 项目
2. 按照教程引导编写代码
3. 在 IDE 中运行和调试
4. 完成后对照参考答案检查

> 网站本身是静态站点，代码练习在你的本地 IDE 中完成。
```

- [ ] **Step 2: 验证首页**

在浏览器打开 http://localhost:5173/
Expected: 显示首页内容，Hero 区域、技术栈表格、学习路线表格

- [ ] **Step 3: Commit**

```bash
git add docs/index.md
git commit -m "feat: 创建首页，包含学习目标、技术栈、学习路线"
```

---

### Task 4: 创建"学习路线"介绍页

**Files:**
- Create: `docs/modules/intro.md`

- [ ] **Step 1: 创建 intro.md**

```markdown
# 学习路线

本节概览整个学习路径，帮助你了解学习顺序和每节课的作用。

## 学习顺序

```
┌─────────────────────────────────┐
│ 模块1: Web 基础概念             │
│   理解 HTTP、浏览器↔服务器通信  │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 模块2: Java 基础补强            │
│   Java 17、集合、OOP 实战       │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 模块3: Maven                    │
│   依赖管理、项目结构            │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 模块4: Spring Boot 核心         │
│   注解、RESTful API、配置       │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 模块5: MyBatis Plus             │
│   ORM、CRUD、条件查询           │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 模块6: 综合项目 — 聊天后端      │
│   数据库 → 实体 → Service →     │
│   Controller → 测试             │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│ 模块7: 面试准备                 │
│   常见问题、部署基础            │
└─────────────────────────────────┘
```

## 为什么是这个顺序？

1. **先理解 Web 是什么** — 不理解 HTTP 就无法理解 Spring Boot 做了什么
2. **补强 Java 基础** — Spring Boot 本质是 Java 代码，集合和 OOP 是日常编码基础
3. **学会用 Maven** — 没有 Maven 你无法管理 Spring Boot 依赖
4. **Spring Boot 核心** — 这是面试最常考的部分
5. **MyBatis Plus** — 数据库操作是后端必备技能
6. **综合项目** — 把前面所有知识串起来
7. **面试准备** — 针对科技协会面试的常见问题

## 每节课包含什么？

- **知识点讲解** — 不超过 15 分钟
- **练习任务** — 在本地项目中动手
- **参考代码** — 折叠的参考答案
- **自测题** — 检验掌握程度

## 开始学习

点击左侧导航栏，从「HTTP 协议」开始。
```

- [ ] **Step 2: 验证**

在浏览器打开 http://localhost:5173/modules/intro
Expected: 显示学习路线概览页面

- [ ] **Step 3: Commit**

```bash
git add docs/modules/intro.md
git commit -m "feat: 创建学习路线介绍页"
```

---

### Task 5: 创建第一节课示例 — HTTP 协议

**Files:**
- Create: `docs/modules/01-http.md`

- [ ] **Step 1: 创建 HTTP 教程页**

```markdown
# HTTP 协议

## 学习目标

- 理解 HTTP 是什么
- 知道 HTTP 请求和响应的结构
- 理解常见的请求方法（GET、POST、PUT、DELETE）
- 理解常见的状态码（200、404、500）

## 什么是 HTTP？

HTTP（HyperText Transfer Protocol）是**浏览器和服务器之间通信的规则**。

类比：HTTP 就像快递单上的填写规则 — 发件人、收件人、物品描述、包装方式都有固定格式。

### HTTP 请求（浏览器 → 服务器）

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html

```

请求由三部分组成：

1. **请求行** — `GET /index.html HTTP/1.1`
   - 方法：GET
   - 路径：/index.html
   - 协议版本：HTTP/1.1

2. **请求头** — 元数据
   - Host：服务器地址
   - User-Agent：浏览器信息

3. **请求体** — 可选，POST 请求时携带数据

### HTTP 响应（服务器 → 浏览器）

```
HTTP/1.1 200 OK
Content-Type: text/html

<html><body>Hello</body></html>
```

响应由三部分组成：

1. **状态行** — `HTTP/1.1 200 OK`
   - 协议版本：HTTP/1.1
   - 状态码：200
   - 状态描述：OK

2. **响应头** — Content-Type、Content-Length 等

3. **响应体** — 实际返回的内容（HTML、JSON 等）

## 常见请求方法

| 方法 | 作用 | 类比 |
|------|------|------|
| GET | 获取资源 | 查快递 |
| POST | 创建资源 | 寄快递 |
| PUT | 更新资源 | 修改快递信息 |
| DELETE | 删除资源 | 撤回快递 |

### GET vs POST 的区别

```java
// GET — 数据在 URL 中
GET /api/users?id=1

// POST — 数据在请求体中
POST /api/users
Content-Type: application/json

{"name": "张三", "age": 20}
```

**关键区别：**
- GET 参数在 URL 中可见，POST 在请求体中
- GET 可以缓存，POST 不可以
- POST 能发送更大数据

## 常见状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 301 | Moved Permanently | 永久重定向 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权（未登录） |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

## 练习任务

### 任务：用 curl 发送 HTTP 请求

在你的终端中执行：

```bash
# 发送 GET 请求
curl -v https://httpbin.org/get

# 发送 POST 请求
curl -v -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "age": 20}'
```

观察输出：
1. 找到请求行（`GET` 或 `POST`）
2. 找到请求头
3. 找到响应状态码
4. 找到响应体

### 任务：用浏览器开发者工具查看 HTTP 请求

1. 打开 Chrome 浏览器
2. 访问任意网站
3. 按 `F12` 打开开发者工具
4. 点击 **Network** 标签
5. 刷新页面
6. 点击任意请求，查看 Request Headers 和 Response Headers

## 自测题

### 题目1：以下哪个状态码表示"资源不存在"？

A. 200
B. 404
C. 500
D. 301

<details>
<summary>查看答案</summary>

**答案：B** — 404 Not Found 表示请求的资源不存在。

</details>

### 题目2：GET 和 POST 的主要区别是什么？

A. GET 比 POST 快
B. GET 参数在 URL 中，POST 在请求体中
C. GET 不能带参数
D. POST 只能发送 JSON 数据

<details>
<summary>查看答案</summary>

**答案：B** — GET 参数在 URL 中可见，POST 数据在请求体中。

</details>

### 题目3：创建一个新用户，应该用哪个 HTTP 方法？

A. GET
B. POST
C. PUT
D. DELETE

<details>
<summary>查看答案</summary>

**答案：B** — POST 用于创建新资源。

</details>
```

- [ ] **Step 2: 验证**

在浏览器打开 http://localhost:5173/modules/01-http
Expected: 显示完整的 HTTP 教程页面，代码高亮正常，自测题折叠可展开

- [ ] **Step 3: Commit**

```bash
git add docs/modules/01-http.md
git commit -m "feat: 创建第一节课 — HTTP 协议教程"
```

---

### Task 6: 创建练习项目目录结构

**Files:**
- Create: `exercises/README.md`

- [ ] **Step 1: 创建 exercises 目录说明**

```markdown
# 练习项目

每个模块的练习项目模板。

## 使用方式

1. 复制对应模块的目录到你的本地
2. 按照教程引导编写代码
3. 在 IDE 中运行

## 目录结构

```
exercises/
├── 01-web-basics/          # Web 基础练习
│   └── README.md
├── 02-java-review/         # Java 基础补强练习
├── 03-maven/               # Maven 练习
├── 04-spring-boot/         # Spring Boot 练习
├── 05-mybatis-plus/        # MyBatis Plus 练习
├── 06-chat-project/        # 聊天后端综合项目
└── 07-interview/           # 面试练习
```

## 本地创建 Spring Boot 项目

每个模块开始前，你需要在本地创建 Spring Boot 项目。

### 方式1：使用 Spring Initializr（推荐）

访问 https://start.spring.io

选择：
- Build: Maven
- Language: Java
- Spring Boot: 最新稳定版
- Dependencies: Spring Web（后续模块添加其他依赖）
- 点击 Generate 下载

### 方式2：使用 Maven 命令

```bash
mvn archetype:generate \
  -DgroupId=com.example \
  -DartifactId=chat-backend \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```
```

- [ ] **Step 2: Commit**

```bash
git add exercises/README.md
git commit -m "docs: 创建练习项目目录结构说明"
```

---

### Task 7: 最终验证

**Files:**
- 全部文件

- [ ] **Step 1: 构建并预览**

Run: `npx vitepress build docs`
Expected: 构建成功，输出 `dist/` 目录

Run: `npx vitepress preview docs --port 4173`
Expected: 预览服务启动在 http://localhost:4173

- [ ] **Step 2: 检查所有页面可访问**

在浏览器访问 http://localhost:4173 并点击侧边栏所有链接，确认：
- [ ] 首页正常显示
- [ ] 学习路线页正常显示
- [ ] HTTP 协议页正常显示（含代码高亮、折叠题）
- [ ] 侧边栏导航正常切换
- [ ] 搜索功能正常（VitePress 内置）

- [ ] **Step 3: 最终 Commit**

```bash
git add .
git commit -m "feat: 完成学习网站骨架 — 首页、导航、第一节课教程、练习目录"
```
