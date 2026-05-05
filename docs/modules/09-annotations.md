# 注解驱动

## 学习目标

- 理解 Spring Boot 的核心注解
- 掌握 @RestController、@GetMapping、@PostMapping 等 URL 映射注解
- 学会使用 @PathVariable 和 @RequestParam 接收参数
- 理解 @Autowired 和构造器注入

## Spring Boot 核心注解速查表

| 注解 | 作用 | 使用位置 |
|------|------|----------|
| @SpringBootApplication | 启动 Spring Boot | 主类 |
| @RestController | 定义 REST 控制器 | 类 |
| @Controller | 定义 MVC 控制器 | 类 |
| @Service | 定义服务层 | 类 |
| @Repository | 定义数据访问层 | 类 |
| @Configuration | 定义配置类 | 类 |
| @Bean | 定义 Bean | 方法 |

## URL 映射注解

### @RequestMapping

最基础的映射注解，所有 HTTP 方法通用：

```java
@RequestMapping("/api/users")
public class UserController {
    // 所有请求以 /api/users 开头
}
```

### 快捷注解

| 注解 | HTTP 方法 | 作用 |
|------|-----------|------|
| @GetMapping | GET | 获取资源 |
| @PostMapping | POST | 创建资源 |
| @PutMapping | PUT | 更新资源 |
| @DeleteMapping | DELETE | 删除资源 |
| @PatchMapping | PATCH | 部分更新 |

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping              // GET /api/users
    public List<User> getUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")     // GET /api/users/1
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping             // POST /api/users
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/{id}")     // PUT /api/users/1
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.save(user);
    }

    @DeleteMapping("/{id}")  // DELETE /api/users/1
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

## 接收请求参数

### @PathVariable — 路径参数

```java
// URL: /api/users/1/messages/42
@GetMapping("/users/{userId}/messages/{messageId}")
public Message getMessage(
    @PathVariable Long userId,      // 从路径获取 userId
    @PathVariable Long messageId    // 从路径获取 messageId
) {
    return messageService.findById(messageId);
}
```

**类比：** 路径参数就像文件路径 — `/home/zhangsan/file.txt`，每个部分都是路径的一部分。

### @RequestParam — 查询参数

```java
// URL: /api/users?name=张三&age=20
@GetMapping
public List<User> getUsers(
    @RequestParam String name,      // 获取 ?name= 的值
    @RequestParam int age           // 获取 ?age= 的值
) {
    return userService.findByCondition(name, age);
}

// 带默认值
@GetMapping
public List<User> getUsers(
    @RequestParam(defaultValue = "1") int page,    // 默认第 1 页
    @RequestParam(defaultValue = "10") int size    // 默认每页 10 条
) {
    return userService.findByPage(page, size);
}
```

**类比：** 查询参数就像搜索框 — 在主路径上附加筛选条件。

### @RequestBody — 请求体

```java
// POST /api/users
// Content-Type: application/json
// Body: {"name": "张三", "age": 20}
@PostMapping
public User createUser(@RequestBody User user) {
    return userService.save(user);
}
```

**@RequestBody 做了什么：**
1. 读取 HTTP 请求体
2. 把 JSON 转换为 Java 对象（反序列化）
3. 传递给方法参数

## 接收请求头

```java
@GetMapping("/info")
public String getInfo(
    @RequestHeader("User-Agent") String userAgent
) {
    return "Your browser: " + userAgent;
}
```

## 返回值类型

| 返回类型 | 说明 | 示例 |
|----------|------|------|
| String | 直接返回字符串 | `"Hello"` |
| 基本类型 | 返回基本类型值 | `200` |
| 对象 | 自动转为 JSON | `user` → `{"name":"张三"}` |
| List<T> | 自动转为 JSON 数组 | `[{"name":"张三"},...]` |
| ResponseEntity<T> | 带状态码和头信息 | `ResponseEntity.ok(user)` |

```java
// 返回对象（自动转 JSON）
@GetMapping("/user")
public User getUser() {
    return new User("张三", 20);
}

// 返回 ResponseEntity（可以设置状态码）
@GetMapping("/user/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.findById(id);
    if (user == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(user);
}
```

## 依赖注入

### 构造器注入（推荐）

```java
@RestController
public class UserController {
    private final UserService userService;

    // Spring 自动传入 UserService 实例
    public UserController(UserService userService) {
        this.userService = userService;
    }
}
```

**为什么推荐构造器注入？**
- 不可变（字段用 final）
- 便于测试
- 明确依赖关系
- Spring 5+ 推荐方式

### @Autowired 字段注入（不推荐）

```java
@RestController
public class UserController {
    @Autowired  // 字段注入
    private UserService userService;
}
```

**为什么不推荐：**
- 隐藏依赖关系
- 难以测试
- 字段可变
- IDE 难以检查错误

### @Autowired 方法注入（折中）

```java
@RestController
public class UserController {
    private UserService userService;

    @Autowired  // 方法注入
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
```

## 练习任务

### 任务1：创建完整的 CRUD Controller

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> list(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return productService.findByPage(page, size);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.save(product);
    }

    @PutMapping("/{id}")
    public Product update(
        @PathVariable Long id,
        @RequestBody Product product
    ) {
        product.setId(id);
        return productService.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
```

### 任务2：测试各种参数接收

```java
@RestController
public class ParamController {

    // 路径参数
    @GetMapping("/greet/{name}")
    public String greet(@PathVariable String name) {
        return "Hello, " + name + "!";
    }

    // 查询参数
    @GetMapping("/search")
    public String search(
        @RequestParam String keyword,
        @RequestParam(defaultValue = "1") int page
    ) {
        return "Searching: " + keyword + ", page: " + page;
    }

    // 请求体
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        return "Login: " + username;
    }
}
```

## 自测题

### 题目1：@GetMapping("/users/{id}") 中 {id} 用什么注解接收？

A. @RequestParam
B. @PathVariable
C. @RequestBody
D. @RequestHeader

<details>
<summary>查看答案</summary>

**答案：B** — @PathVariable 用于接收路径参数。

</details>

### 题目2：URL `/api/users?page=1&size=10` 中 page 用什么注解接收？

A. @PathVariable
B. @RequestParam
C. @RequestBody
D. @RequestAttribute

<details>
<summary>查看答案</summary>

**答案：B** — @RequestParam 用于接收查询参数。

</details>

### 题目3：Spring 推荐哪种依赖注入方式？

A. 字段注入（@Autowired 字段）
B. 构造器注入
C. 方法注入
D. Setter 注入

<details>
<summary>查看答案</summary>

**答案：B** — 构造器注入是 Spring 5+ 推荐的方式。

</details>
