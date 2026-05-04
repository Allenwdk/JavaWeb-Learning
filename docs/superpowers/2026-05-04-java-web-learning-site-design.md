# Java Web 学习网站 — 设计文档

## 项目目标

帮助有大一学生基础（有 Java 和 C 语言基础，几乎不会 Java Web）的人，系统学习 Java Web 开发技术栈，最终达到**能不借助 AI 和文档，手写一个简单的聊天后端**，并通过学校科技协会面试的水平。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 网站构建 | VitePress | 静态站点生成器，Markdown 驱动 |
| 内容格式 | Markdown | 每节课一个 .md 文件 |
| 学习技术栈 | Java 17 + Spring Boot + Maven + MyBatis Plus + MySQL | 教程内容 |

## 学习路径

### 模块1：Web 基础概念（1-2节）
- HTTP 协议（请求/响应、方法、状态码）
- 浏览器 ↔ 服务器 通信模型
- 什么是 Servlet（历史背景，为什么需要 Spring Boot）

### 模块2：Java 基础补强（2-3节）
- Java 17 新特性（record、switch 表达式等）
- 集合框架（List、Map 在 Web 中的应用）
- 面向对象在 Web 项目中的实际用法

### 模块3：Maven 与项目结构（1-2节）
- Maven 基础（pom.xml、依赖管理、生命周期）
- Spring Boot 项目结构解析

### 模块4：Spring Boot 核心（3-4节）
- 第一个 Spring Boot 应用
- 注解驱动（@RestController、@GetMapping 等）
- RESTful API 设计
- 配置文件（application.yml）

### 模块5：MyBatis Plus（2-3节）
- ORM 概念
- MyBatis Plus 基本 CRUD
- 条件构造器
- 与 MySQL 连接

### 模块6：综合项目 — 聊天后端（2-3节）
- 数据库设计（用户表、消息表）
- 实体类编写
- Service 层
- Controller 层
- 测试与运行

### 模块7：面试准备（1-2节）
- 常见面试问题整理
- 项目部署基础

## 网站结构

```
JavaWeb-Learning/
├── docs/                          # VitePress 内容目录
│   ├── .vitepress/
│   │   └── config.ts              # 站点配置 + 侧边栏导航
│   ├── index.md                   # 首页
│   └── modules/                   # 按模块组织教程
│       ├── 01-web-basics/         # 模块1：Web 基础
│       │   ├── 01-http.md
│       │   └── 02-servlet.md
│       ├── 02-java-review/        # 模块2：Java 基础补强
│       ├── 03-maven/              # 模块3：Maven
│       ├── 04-spring-boot/        # 模块4：Spring Boot
│       ├── 05-mybatis-plus/       # 模块5：MyBatis Plus
│       ├── 06-chat-project/       # 模块6：聊天后端项目
│       └── 07-interview/          # 模块7：面试准备
├── exercises/                     # 每节课的练习项目模板
│   ├── 01-web-basics/
│   ├── 02-java-review/
│   └── ...
├── package.json                   # VitePress 依赖
└── README.md
```

## 每节课结构

每个 .md 文件包含：

1. **学习目标** — 本节学完后能做什么
2. **知识点讲解** — 文字 + 代码示例
3. **练习任务** — 在本地项目中动手完成的具体任务
4. **参考代码** — 折叠的参考答案，需要时才展开
5. **自测题** — 几道选择题/填空题，检验是否掌握

## 进度追踪

使用 localStorage 本地存储，记录每节课的完成状态。通过 VitePress 的客户端插件实现，不依赖后端。

## 设计原则

- **YAGNI** — 只做面试必需的内容，不扩展
- **循序渐进** — 每节课依赖前面试点，不跳跃
- **动手优先** — 讲解不超过 15 分钟，剩余时间做练习
- **本地项目** — 学生在本地 IDE 写代码，网站只提供引导
