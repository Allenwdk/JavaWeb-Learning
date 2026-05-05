# 聊天后端 — 测试与运行

## 学习目标

- 能独立运行完整的聊天后端项目
- 掌握 API 测试方法
- 理解常见问题和排查方法

## 运行项目前的准备

### 1. 确保数据库已创建

```sql
CREATE DATABASE chat_db CHARACTER SET utf8mb4;
USE chat_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_id BIGINT NOT NULL,
    to_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    type VARCHAR(20) DEFAULT 'text',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_id) REFERENCES users(id),
    FOREIGN KEY (to_id) REFERENCES users(id)
);
```

### 2. 配置 application.yml

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chat_db?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 3. 确保 pom.xml 包含所有依赖

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- MyBatis Plus -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.5.5</version>
    </dependency>

    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

## 运行项目

### 方式1：IDEA 运行

1. 打开 ChatApplication.java
2. 点击绿色运行按钮
3. 观察控制台输出

成功启动标志：

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

### 方式2：Maven 运行

```bash
mvn spring-boot:run
```

### 方式3：打包运行

```bash
mvn package
java -jar target/chat-backend-0.0.1-SNAPSHOT.jar
```

## 测试 API

### 创建用户

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "张三", "email": "zhangsan@test.com", "password": "123456"}'
```

预期响应：
```json
{"code": 201, "message": "user created", "data": {"id": 1, "name": "张三", "email": "zhangsan@test.com"}}
```

### 获取用户列表

```bash
curl http://localhost:8080/api/users
```

预期响应：
```json
[
  {"id": 1, "name": "张三", "email": "zhangsan@test.com"}
]
```

### 发送消息

```bash
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -d '{"fromId": 1, "toId": 2, "content": "你好！"}'
```

### 获取聊天记录

```bash
curl http://localhost:8080/api/messages?userId=1
```

### 标记已读

```bash
curl -X PUT http://localhost:8080/api/messages/1/read
```

## 常用测试工具

### Postman

1. 下载 Postman（https://www.postman.com/）
2. 新建请求
3. 选择方法（GET/POST/PUT/DELETE）
4. 输入 URL 和 Body
5. 发送并查看响应

### curl（命令行）

```bash
# GET 请求
curl http://localhost:8080/api/users

# POST 请求（带 JSON Body）
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@test.com","password":"123456"}'

# DELETE 请求
curl -X DELETE http://localhost:8080/api/users/1
```

### 浏览器

GET 请求可以直接在浏览器中访问：
```
http://localhost:8080/api/users/1
```

## 常见问题排查

### 1. 启动失败：端口被占用

```
Port 8080 was already in use
```

**解决：**
```bash
# 查找占用 8080 端口的进程
lsof -i :8080
# 杀死进程
kill -9 <PID>
```

或修改端口：
```yaml
server:
  port: 8081
```

### 2. 启动失败：数据库连接错误

```
Communications link failure
```

**解决：**
1. 检查 MySQL 是否运行：`mysql -u root -p`
2. 检查 application.yml 中的数据库配置
3. 检查数据库是否已创建

### 3. 启动失败：依赖缺失

```
NoSuchBeanDefinitionException
```

**解决：**
1. 检查 pom.xml 是否包含所有依赖
2. 运行 `mvn clean install` 重新下载依赖
3. 在 IDEA 中刷新 Maven 项目

### 4. 接口返回 404

**解决：**
1. 检查 Controller 是否有 @RestController 注解
2. 检查 @RequestMapping 路径是否正确
3. 检查 Controller 是否在 @SpringBootApplication 扫描的包下

### 5. 接口返回 415（Unsupported Media Type）

```
HTTP 415 - Content type 'application/json' not supported
```

**解决：**
1. 确保请求头包含 `Content-Type: application/json`
2. 确保方法参数有 @RequestBody 注解

## 练习任务

### 任务1：完整运行聊天后端

1. 创建数据库和表
2. 配置 application.yml
3. 运行项目
4. 用 curl 测试所有 API
5. 确保所有接口都能正常工作

### 任务2：用 Postman 测试

1. 导入 Postman
2. 创建所有 API 的请求
3. 保存为 Collection
4. 测试每个接口的成功和失败场景

## 自测题

### 题目1：启动失败提示 "Port 8080 was already in use"，怎么解决？

A. 重启电脑
B. 杀死占用 8080 端口的进程或修改端口
C. 重装 MySQL
D. 更换浏览器

<details>
<summary>查看答案</summary>

**答案：B** — 杀死占用端口的进程或修改 application.yml 中的 server.port。

</details>

### 题目2：接口返回 404 的可能原因是什么？

A. Controller 没有 @RestController 注解
B. Controller 不在 @SpringBootApplication 扫描的包下
C. @RequestMapping 路径错误
D. 以上全部

<details>
<summary>查看答案</summary>

**答案：D** — 以上都是 404 的常见原因。

</details>

### 题目3：POST 请求返回 415（Unsupported Media Type）怎么解决？

A. 添加 Content-Type: application/json 请求头
B. 方法参数添加 @RequestBody 注解
C. 以上两者都需要
D. 重启项目

<details>
<summary>查看答案</summary>

**答案：C** — POST 请求发送 JSON 需要：请求头 Content-Type: application/json + 方法参数 @RequestBody。

</details>
