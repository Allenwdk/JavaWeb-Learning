# RESTful API 设计

## 学习目标

- 理解 RESTful 设计风格
- 掌握 RESTful URL 命名规范
- 理解 HTTP 方法对应的 CRUD 操作
- 学会设计规范的 API 接口

## 什么是 RESTful？

RESTful 是一种 API 设计风格，核心思想是：**资源用 URL 表示，操作用 HTTP 方法表示**。

**类比：** 如果你要设计一个图书馆系统：
- 传统设计：`/getUsers`、`/createUser`、`/updateUser`、`/deleteUser`（动词命名）
- RESTful：`/users` + HTTP 方法（名词命名，操作由方法决定）

## RESTful 核心原则

### 1. 资源用名词表示

```
// 不好的设计 — 用动词
GET  /getUsers
POST /createUser
PUT  /updateUser
DELETE /deleteUser

// RESTful 设计 — 用名词
GET    /users      → 获取用户列表
POST   /users      → 创建用户
PUT    /users/1    → 更新用户 1
DELETE /users/1    → 删除用户 1
```

### 2. 使用复数名词

```
/users     ✅ 推荐
/user      ❌ 不推荐（单数）
```

### 3. 嵌套表示从属关系

```
/users/1/posts       → 用户 1 的文章列表
/users/1/posts/42    → 用户 1 的文章 42
```

### 4. 使用查询参数过滤、排序、分页

```
GET /users?role=admin          → 管理员用户
GET /users?age_gt=18           → 年龄大于 18 的用户
GET /users?sort=name           → 按名字排序
GET /users?page=1&size=10      → 第 1 页，每页 10 条
```

### 5. 使用标准状态码

| 操作 | 方法 | 成功状态码 | 说明 |
|------|------|------------|------|
| 查询列表 | GET | 200 OK | 返回资源列表 |
| 查询单个 | GET | 200 OK | 返回单个资源 |
| 创建 | POST | 201 Created | 资源创建成功 |
| 更新 | PUT | 200 OK | 更新成功 |
| 删除 | DELETE | 204 No Content | 删除成功，无响应体 |
| 资源不存在 | GET | 404 Not Found | 资源不存在 |
| 参数错误 | POST/PUT | 400 Bad Request | 请求参数错误 |
| 服务器错误 | 任何 | 500 Internal Server Error | 服务器内部错误 |

## RESTful 响应格式

### 成功响应

```json
// GET /api/users
[
    {"id": 1, "name": "张三", "age": 20},
    {"id": 2, "name": "李四", "age": 22}
]

// GET /api/users/1
{
    "id": 1,
    "name": "张三",
    "age": 20
}

// POST /api/users (创建成功)
{
    "id": 3,
    "name": "王五",
    "age": 19
}
// 状态码: 201 Created
```

### 错误响应

```json
{
    "code": 400,
    "message": "用户名不能为空",
    "timestamp": "2024-01-01T12:00:00"
}
```

### 分页响应

```json
{
    "data": [
        {"id": 1, "name": "张三"},
        {"id": 2, "name": "李四"}
    ],
    "page": 1,
    "size": 10,
    "total": 100
}
```

## RESTful 完整示例

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/users — 获取用户列表
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        List<UserDTO> users = userService.findByPage(page, size);
        return ResponseEntity.ok(users);
    }

    // GET /api/users/1 — 获取单个用户
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    // POST /api/users — 创建用户
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserCreateRequest request) {
        UserDTO user = userService.create(request);
        return ResponseEntity.status(201).body(user);
    }

    // PUT /api/users/1 — 更新用户
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
        @PathVariable Long id,
        @RequestBody UserUpdateRequest request
    ) {
        UserDTO user = userService.update(id, request);
        return ResponseEntity.ok(user);
    }

    // DELETE /api/users/1 — 删除用户
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## RESTful 进阶规范

### 1. 版本控制

```
/api/v1/users
/api/v2/users
```

### 2. 过滤器（Filter）

```
/api/users?role=admin&status=active
```

### 3. 子资源

```
GET  /api/users/1/posts       → 用户 1 的文章列表
POST /api/users/1/posts       → 为用户 1 创建文章
GET  /api/users/1/posts/42    → 文章 42 的详情
DELETE /api/users/1/posts/42  → 删除文章 42
```

### 4. 统一响应包装

```java
public record ApiResponse<T>(int code, String message, T data) {}

@GetMapping
public ApiResponse<List<UserDTO>> getUsers() {
    List<UserDTO> users = userService.findAll();
    return new ApiResponse<>(200, "success", users);
}
```

## 练习任务

### 任务1：设计一个博客系统的 RESTful API

为博客系统（用户、文章、评论）设计 API：

```
GET    /api/users           → 获取用户列表
GET    /api/users/{id}      → 获取用户详情
POST   /api/users           → 创建用户
PUT    /api/users/{id}      → 更新用户
DELETE /api/users/{id}      → 删除用户

GET    /api/posts           → 获取文章列表
GET    /api/posts/{id}      → 获取文章详情
POST   /api/posts           → 创建文章
PUT    /api/posts/{id}      → 更新文章
DELETE /api/posts/{id}      → 删除文章

GET    /api/posts/{id}/comments  → 获取文章评论
POST   /api/posts/{id}/comments  → 发表评论
```

### 任务2：实现一个 RESTful Controller

```java
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> list(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(postService.findByPage(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> get(@PathVariable Long id) {
        PostDTO post = postService.findById(id);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(post);
    }

    @PostMapping
    public ResponseEntity<PostDTO> create(@RequestBody PostCreateRequest request) {
        return ResponseEntity.status(201).body(postService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

## 自测题

### 题目1：RESTful 设计中，URL 应该用什么命名？

A. 动词（如 /getUsers）
B. 名词（如 /users）
C. 动词+名词（如 /getUser）
D. 任意命名

<details>
<summary>查看答案</summary>

**答案：B** — RESTful 使用名词（资源）命名 URL。
</details>

### 题目2：创建资源成功后应该返回哪个状态码？

A. 200 OK
B. 201 Created
C. 202 Accepted
D. 204 No Content

<details>
<summary>查看答案</summary>

**答案：B** — 201 Created 表示资源创建成功。

</details>

### 题目3：以下哪个 URL 符合 RESTful 规范？

A. /getUsers
B. /users
C. /api/getUser
D. /user/1

<details>
<summary>查看答案</summary>

**答案：B** — /users 使用复数名词，符合 RESTful 规范。

</details>
