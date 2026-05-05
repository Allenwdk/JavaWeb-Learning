# 配置文件

## 学习目标

- 掌握 application.yml 的配置方式
- 了解多环境配置（dev、test、prod）
- 能配置数据库连接、端口等常用配置
- 理解 @Value 和 @ConfigurationProperties 注入配置

## application.yml 基础

Spring Boot 默认读取 `src/main/resources/application.yml`（或 .properties）。

### 常用配置

```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api

# 日志配置
logging:
  level:
    com.example.chat: DEBUG
    org.springframework.web: INFO
```

### yml vs properties

| 格式 | 示例 | 特点 |
|------|------|------|
| yml | `server.port: 8080` | 层级清晰，推荐 |
| properties | `server.port=8080` | 扁平结构，传统 |

**推荐使用 yml**，结构更清晰。

## 数据库配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chat_db?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
      data-locations: classpath:data.sql
```

**url 参数说明：**

| 参数 | 说明 |
|------|------|
| useSSL=false | 不使用 SSL 连接 |
| serverTimezone=Asia/Shanghai | 设置时区 |
| useUnicode=true | 使用 Unicode 编码 |
| characterEncoding=utf-8 | 使用 UTF-8 编码 |

## 多环境配置

### 场景

开发环境用本地 MySQL，生产环境用远程数据库。

### 方式1：多配置文件

```
src/main/resources/
├── application.yml           # 公共配置
├── application-dev.yml       # 开发环境
└── application-prod.yml      # 生产环境
```

**application.yml（公共配置）：**

```yaml
server:
  port: 8080

logging:
  level:
    com.example.chat: INFO
```

**application-dev.yml（开发环境）：**

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chat_db?useSSL=false
    username: root
    password: 123456
```

**application-prod.yml（生产环境）：**

```yaml
spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/chat_db
    username: prod_user
    password: ${DB_PASSWORD}  # 从环境变量读取
```

**激活配置：**

```yaml
# application.yml
spring:
  profiles:
    active: dev  # 激活 dev 环境
```

**命令行激活：**

```bash
java -jar app.jar --spring.profiles.active=prod
```

### 方式2：单文件多环境

```yaml
spring:
  profiles:
    active: dev

---
# 开发环境
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:mysql://localhost:3306/chat_db
    username: root
    password: 123456

---
# 生产环境
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://prod-server:3306/chat_db
    username: prod_user
    password: ${DB_PASSWORD}
```

## 读取配置

### @Value — 读取单个配置

```java
@Component
public class AppConfig {

    @Value("${server.port}")
    private int port;

    @Value("${app.message:Hello}")  // 带默认值
    private String message;

    public int getPort() { return port; }
    public String getMessage() { return message; }
}
```

### @ConfigurationProperties — 读取一组配置

```yaml
app:
  name: Chat App
  version: 1.0.0
  chat:
    max-message-length: 1000
    welcome-message: Welcome!
```

```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private Chat chat = new Chat();

    // getter/setter

    public static class Chat {
        private int maxMessageLength;
        private String welcomeMessage;
        // getter/setter
    }
}
```

## MyBatis Plus 配置

```yaml
mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.chat.model
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # 开发环境打印 SQL
  global-config:
    db-config:
      id-type: auto        # 主键自增
      logic-delete-field: deleted  # 逻辑删除字段
      logic-delete-value: 1
      logic-not-delete-value: 0
```

**配置说明：**

| 配置项 | 作用 |
|--------|------|
| mapper-locations | Mapper XML 文件位置 |
| type-aliases-package | 实体类包名（XML 中可用短类名） |
| map-underscore-to-camel-case | 下划线转驼峰（name → name） |
| log-impl | SQL 日志实现（开发时打印 SQL） |
| id-type | 主键策略（auto 自增、assign_id 雪花算法） |
| logic-delete-field | 逻辑删除字段名 |

## 环境变量

敏感信息（密码、密钥）不要写死在配置文件中，用环境变量：

```yaml
spring:
  datasource:
    password: ${DB_PASSWORD}  # 从环境变量 DB_PASSWORD 读取
```

```bash
export DB_PASSWORD=secret123
java -jar app.jar
```

## 练习任务

### 任务1：配置数据库连接

修改 application.yml：

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
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.chat.model
  configuration:
    map-underscore-to-camel-case: true
  global-config:
    db-config:
      id-type: auto
```

### 任务2：创建多环境配置

创建 application-dev.yml 和 application-prod.yml，用 `--spring.profiles.active` 切换。

## 自测题

### 题目1：Spring Boot 默认配置文件名是什么？

A. config.yml
B. application.yml
C. spring.yml
D. settings.yml

<details>
<summary>查看答案</summary>

**答案：B** — 默认配置文件名是 application.yml。

</details>

### 题目2：如何激活 dev 环境配置？

A. `--environment=dev`
B. `--spring.profiles.active=dev`
C. `--active-profile=dev`
D. `--env=dev`

<details>
<summary>查看答案</summary>

**答案：B** — 使用 `--spring.profiles.active=dev` 激活 dev 环境。

</details>

### 题目3：@ConfigurationProperties 和 @Value 的区别是什么？

A. @ConfigurationProperties 读取一组配置，@Value 读取单个值
B. @Value 读取一组配置，@ConfigurationProperties 读取单个值
C. 没有区别
D. @ConfigurationProperties 只能读取 yml，@Value 只能读取 properties

<details>
<summary>查看答案</summary>

**答案：A** — @ConfigurationProperties 批量绑定配置到对象，@Value 绑定单个值。

</details>
