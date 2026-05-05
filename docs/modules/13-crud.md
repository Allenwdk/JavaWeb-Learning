# MyBatis Plus 基本 CRUD

## 学习目标

- 掌握 MyBatis Plus 的增删改查操作
- 理解 Entity、Mapper、Service 三层的作用
- 能独立实现一个完整的 CRUD 接口

## 添加依赖

在 pom.xml 中添加：

```xml
<!-- MyBatis Plus -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.5</version>
</dependency>

<!-- MySQL 驱动 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 第一步：创建实体类

```java
package com.example.chat.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("users")  // 映射到 users 表
public class User {
    @TableId(type = IdType.AUTO)  // 自增主键
    private Long id;

    private String name;
    private String email;
    private Integer age;

    // getter/setter
    // 如果用 Lombok: @Data
}
```

**注解说明：**

| 注解 | 作用 |
|------|------|
| @TableName | 指定表名（类名和表名相同时可省略） |
| @TableId | 指定主键及策略 |
| @TableField | 指定字段名（字段名和列名相同时可省略） |

**主键策略：**

| 策略 | 说明 |
|------|------|
| IdType.AUTO | 数据库自增 |
| IdType.ASSIGN_ID | 雪花算法（Long 类型） |
| IdType.ASSIGN_UUID | 雪花算法生成 UUID |

## 第二步：创建 Mapper 接口

```java
package com.example.chat.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.chat.model.User;
import org.springframework.stereotype.Repository;

@Repository  // 数据访问层
public interface UserRepository extends BaseMapper<User> {
    // BaseMapper 已提供基本 CRUD：
    // selectById、selectList、insert、updateById、deleteById...
}
```

**BaseMapper 提供的方法：**

| 方法 | SQL | 说明 |
|------|-----|------|
| selectById(Serializable id) | SELECT * FROM table WHERE id = ? | 根据 ID 查询 |
| selectList(Wrapper<T> queryWrapper) | SELECT * FROM table ... | 根据条件查询列表 |
| insert(T entity) | INSERT INTO table ... | 新增 |
| updateById(T entity) | UPDATE table SET ... WHERE id = ? | 根据 ID 更新 |
| deleteById(Serializable id) | DELETE FROM table WHERE id = ? | 根据 ID 删除 |
| selectCount(T entity) | SELECT COUNT(*) FROM table ... | 查询数量 |

## 第三步：创建 Service 层

```java
// 接口
public interface UserService {
    User findById(Long id);
    List<User> findAll();
    User create(User user);
    User update(User user);
    void delete(Long id);
}

// 实现
@Service
public class DefaultUserService implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findById(Long id) {
        return userRepository.selectById(id);
    }

    @Override
    public List<User> findAll() {
        return userRepository.selectList(null);  // null = 查询所有
    }

    @Override
    public User create(User user) {
        userRepository.insert(user);
        return user;
    }

    @Override
    public User update(User user) {
        userRepository.updateById(user);
        return user;
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
```

## 第四步：创建 Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @GetMapping
    public List<User> list() {
        return userService.findAll();
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.update(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

## 配置数据库

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chat_db?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true  # 下划线转驼峰
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # 打印 SQL（开发用）
```

## 测试 CRUD

### 新增用户

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "张三", "email": "zhangsan@example.com", "age": 20}'
```

### 查询所有用户

```bash
curl http://localhost:8080/api/users
```

### 查询单个用户

```bash
curl http://localhost:8080/api/users/1
```

### 更新用户

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "张三", "email": "newemail@example.com", "age": 21}'
```

### 删除用户

```bash
curl -X DELETE http://localhost:8080/api/users/1
```

## 练习任务

### 任务1：实现一个 Product 的 CRUD

1. 创建 Product 实体类（id、name、price、stock）
2. 创建 ProductRepository
3. 创建 ProductService 和 DefaultProductService
4. 创建 ProductController
5. 测试所有 CRUD 接口

### 任务2：测试 SQL 打印

启动后观察控制台，MyBatis Plus 会打印每条 SQL：

```
==>  Preparing: SELECT id,name,email,age FROM users WHERE id=?
==> Parameters: 1(Long)
<==    Columns: id, name, email, age
<==        Row: 1, 张三, zhangsan@example.com, 20
<==      Total: 1
```

## 自测题

### 题目1：BaseMapper 的泛型是什么？

A. 数据库名
B. 实体类（Entity）
C. 表名
D. Mapper 接口名

<details>
<summary>查看答案</summary>

**答案：B** — BaseMapper<User> 的泛型是实体类 User。

</details>

### 题目2：查询所有用户，selectList 参数传什么？

A. new User()
B. null
C. ""
D. 1

<details>
<summary>查看答案</summary>

**答案：B** — selectList(null) 查询所有记录。

</details>

### 题目3：@TableId(type = IdType.AUTO) 表示什么？

A. UUID 主键
B. 手动设置主键
C. 数据库自增主键
D. 雪花算法主键

<details>
<summary>查看答案</summary>

**答案：C** — IdType.AUTO 表示主键由数据库自动生成（自增）。

</details>
