# 第一个 Spring Boot 应用

## 学习目标

- 能独立创建 Spring Boot 项目
- 理解@SpringBootApplication 注解
- 能运行和访问第一个 Spring Boot 应用
- 理解内嵌 Tomcat 的概念

## 创建 Spring Boot 项目

### 方式1：Spring Initializr（推荐）

访问 https://start.spring.io

配置：
- **Project:** Maven
- **Language:** Java
- **Spring Boot:** 3.2.x（最新稳定版）
- **Group:** com.example
- **Artifact:** chat-backend
- **Package name:** com.example.chat
- **Packaging:** Jar
- **Java:** 17

**Dependencies 搜索添加：**
- Spring Web

点击 **Generate** 下载，解压后导入 IDEA。

### 方式2：IDEA 创建

1. File → New → Project → Spring Initializr
2. 填写 Group、Artifact 等信息
3. 勾选 Spring Web
4. 完成

## 项目结构

导入后，项目结构如下：

```
chat-backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/chat/
│   │   │   └── ChatApplication.java    ← 启动类
│   │   └── resources/
│   │       └── application.properties   ← 配置文件
│   └── test/
│       └── java/com/example/chat/
│           └── ChatApplicationTests.java
├── pom.xml
└── mvnw / mvnw.cmd
```

## 启动类

```java
package com.example.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // ← 这个注解启动了整个 Spring Boot
public class ChatApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChatApplication.class, args);
    }
}
```

**@SpringBootApplication 做了什么：**
- `@EnableAutoConfiguration` — Spring Boot 自动配置
- `@ComponentScan` — 扫描当前包及子包下的所有组件
- `@Configuration` — 标记配置类

**main 方法：** 程序入口，启动内嵌 Tomcat 服务器。

## 第一个 Controller

在 `com.example.chat` 包下创建 `HelloController.java`：

```java
package com.example.chat;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController  // 1. 标记这是一个控制器
public class HelloController {

    @GetMapping("/hello")  // 2. 映射 GET /hello 请求
    public String hello() {  // 3. 返回字符串，直接作为 HTTP 响应体
        return "Hello, Spring Boot!";
    }
}
```

**代码解析：**
1. `@RestController` = `@Controller` + `@ResponseBody`
   - 告诉 Spring 这个类处理 HTTP 请求
   - 告诉 Spring 方法返回值直接作为 HTTP 响应体（不是视图名）
2. `@GetMapping("/hello")` — GET 请求映射到 /hello 路径
3. 返回值 "Hello, Spring Boot!" 直接作为 HTTP 响应

## 运行和访问

### 运行方式1：IDEA 运行

点击 ChatApplication 类的绿色运行按钮。

### 运行方式2：命令行

```bash
# 编译
mvn package

# 运行
java -jar target/chat-backend-0.0.1-SNAPSHOT.jar

# 或使用 Maven 插件
mvn spring-boot:run
```

### 访问

启动成功后，控制台输出：

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                3.2.0

Started ChatApplication in 2.5 seconds
```

打开浏览器访问 **http://localhost:8080/hello**

你应该看到：`Hello, Spring Boot!`

## 为什么不需要配置 Tomcat？

传统 Spring MVC 需要：
1. 安装 Tomcat
2. 部署 war 包到 Tomcat
3. 启动 Tomcat

Spring Boot **内嵌了 Tomcat**，所以：
1. 运行 main 方法就启动了 Tomcat
2. 默认端口 8080
3. 不需要额外安装任何服务器

**内嵌 Tomcat 的好处：**
- 一键启动，不需要配置服务器
- 部署简单，`java -jar` 即可
- 方便测试，本地开发更快捷

## 修改端口

默认端口是 8080，如果需要修改，在 `application.properties` 中：

```properties
server.port=8081
```

或在 `application.yml` 中：

```yaml
server:
  port: 8081
```

## 练习任务

### 任务1：创建你的第一个 Controller

```java
@RestController
public class WelcomeController {

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to Java Web!";
    }

    @GetMapping("/about")
    public String about() {
        return "This is a Spring Boot application.";
    }
}
```

运行项目，访问 http://localhost:8080/welcome 和 http://localhost:8080/about。

### 任务2：修改端口

把端口改为 9090：

```properties
server.port=9090
```

重启后访问 http://localhost:9090/welcome。

### 任务3：返回 JSON

```java
@RestController
public class UserController {

    @GetMapping("/user")
    public String getUser() {
        return "{\"name\": \"张三\", \"age\": 20}";
    }
}
```

访问 http://localhost:8080/user，观察返回的 JSON。

## 自测题

### 题目1：Spring Boot 默认端口是多少？

A. 80
B. 443
C. 8080
D. 3000

<details>
<summary>查看答案</summary>

**答案：C** — Spring Boot 默认端口是 8080。

</details>

### 题目2：@RestController 等价于哪两个注解的组合？

A. @Controller + @ResponseBody
B. @Service + @Component
C. @Configuration + @Bean
D. @GetMapping + @PostMapping

<details>
<summary>查看答案</summary>

**答案：A** — @RestController = @Controller + @ResponseBody。

</details>

### 题目3：Spring Boot 内嵌了哪个服务器？

A. Jetty
B. Tomcat
C. Undertow
D. GlassFish

<details>
<summary>查看答案</summary>

**答案：B** — Spring Boot 默认内嵌 Tomcat。

</details>
