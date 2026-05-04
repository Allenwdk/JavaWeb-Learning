# HTTP 协议

## 学习目标

- 理解 HTTP 是什么
- 知道 HTTP 请求和响应的结构
- 理解常见的请求方法（GET、POST、PUT、DELETE）
- 理解常见的状态码（200、404、500）

## 什么是 HTTP？

HTTP（HyperText Transfer Protocol）是**浏览器和服务器之间通信的规则**。

类比：HTTP 就像快递单上的填写规则 — 发件人、收件人、物品描述、包装方式都有固定格式。

### HTTP 请求（浏览器 → 服务器）

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

请求由三部分组成：

1. **请求行** — `GET /index.html HTTP/1.1`
   - 方法：GET
   - 路径：/index.html
   - 协议版本：HTTP/1.1

2. **请求头** — 元数据
   - Host：服务器地址
   - User-Agent：浏览器信息

3. **请求体** — 可选，POST 请求时携带数据

### HTTP 响应（服务器 → 浏览器）

```
HTTP/1.1 200 OK
Content-Type: text/html

<html><body>Hello</body></html>
```

响应由三部分组成：

1. **状态行** — `HTTP/1.1 200 OK`
   - 协议版本：HTTP/1.1
   - 状态码：200
   - 状态描述：OK

2. **响应头** — Content-Type、Content-Length 等

3. **响应体** — 实际返回的内容（HTML、JSON 等）

## 常见请求方法

| 方法 | 作用 | 类比 |
|------|------|------|
| GET | 获取资源 | 查快递 |
| POST | 创建资源 | 寄快递 |
| PUT | 更新资源 | 修改快递信息 |
| DELETE | 删除资源 | 撤回快递 |

### GET vs POST 的区别

```java
// GET — 数据在 URL 中
GET /api/users?id=1

// POST — 数据在请求体中
POST /api/users
Content-Type: application/json

{"name": "张三", "age": 20}
```

**关键区别：**
- GET 参数在 URL 中可见，POST 在请求体中
- GET 可以缓存，POST 不可以
- POST 能发送更大数据

## 常见状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 301 | Moved Permanently | 永久重定向 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权（未登录） |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

## 练习任务

### 任务：用 curl 发送 HTTP 请求

在你的终端中执行：

```bash
# 发送 GET 请求
curl -v https://httpbin.org/get

# 发送 POST 请求
curl -v -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "age": 20}'
```

观察输出：
1. 找到请求行（`GET` 或 `POST`）
2. 找到请求头
3. 找到响应状态码
4. 找到响应体

### 任务：用浏览器开发者工具查看 HTTP 请求

1. 打开 Chrome 浏览器
2. 访问任意网站
3. 按 `F12` 打开开发者工具
4. 点击 **Network** 标签
5. 刷新页面
6. 点击任意请求，查看 Request Headers 和 Response Headers

## 自测题

### 题目1：以下哪个状态码表示"资源不存在"？

A. 200
B. 404
C. 500
D. 301

<details>
<summary>查看答案</summary>

**答案：B** — 404 Not Found 表示请求的资源不存在。

</details>

### 题目2：GET 和 POST 的主要区别是什么？

A. GET 比 POST 快
B. GET 参数在 URL 中，POST 在请求体中
C. GET 不能带参数
D. POST 只能发送 JSON 数据

<details>
<summary>查看答案</summary>

**答案：B** — GET 参数在 URL 中可见，POST 数据在请求体中。

</details>

### 题目3：创建一个新用户，应该用哪个 HTTP 方法？

A. GET
B. POST
C. PUT
D. DELETE

<details>
<summary>查看答案</summary>

**答案：B** — POST 用于创建新资源。

</details>
