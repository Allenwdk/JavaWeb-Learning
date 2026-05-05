# Maven 基础

## 学习目标

- 理解 Maven 的作用
- 掌握 pom.xml 的基本结构
- 学会添加依赖和管理版本
- 了解 Maven 常用命令

## 什么是 Maven？

Maven 是 Java 的**项目构建工具**，负责：

1. **依赖管理** — 自动下载 jar 包，处理依赖关系
2. **项目构建** — 编译、测试、打包
3. **项目管理** — 统一项目结构

**类比：** 如果你要做一道菜，Maven 就是帮你自动去超市买调料、洗菜、切菜的工具。你只需要告诉它"我要什么"，它帮你搞定一切。

## 没有 Maven 的日子

```bash
# 手动下载 jar 包
# 1. 去 Maven Central 网站搜索 spring-web
# 2. 下载 spring-web-6.0.0.jar
# 3. 发现它还依赖其他 10 个 jar 包
# 4. 一个一个下载...
# 5. 把它们都放到 lib 目录
# 6. 在 classpath 中配置所有 jar 包
# 7. 某天发现版本冲突，从头再来
```

有了 Maven，只需要在 pom.xml 加一行：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
</dependency>
```

Maven 自动下载所有依赖，包括传递依赖。

## pom.xml 结构

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <!-- 项目坐标 -->
    <groupId>com.example</groupId>
    <artifactId>chat-backend</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 项目信息 -->
    <name>Chat Backend</name>
    <description>聊天后端项目</description>

    <!-- 依赖管理 -->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <!-- 构建配置 -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 坐标（GAV）

每个 Maven 依赖由三个坐标唯一确定：

| 坐标 | 说明 | 示例 |
|------|------|------|
| groupId | 组织/公司标识 | org.springframework.boot |
| artifactId | 项目/模块名称 | spring-boot-starter-web |
| version | 版本号 | 3.2.0 |

**groupId 命名规范：** 公司域名倒序 + 模块名
- `com.example.myproject`
- `org.springframework`
- `mysql`

### 版本号规则

```
主版本.次版本.修订版本

3.2.0
│ │ └─ 修订版本：bug 修复，向后兼容
│ └── 次版本：新功能，基本向后兼容
└──── 主版本：重大更新，可能不兼容

SNAPSHOT：开发中的版本，随时可能变化
RELEASE：稳定版本
```

## 常用命令

| 命令 | 作用 | 说明 |
|------|------|------|
| `mvn compile` | 编译 | 将 .java 编译为 .class |
| `mvn test` | 测试 | 运行测试用例 |
| `mvn package` | 打包 | 生成 jar/war |
| `mvn install` | 安装 | 把 jar 安装到本地仓库 |
| `mvn clean` | 清理 | 删除 target 目录 |
| `mvn clean install` | 清理+打包 | 常用组合命令 |
| `mvn spring-boot:run` | 运行 | 运行 Spring Boot 应用 |

## 依赖范围

```xml
<!-- 编译和测试时需要，运行不需要 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- 只在测试时需要 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<!-- 提供依赖（编译时需要，运行时由容器提供） -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <scope>provided</scope>
</dependency>
```

| 范围 | 编译 | 测试 | 运行 | 说明 |
|------|------|------|------|------|
| compile | 是 | 是 | 是 | 默认范围 |
| provided | 是 | 是 | 否 | 容器提供（如 Servlet API） |
| runtime | 否 | 是 | 是 | 运行时才需要（如 JDBC 驱动） |
| test | 否 | 是 | 否 | 仅测试（如 JUnit） |

## 依赖传递

```
你的项目
  └── spring-boot-starter-web (3.2.0)
        ├── spring-web (6.0.0)
        │     └── spring-core (6.0.0)
        └── spring-boot-starter-tomcat (3.2.0)
              └── tomcat-embed-core (10.1.0)
```

Maven 自动解析传递依赖，你不需要手动管理。

**依赖冲突解决：** 如果两个依赖需要不同版本的同一个库，Maven 选择"最近"的那个。

```xml
<!-- 强制指定版本 -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.0.0</version>
</dependency>
```

## 常用 Starter

Starter 是 Spring Boot 提供的"依赖包集合"，加一个 starter 就引入所有需要的依赖。

| Starter | 作用 |
|---------|------|
| spring-boot-starter-web | Web 开发（Spring MVC + Tomcat） |
| spring-boot-starter-data-jpa | JPA 数据访问 |
| spring-boot-starter-security | 安全认证 |
| spring-boot-starter-test | 测试工具 |
| mybatis-spring-boot-starter | MyBatis 集成 |

## 练习任务

### 任务1：查看你的 pom.xml

打开你的 Spring Boot 项目的 pom.xml，找到：
1. groupId 和 artifactId
2. parent 依赖（spring-boot-starter-parent）
3. 当前有哪些 dependencies

### 任务2：添加一个新依赖

在 pom.xml 中添加 Lombok 依赖：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

然后运行 `mvn compile`，观察 Maven 自动下载依赖的过程。

## 自测题

### 题目1：Maven 依赖的三个坐标是什么？

A. name、version、path
B. groupId、artifactId、version
C. organization、project、version
D. company、module、release

<details>
<summary>查看答案</summary>

**答案：B** — groupId、artifactId、version 是 Maven 依赖的三个坐标。

</details>

### 题目2：哪个依赖范围只在测试时使用？

A. compile
B. runtime
C. test
D. provided

<details>
<summary>查看答案</summary>

**答案：C** — test 范围只在编译测试和运行测试时使用。

</details>

### 题目3：`mvn clean install` 做了什么？

A. 只清理项目
B. 只安装依赖
C. 清理后编译、测试、打包并安装到本地仓库
D. 只打包

<details>
<summary>查看答案</summary>

**答案：C** — clean 清理 target，install 执行 compile → test → package → install。

</details>
