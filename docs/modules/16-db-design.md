# 聊天后端 — 数据库设计

## 学习目标

- 理解数据库设计的基本原则
- 掌握表结构设计的方法
- 能设计一个聊天系统的数据库

## 需求分析

一个聊天系统需要：
1. **用户** — 注册、登录、管理个人信息
2. **消息** — 发送、接收、存储聊天记录
3. **（可选）群组** — 群聊功能

## 表设计

### 用户表（users）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | BIGINT | 用户 ID | 主键，自增 |
| name | VARCHAR(50) | 用户名 | 非空 |
| email | VARCHAR(100) | 邮箱 | 唯一 |
| password | VARCHAR(255) | 密码（加密后） | 非空 |
| avatar | VARCHAR(500) | 头像 URL | 可为空 |
| status | VARCHAR(20) | 状态：active/inactive | 默认 'active' |
| created_at | TIMESTAMP | 注册时间 | 默认当前时间 |
| updated_at | TIMESTAMP | 更新时间 | 自动更新 |

```sql
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
```

### 消息表（messages）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | BIGINT | 消息 ID | 主键，自增 |
| from_id | BIGINT | 发送者 ID | 外键 → users.id |
| to_id | BIGINT | 接收者 ID | 外键 → users.id |
| content | VARCHAR(2000) | 消息内容 | 非空 |
| type | VARCHAR(20) | 消息类型：text/image/file | 默认 'text' |
| is_read | TINYINT(1) | 是否已读 | 默认 0 |
| created_at | TIMESTAMP | 发送时间 | 默认当前时间 |

```sql
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

### 索引设计

```sql
-- 快速查找用户发送的消息
CREATE INDEX idx_from_id ON messages(from_id);

-- 快速查找用户接收的消息
CREATE INDEX idx_to_id ON messages(to_id);

-- 快速查找用户发送和接收的消息（聊天记录）
CREATE INDEX idx_chat ON messages(from_id, to_id);

-- 邮箱登录
CREATE INDEX idx_email ON users(email);
```

## ER 图

```
┌──────────┐       ┌──────────┐
│  users   │       │ messages │
├──────────┤       ├──────────┤
│ id (PK)  │───┐   │ id (PK)  │
│ name     │   └──►│ from_id  │
│ email    │       │ to_id    │
│ password │       │ content  │
│ avatar   │       │ type     │
│ status   │       │ is_read  │
│ created_at│      │ created_at│
│ updated_at│      └──────────┘
└──────────┘
```

**关系：** 一个用户发送/接收多条消息（一对多）。

## 字段设计原则

### 1. 主键选择

| 策略 | 适用场景 | 示例 |
|------|----------|------|
| 自增 BIGINT | 传统关系型数据库 | users.id |
| 雪花算法 | 分布式系统 | 订单号 |
| UUID | 需要全局唯一 | 邀请码 |

**聊天项目用自增 BIGINT**，简单直接。

### 2. 时间字段

```sql
-- 创建时间：默认当前时间
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- 更新时间：自动更新（MySQL 5.6.5+）
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### 3. 字符串长度

| 字段 | 长度 | 理由 |
|------|------|------|
| name | 50 | 用户名足够 |
| email | 100 | 邮箱最大长度 |
| password | 255 | BCrypt 加密后 60 字符，留余量 |
| content | 2000 | 聊天消息限制 |
| avatar | 500 | URL 长度 |

### 4. 状态字段

用 VARCHAR 而不是 INT，便于阅读：

```sql
status VARCHAR(20) DEFAULT 'active'   -- 'active' / 'inactive' / 'banned'
type VARCHAR(20) DEFAULT 'text'       -- 'text' / 'image' / 'file'
```

## 练习任务

### 任务1：创建数据库和表

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

-- 创建索引
CREATE INDEX idx_from_id ON messages(from_id);
CREATE INDEX idx_to_id ON messages(to_id);
CREATE INDEX idx_email ON users(email);
```

### 任务2：插入测试数据

```sql
INSERT INTO users (name, email, password, status) VALUES
('张三', 'zhangsan@test.com', '123456', 'active'),
('李四', 'lisi@test.com', '123456', 'active'),
('王五', 'wangwu@test.com', '123456', 'active');

INSERT INTO messages (from_id, to_id, content) VALUES
(1, 2, '你好！', 0),
(2, 1, '你好！很高兴认识你', 1),
(1, 2, '今天天气不错', 1);
```

## 自测题

### 题目1：消息表中 from_id 和 to_id 是什么关系？

A. 没有关系
B. 一对多
C. 多对一
D. 都是外键指向 users 表

<details>
<summary>查看答案</summary>

**答案：D** — from_id 和 to_id 都是外键，都指向 users.id。

</details>

### 题目2：updated_at 的 ON UPDATE CURRENT_TIMESTAMP 作用是什么？

A. 创建时设置时间
B. 每次更新时自动更新时间
C. 删除时设置时间
D. 没有实际作用

<details>
<summary>查看答案</summary>

**答案：B** — ON UPDATE CURRENT_TIMESTAMP 让 MySQL 在记录更新时自动更新时间。

</details>

### 题目3：为什么 password 字段长度设为 255？

A. 随便选的
B. BCrypt 加密后固定 60 字符，留余量
C. 用户密码最长 255 字符
D. MySQL 限制

<details>
<summary>查看答案</summary>

**答案：B** — BCrypt 加密后的哈希值固定 60 字符，255 留有余量。

</details>
