# Spring Boot 项目结构

## 学习目标

- 理解 Spring Boot 项目的标准目录结构
- 知道每个包的作用
- 了解主类（Application 类）的作用
- 能独立搭建一个 Spring Boot 项目

## 标准项目结构

```
chat-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/chat/
│   │   │       ├── ChatApplication.java      # 启动类
│   │   │       ├── controller/               # 控制器层
│   │   │       │   ├── UserController.java
│   │   │       │   └── MessageController.java
│   │   │       ├── service/                  # 业务逻辑层
│   │   │       │   ├── UserService.java       # 接口
│   │   │       │   ├── DefaultUserService.java # 实现
│   │   │       │   └── MessageService.java
│   │   │       ├── repository/               # 数据访问层
│   │   │       │   ├── UserRepository.java
│   │   │       │   └── MessageRepository.java
│   │   │       ├── model/                    # 实体类
│   │   │       │   ├── User.java
│   │   │       │   └── Message.java
│   │   │       └── config/                   # 配置类
│   │   │           └── WebConfig.java
│   │   └── resources/
│   │       ├── application.yml               # 配置文件
│   │       └── static/                       # 静态资源
│   └── test/
│       └── java/
│           └── com/example/chat/
│               └── ChatApplicationTests.java
├── pom.xml
└── README.md
```

## 各层职责

### 启动类（ChatApplication.java）

```java
package com.example.chat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChatApplication.class, args);
    }
}
```

**@SpringBootApplication 做了什么：**
- `@Configuration` — 标记这是一个配置类
- `@EnableAutoConfiguration` — 开启自动配置
- `@ComponentScan` — 扫描当前包及子包下的所有组件

**main 方法：** 内嵌 Tomcat 启动入口，不是 Servlet 容器调用的。

### Controller 层（控制器）

**职责：** 处理 HTTP 请求，接收参数，返回响应。

**特点：**
- 用 `@RestController` 注解
- 用 `@RequestMapping`、`@GetMapping`、`@PostMapping` 等映射 URL
- **不包含业务逻辑**，只负责转发请求

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);  // 交给 Service 处理
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);  // 交给 Service 处理
    }
}
```

### Service 层（业务逻辑）

**职责：** 处理业务逻辑，调用 Repository 访问数据。

**特点：**
- 用 `@Service` 注解
- 定义接口，提供实现类
- 包含事务管理（`@Transactional`）

```java
public interface UserService {
    User findById(Long id);
    User save(User user);
    void delete(Long id);
}

@Service
public class DefaultUserService implements UserService {
    private final UserRepository userRepository;
    
    public DefaultUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    @Transactional  // 开启事务
    public User save(User user) {
        // 业务逻辑：校验、处理、保存
        if (user.getName() == null || user.getName().isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        return userRepository.save(user);
    }
}
```

### Repository 层（数据访问）

**职责：** 与数据库交互，执行 CRUD 操作。

**特点：**
- 用 `@Repository` 注解（MyBatis Plus 中通常不需要）
- 继承 MyBatis Plus 的 `BaseMapper<T>`
- 只包含数据库操作，不包含业务逻辑

```java
public interface UserRepository extends BaseMapper<User> {
    // MyBatis Plus 已经提供了基本的 CRUD
    // 自定义查询方法
    List<User> findByName(String name);
}
```

### Model 层（实体类）

**职责：** 映射数据库表结构，定义数据模型。

**特点：**
- 用 `@TableName` 映射表名
- 用 `@TableId` 标记主键
- 用 `@TableField` 映射字段

```java
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)  // 自增主键
    private Long id;
    
    @TableField("name")
    private String name;
    
    @TableField("email")
    private String email;
    
    @TableField("age")
    private Integer age;
    
    // getter/setter（如果用 Lombok，用 @Data 注解）
}
```

### Config 层（配置类）

**职责：** 配置 Spring Boot 的非 yml 配置项。

```java
@Configuration
public class WebConfig {
    @Bean
    public CorsFilter corsFilter() {
        // CORS 配置
        return new CorsFilter();
    }
}
```

## resources 目录

```
src/main/resources/
├── application.yml          # 主配置文件
├── application-dev.yml      # 开发环境配置
├── application-prod.yml     # 生产环境配置
├── static/                  # 静态资源（CSS、JS、图片）
│   ├── css/
│   ├── js/
│   └── images/
└── templates/               # 模板文件（Thymeleaf）
    └── index.html
```

## 数据流向

```
浏览器请求
    │
    ▼
Controller（接收请求，参数校验）
    │
    ▼
Service（业务逻辑，事务管理）
    │
    ▼
Repository（数据库操作）
    │
    ▼
Database（MySQL）
    │
    ▼
Model 对象
    │
    ▼
Service → Controller → JSON 响应 → 浏览器
```

**记忆口诀：** 请求进来找 Controller，Controller 交给 Service，Service 交给 Repository，Repository 找数据库。

## 练习任务

### 任务1：创建标准项目结构

1. 用 Spring Initializr 创建一个 Spring Boot 项目
2. 按标准结构创建包：
   - com.example.chat.controller
   - com.example.chat.service
   - com.example.chat.repository
   - com.example.chat.model
3. 创建一个简单的 User 实体类
4. 创建一个 UserController

### 任务2：实现一个简单的 CRUD

```java
// 1. 创建 User 实体
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer age;
}

// 2. 创建 Repository
public interface UserRepository extends BaseMapper<User> {}

// 3. 创建 Service
public interface UserService {
    List<User> findAll();
    User findById(Long id);
}

@Service
public class DefaultUserService implements UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public List<User> findAll() {
        return userRepository.selectList(null);
    }
    
    @Override
    public User findById(Long id) {
        return userRepository.selectById(id);
    }
}

// 4. 创建 Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<User> getUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

## 自测题

### 题目1：@SpringBootApplication 不包含哪个注解？

A. @Configuration
B. @EnableAutoConfiguration
C. @ComponentScan
D. @RestController

<details>
<summary>查看答案</summary>

**答案：D** — @RestController 是 Controller 层的注解，不是 @SpringBootApplication 的组成部分。

</details>

### 题目2：Controller 层不应该包含什么？

A. 接收请求参数
B. 返回 HTTP 响应
C. 业务逻辑
D. URL 映射

<details>
<summary>查看答案</summary>

**答案：C** — 业务逻辑应该在 Service 层，Controller 只负责接收请求和返回响应。

</details>

### 题目3：数据流向的正确顺序是？

A. Controller → Repository → Service → Database
B. Controller → Service → Repository → Database
C. Service → Controller → Repository → Database
D. Controller → Service → Database → Repository

<details>
<summary>查看答案</summary>

**答案：B** — Controller → Service → Repository → Database（请求从 Controller 进入，逐层向下到数据库）。

</details>
