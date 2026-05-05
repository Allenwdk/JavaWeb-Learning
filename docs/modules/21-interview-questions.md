# 常见面试问题

## 学习目标

- 掌握科技协会面试中常见的 Java Web 问题
- 理解每个问题的核心考点
- 能用简洁的语言回答

## HTTP 相关

### Q1：HTTP 和 HTTPS 的区别是什么？

**答：** HTTPS = HTTP + SSL/TLS 加密。HTTPS 传输的是加密数据，HTTP 是明文。HTTPS 需要 SSL 证书，默认端口 443。

### Q2：GET 和 POST 的区别？

**答：**
- GET 参数在 URL 中，POST 在请求体中
- GET 可缓存，POST 不可缓存
- GET 有 URL 长度限制，POST 没有
- GET 幂等（重复请求结果一样），POST 不幂等

### Q3：常见状态码有哪些？

**答：**
- 200 OK — 请求成功
- 201 Created — 资源创建成功
- 301 Moved Permanently — 永久重定向
- 400 Bad Request — 请求参数错误
- 401 Unauthorized — 未授权
- 403 Forbidden — 禁止访问
- 404 Not Found — 资源不存在
- 500 Internal Server Error — 服务器内部错误

### Q4：什么是 RESTful？

**答：** RESTful 是一种 API 设计风格，用名词表示资源，用 HTTP 方法表示操作。GET 获取、POST 创建、PUT 更新、DELETE 删除。

## Spring Boot 相关

### Q5：@RestController 和 @Controller 的区别？

**答：** @RestController = @Controller + @ResponseBody。@Controller 返回视图名，@RestController 直接返回数据（JSON）。

### Q6：Spring Boot 自动配置原理？

**答：** @SpringBootApplication 包含 @EnableAutoConfiguration，Spring Boot 根据 classpath 中的依赖自动配置。比如发现 mysql-connector 就自动配置数据源。

### Q7：Spring Boot 内嵌了什么服务器？

**答：** 默认内嵌 Tomcat。也可以切换为 Jetty 或 Undertow。

### Q8：@Autowired 有几种注入方式？

**答：** 3 种：构造器注入（推荐）、字段注入（@Autowired 字段）、Setter 注入。构造器注入不可变、便于测试。

### Q9：@Transactional 默认回滚什么异常？

**答：** 默认只回滚 RuntimeException。Checked Exception 不回滚，除非配置 rollbackFor = Exception.class。

## MyBatis Plus 相关

### Q10：MyBatis 和 MyBatis Plus 的区别？

**答：** MyBatis Plus 是 MyBatis 的增强版。继承 BaseMapper 就有基本 CRUD，不需要写 SQL。还提供 Wrapper 条件构造器、分页等增强功能。

### Q11：BaseMapper 提供了哪些方法？

**答：** selectById、selectList、insert、updateById、deleteById、selectCount 等基本 CRUD 方法。

### Q12：LambdaQueryWrapper 和 QueryWrapper 的区别？

**答：** LambdaQueryWrapper 用方法引用（User::getName）代替字符串列名，重构安全、有自动补全。QueryWrapper 需要写列名字符串。

## 数据库相关

### Q13：什么是索引？为什么用索引？

**答：** 索引是数据库的查找加速机制，类似书的目录。没有索引时数据库要全表扫描，有索引时可以快速定位。

### Q14：JOIN 有几种类型？

**答：**
- INNER JOIN — 两表都匹配的记录
- LEFT JOIN — 左表全部 + 右表匹配
- RIGHT JOIN — 右表全部 + 左表匹配

### Q15：什么是事务？事务的 ACID 特性？

**答：** 事务是一组原子操作。ACID：
- Atomicity（原子性）— 全部成功或全部失败
- Consistency（一致性）— 事务前后数据一致
- Isolation（隔离性）— 事务之间互不干扰
- Durability（持久性）— 提交后永久保存

## 项目相关

### Q16：你的聊天后端项目是怎么设计的？

**答：** 三层架构：Controller 层处理 HTTP 请求，Service 层处理业务逻辑，Repository 层操作数据库。数据库用 MySQL，ORM 用 MyBatis Plus。

### Q17：为什么用三层架构？

**答：** 职责分离：Controller 只管请求响应，Service 只管业务逻辑，Repository 只管数据库。每层独立，便于维护和测试。

### Q18：如果用户量很大，你的系统怎么优化？

**答：**
- 加缓存（Redis）
- 数据库读写分离
- 消息队列异步处理
- 接口加索引
- 分页查询

## 练习

### 任务1：口头回答所有问题

1. 遮住答案，口头回答每个问题
2. 回答不出的标记下来
3. 再看答案，补充记忆
4. 重复直到能流畅回答

### 任务2：模拟面试

找一个同学，互相提问面试问题，模拟真实面试场景。

## 面试技巧

1. **遇到不会的问题** — 诚实说不会，但尝试给出自己的思路
2. **回答结构化** — 先说结论，再展开解释
3. **举例说明** — 结合项目经验回答
4. **不要紧张** — 科技协会面试是学习性质的，不是公司面试
