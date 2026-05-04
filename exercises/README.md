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
