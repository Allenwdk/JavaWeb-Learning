# 聊天后端 — Controller 层

## 学习目标

- 掌握 Controller 的编写方法
- 能实现聊天后端的所有 RESTful API
- 理解 @RequestBody、@PathVariable、@RequestParam 的使用

## 创建 UserController

```java
package com.example.chat.controller;

import com.example.chat.model.User;
import com.example.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController              // 1. 标记这是一个 REST 控制器
@RequestMapping("/api/users")  // 2. 所有接口以 /api/users 开头
public class UserController {

    @Autowired              // 3. 注入 Service
    private UserService userService;

    // GET /api/users — 获取所有用户
    @GetMapping
    public List<User> getUsers() {
        return userService.findAll();
    }

    // GET /api/users/1 — 获取单个用户
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }

    // POST /api/users — 创建用户
    @PostMapping
    public User createUser(@RequestBody UserCreateRequest request) {
        return userService.create(request.getName(), request.getEmail(), request.getPassword());
    }

    // PUT /api/users/1 — 更新用户
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return userService.update(id, request.getName(), request.getEmail());
    }

    // DELETE /api/users/1 — 删除用户
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

## 请求/响应 DTO

不要用 Entity 直接作为请求/响应，用 DTO 解耦：

```java
// 创建用户请求
public record UserCreateRequest(String name, String email, String password) {}

// 更新用户请求
public record UserUpdateRequest(String name, String email) {}

// 用户响应
public record UserResponse(Long id, String name, String email, String status) {}
```

**为什么用 DTO？**
- Entity 包含密码等敏感字段，不应该返回给前端
- Entity 包含 createdAt/updatedAt，不应该让前端修改
- DTO 可以灵活调整，不依赖数据库结构

## 创建 MessageController

```java
package com.example.chat.controller;

import com.example.chat.model.Message;
import com.example.chat.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // GET /api/messages?userId=1 — 获取用户聊天记录
    @GetMapping
    public List<Message> getMessages(@RequestParam Long userId) {
        return messageService.getMessages(userId);
    }

    // POST /api/messages — 发送消息
    @PostMapping
    public Message sendMessage(@RequestBody SendRequest request) {
        return messageService.sendMessage(
            request.getFromId(),
            request.getToId(),
            request.getContent()
        );
    }

    // PUT /api/messages/{id}/read — 标记已读
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        messageService.markAsRead(id);
    }
}
```

## 请求 DTO

```java
public record SendRequest(Long fromId, Long toId, String content) {}
```

## 统一响应格式

```java
public record ApiResponse<T>(int code, String message, T data) {}
```

```java
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping
    public ApiResponse<List<Message>> getMessages(@RequestParam Long userId) {
        List<Message> messages = messageService.getMessages(userId);
        return new ApiResponse<>(200, "success", messages);
    }

    @PostMapping
    public ApiResponse<Message> sendMessage(@RequestBody SendRequest request) {
        Message msg = messageService.sendMessage(
            request.getFromId(),
            request.getToId(),
            request.getContent()
        );
        return new ApiResponse<>(201, "message sent", msg);
    }
}
```

## 完整聊天后端 API 列表

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/users | 注册/创建用户 |
| GET | /api/users | 获取用户列表 |
| GET | /api/users/{id} | 获取用户详情 |
| PUT | /api/users/{id} | 更新用户 |
| DELETE | /api/users/{id} | 删除用户 |
| GET | /api/messages?userId=1 | 获取用户聊天记录 |
| POST | /api/messages | 发送消息 |
| PUT | /api/messages/{id}/read | 标记已读 |

## 测试 API

### 注册用户

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "张三", "email": "zhangsan@test.com", "password": "123456"}'
```

### 获取用户列表

```bash
curl http://localhost:8080/api/users
```

### 发送消息

```bash
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -d '{"fromId": 1, "toId": 2, "content": "你好！"}'
```

### 获取聊天记录

```bash
curl "http://localhost:8080/api/messages?userId=1"
```

### 标记已读

```bash
curl -X PUT http://localhost:8080/api/messages/1/read
```

## 练习任务

### 任务1：实现完整的聊天后端 Controller

1. 创建 UserController
2. 创建 MessageController
3. 创建对应的 DTO 类
4. 用 curl 或 Postman 测试所有接口

### 任务2：添加统一响应格式

把每个接口的返回值改为 `ApiResponse&lt;T&gt;` 格式。

## 自测题

### 题目1：@RestController 和 @Controller 的区别是什么？

A. @RestController = @Controller + @ResponseBody
B. @Controller = @RestController + @ResponseBody
C. 没有区别
D. @RestController 只能返回 JSON

<details>
<summary>查看答案</summary>

**答案：A** — @RestController = @Controller + @ResponseBody，返回值直接作为 HTTP 响应体。

</details>

### 题目2：为什么不用 Entity 直接作为请求/响应？

A. Entity 包含敏感字段（如密码）
B. Entity 包含 createdAt/updatedAt 等不应该让前端修改的字段
C. DTO 可以灵活调整，不依赖数据库结构
D. 以上全部

<details>
<summary>查看答案</summary>

**答案：D** — Entity 不应直接暴露给前端，应该用 DTO 解耦。

</details>

### 题目3：接收 POST 请求的 JSON 数据用什么注解？

A. @RequestParam
B. @PathVariable
C. @RequestBody
D. @RequestHeader

<details>
<summary>查看答案</summary>

**答案：C** — @RequestBody 用于接收 HTTP 请求体中的 JSON 数据。

</details>
