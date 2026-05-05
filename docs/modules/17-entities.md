# 聊天后端 — 实体类编写

## 学习目标

- 掌握 MyBatis Plus 实体类的编写方法
- 理解 @TableName、@TableId、@TableField 的使用
- 能用 Lombok 简化实体类代码

## 创建实体类

### User.java

```java
package com.example.chat.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@TableName("users")  // 映射到 users 表
@Data  // Lombok：自动生成 getter/setter/toString/equals/hashCode
public class User {

    @TableId(type = IdType.AUTO)  // 自增主键
    private Long id;

    private String name;
    private String email;

    // 密码不映射到数据库字段（敏感信息）
    private String password;

    private String avatar;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Message.java

```java
package com.example.chat.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@TableName("messages")
@Data
public class Message {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long fromId;
    private Long toId;
    private String content;
    private String type;
    private Boolean isRead;

    private LocalDateTime createdAt;
}
```

## 注解详解

### @TableName

```java
@TableName("users")  // 类名 User → 表名 users（自动匹配时可省略）
```

**什么时候可以省略？**
- 类名和表名一致（User → users，Message → messages）
- MyBatis Plus 自动转换

**什么时候需要写？**
- 表名和类名不一致：`@TableName("t_user")`
- 有前缀/后缀：`@TableName("t_user")`

### @TableId

```java
@TableId(type = IdType.AUTO)     // 自增主键
@TableId(type = IdType.ASSIGN_ID) // 雪花算法（Long）
@TableId(type = IdType.ASSIGN_UUID) // UUID
```

**主键策略选择：**

| 场景 | 策略 | 原因 |
|------|------|------|
| 单数据库 | AUTO | 简单可靠 |
| 分布式系统 | ASSIGN_ID | 避免自增冲突 |
| 需要全局唯一 | ASSIGN_UUID | UUID 全局唯一 |

### @TableField

```java
@TableField("user_name")  // 字段名和列名不一致时指定
private String name;
```

**什么时候需要写？**
- 字段名和列名不一致：`name` → `user_name`
- 配合 `map-underscore-to-camel-case: true` 可以省略

## Lombok 简化代码

### 添加依赖

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

### Lombok 注解速查

| 注解 | 作用 | 适用场景 |
|------|------|----------|
| @Data | 自动生成 getter/setter/toString/equals/hashCode | 实体类、DTO |
| @Getter | 只生成 getter | 不可变对象 |
| @Setter | 只生成 setter | 需要修改的字段 |
| @ToString | 只生成 toString | 调试用 |
| @NoArgsConstructor | 无参构造器 | JPA 需要 |
| @AllArgsConstructor | 全参构造器 | 不可变对象 |
| @Builder | 建造者模式 | 复杂对象 |
| @Slf4j | 注入 Logger | Service/Controller |

### 使用示例

```java
// 不用 Lombok — 50+ 行
public class User {
    private String name;
    private Integer age;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    @Override
    public String toString() { return "User{name=" + name + ", age=" + age + "}"; }

    @Override
    public boolean equals(Object o) { /* ... */ }

    @Override
    public int hashCode() { /* ... */ }
}

// 用 Lombok — 1 行
@Data
public class User {
    private String name;
    private Integer age;
}
```

## IDEA 配置 Lombok

1. File → Settings → Plugins → 搜索 "Lombok" → 安装
2. File → Settings → Compiler → Annotation Processors → 勾选 "Enable annotation processing"
3. 重启 IDEA

## 练习任务

### 任务1：创建 User 实体类

1. 在 model 包下创建 User.java
2. 添加 @TableName、@TableId、@Data 注解
3. 添加所有字段
4. 在 IDEA 中运行，观察 Lombok 是否生效（右键 → Generate 应该没有 getter/setter）

### 任务2：创建 Message 实体类

```java
@TableName("messages")
@Data
public class Message {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long fromId;
    private Long toId;
    private String content;
    private String type;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
```

## 自测题

### 题目1：@TableName 什么时候可以省略？

A. 任何时候都可以省略
B. 类名和表名一致时可以省略
C. 只有用 Lombok 时可以省略
D. 不能省略

<details>
<summary>查看答案</summary>

**答案：B** — 类名和表名一致时（User → users），MyBatis Plus 自动转换，可以省略。

</details>

### 题目2：@Data 注解不包含哪个方法？

A. getter/setter
B. toString
C. main
D. equals/hashCode

<details>
<summary>查看答案</summary>

**答案：C** — @Data 生成 getter/setter、toString、equals/hashCode，不生成 main 方法。

</details>

### 题目3：分布式系统应该用哪种主键策略？

A. IdType.AUTO
B. IdType.ASSIGN_ID（雪花算法）
C. IdType.ASSIGN_UUID
D. 手动设置

<details>
<summary>查看答案</summary>

**答案：B** — 雪花算法在分布式系统中避免自增冲突，且性能优于 UUID。

</details>
