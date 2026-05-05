# ORM 概念

## 学习目标

- 理解什么是 ORM
- 了解为什么要用 ORM 框架
- 理解 MyBatis Plus 在 ORM 生态中的位置

## 什么是 ORM？

ORM（Object-Relational Mapping，对象关系映射）是**把数据库表映射成 Java 对象**的技术。

**类比：** 如果你要操作一个仓库，传统方式需要手写 SQL（搬运指令）。ORM 框架就像一个自动搬运机器人 — 你告诉它"拿取 User 对象"，它自动帮你生成 SQL 去数据库取数据。

## 没有 ORM 的日子

```java
// 传统 JDBC 方式 — 需要写大量模板代码
public User findById(Long id) throws SQLException {
    Connection conn = DriverManager.getConnection(url, user, pass);
    PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
    ps.setLong(1, id);
    ResultSet rs = ps.executeQuery();

    User user = null;
    if (rs.next()) {
        user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setAge(rs.getInt("age"));
        user.setEmail(rs.getString("email"));
    }

    rs.close();
    ps.close();
    conn.close();
    return user;
}
```

问题：
1. 需要手动管理连接（Connection）
2. 需要手动映射结果集（ResultSet → Object）
3. 需要手动关闭资源
4. 每个方法都要写同样的模板代码

## 用 MyBatis Plus 后

```java
// MyBatis Plus — 继承 BaseMapper 就有基本 CRUD
public interface UserRepository extends BaseMapper<User> {
    // 零代码！selectById 已经提供了
}

// 使用
User user = userRepository.selectById(1L);
```

一行代码都不用写，就能查询数据库！

## ORM 框架对比

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| Hibernate | 全自动 ORM，对象→SQL 自动转换 | 大型项目，不手写 SQL |
| MyBatis | 半自动 ORM，手写 SQL 但简化映射 | 需要灵活 SQL 的项目 |
| MyBatis Plus | MyBatis 的增强版，CRUD 零代码 | 快速开发，兼顾灵活 |

### Hibernate vs MyBatis

```java
// Hibernate 方式 — 完全自动（对象转 SQL）
User user = session.get(User.class, 1L);  // 自动转 SELECT

// MyBatis 方式 — 手写 SQL（但简化了结果映射）
// mapper.xml
<select id="findById" resultType="User">
    SELECT * FROM users WHERE id = #{id}
</select>

// MyBatis Plus 方式 — 零代码（继承就有）
User user = userRepository.selectById(1L);
```

## MyBatis Plus 的优势

| 特性 | MyBatis | MyBatis Plus |
|------|---------|-------------|
| 基本 CRUD | 需要写 SQL | 零代码（BaseMapper） |
| 条件构造 | 手写 WHERE | Wrapper 链式调用 |
| 分页 | 手写 LIMIT | Page 对象自动分页 |
| 代码生成 | 无 | 自动生成 Entity、Mapper、Service、Controller |
| 性能监控 | 无 | SQL 执行时间统计 |

## 数据库准备

在开始之前，先创建数据库和表：

```sql
CREATE DATABASE chat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE chat_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_id BIGINT NOT NULL,
    to_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 练习任务

### 任务1：安装 MySQL

1. 下载 MySQL 8.0（https://dev.mysql.com/downloads/mysql/）
2. 安装并记住 root 密码
3. 安装 MySQL 图形工具（推荐 MySQL Workbench 或 DBeaver）

### 任务2：创建数据库

```sql
CREATE DATABASE chat_db;
USE chat_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    age INT
);
```

### 任务3：插入测试数据

```sql
INSERT INTO users (name, email, age) VALUES
('张三', 'zhangsan@example.com', 20),
('李四', 'lisi@example.com', 22),
('王五', 'wangwu@example.com', 19);
```

## 自测题

### 题目1：ORM 的全称是什么？

A. Object-Relational Mapping
B. Object-Resource Mapping
C. Operational-Relational Mapping
D. Object-Run-Time Mapping

<details>
<summary>查看答案</summary>

**答案：A** — ORM = Object-Relational Mapping（对象关系映射）。

</details>

### 题目2：MyBatis Plus 相比 MyBatis 的主要优势是什么？

A. 速度更快
B. CRUD 零代码
C. 不需要数据库
D. 支持 NoSQL

<details>
<summary>查看答案</summary>

**答案：B** — MyBatis Plus 继承 BaseMapper 就自带基本 CRUD，零代码。

</details>

### 题目3：Hibernate 和 MyBatis 的区别是什么？

A. Hibernate 全自动，MyBatis 手写 SQL
B. Hibernate 手写 SQL，MyBatis 全自动
C. 没有区别
D. Hibernate 只能用于 Oracle

<details>
<summary>查看答案</summary>

**答案：A** — Hibernate 自动对象→SQL 转换，MyBatis 需要手写 SQL 但简化了结果映射。

</details>
