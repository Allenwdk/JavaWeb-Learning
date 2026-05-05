# Servlet 与 Spring Boot

## 学习目标

- 理解 Servlet 是什么，它解决了什么问题
- 了解 Servlet 到 Spring Boot 的演进
- 理解为什么现在都用 Spring Boot 而不是原生 Servlet

## Servlet 是什么？

Servlet 是 Java 写的服务器端程序，运行在 Web 服务器上，用于处理 HTTP 请求。

**类比：** Servlet 就像餐厅的服务员 — 顾客（浏览器）点菜（请求），服务员把订单送到厨房（服务器），然后把做好的菜（响应）端给顾客。

### 第一个 Servlet

```java
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("text/html");
        PrintWriter out = resp.getWriter();
        out.println("<html><body><h1>Hello, World!</h1></body></html>");
    }
}
```

这段代码做了什么：
1. 继承 `HttpServlet` 类
2. 重写 `doGet` 方法处理 GET 请求
3. 设置响应类型为 HTML
4. 输出 HTML 内容

### Servlet 的问题

虽然 Servlet 能工作，但有很多缺点：

| 问题 | 说明 |
|------|------|
| 代码冗长 | 每个请求都要写几十行代码 |
| 配置复杂 | 需要在 web.xml 中配置映射关系 |
| 没有依赖注入 | 对象之间手动管理，难以维护 |
| 测试困难 | 需要启动整个服务器才能测试 |
| 版本过时 | Servlet 3.0 之后更新很慢 |

## Spring Boot 的诞生

Spring Boot 就是为了解决 Servlet 的这些问题而诞生的。

### Servlet vs Spring Boot 对比

| 特性 | Servlet | Spring Boot |
|------|---------|-------------|
| 创建响应 | 手动写 HTML 字符串 | 返回 JSON / View |
| URL 映射 | web.xml 配置 | 注解 `@GetMapping` |
| 依赖注入 | 需要手动管理 | Spring 容器自动管理 |
| 内嵌服务器 | 需要部署到 Tomcat | 自带 Tomcat，直接运行 |
| 配置 | web.xml + 注解 | application.yml |
| 启动速度 | 慢（需要启动 Tomcat） | 快（内嵌 Tomcat） |

### Spring Boot 版本对比

```java
// Servlet 方式 — 需要 50+ 行代码
public class UserController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.println("{\"name\": \"张三\", \"age\": 20}");
    }
}

// Spring Boot 方式 — 只需 5 行代码
@RestController
public class UserController {
    @GetMapping("/user")
    public Map<String, Object> getUser() {
        return Map.of("name", "张三", "age", 20);
    }
}
```

可以看到 Spring Boot 代码简洁了 10 倍以上。

## Spring Boot 为什么这么流行？

1. **内嵌 Tomcat** — 不需要单独安装服务器，`java -jar` 直接运行
2. **自动配置** — 不需要写 XML 配置文件，Spring Boot 自动帮你配好
3. **注解驱动** — 用 `@RestController`、`@GetMapping` 等注解代替 XML 配置
4. **starter 依赖** — Maven 里加一个依赖，所有需要的包都自动引入
5. **生态完善** — 有 MyBatis Plus、Spring Security 等大量生态支持

## 练习任务

### 任务：体验 Servlet 的繁琐

1. 创建一个 Java Web 项目（在 IDEA 中选择 File → New → Project → Web Application）
2. 创建一个 Servlet，输出 "Hello, World!"
3. 配置 web.xml（或在类上写 `@WebServlet` 注解）
4. 部署到 Tomcat，在浏览器访问

感受：写起来麻烦吗？配置复杂吗？

### 任务：创建一个 Spring Boot 项目

1. 访问 https://start.spring.io
2. 选择：
   - Build: Maven
   - Language: Java
   - Spring Boot: 最新稳定版
   - Dependencies: Spring Web
3. 点击 Generate 下载
4. 解压后导入 IDEA
5. 运行主类，访问 http://localhost:8080

## 自测题

### 题目1：Spring Boot 内嵌了哪个服务器？

A. Jetty
B. Tomcat
C. Undertow
D. Netty

<details>
<summary>查看答案</summary>

**答案：B** — Spring Boot 默认内嵌 Tomcat（也可切换为 Jetty 或 Undertow）。

</details>

### 题目2：以下哪个不是 Spring Boot 相比 Servlet 的优势？

A. 内嵌 Tomcat
B. 自动配置
C. 不需要写 Java 代码
D. starter 依赖

<details>
<summary>查看答案</summary>

**答案：C** — Spring Boot 仍然需要写 Java 代码，它只是简化了配置和部署。

</details>

### 题目3：在 Spring Boot 中，URL 映射用什么方式？

A. web.xml 配置
B. 注解（如 @GetMapping）
C. 配置文件
D. 数据库配置

<details>
<summary>查看答案</summary>

**答案：B** — Spring Boot 使用注解进行 URL 映射。

</details>
