# MySQL 连接

## 学习目标

- 理解 JDBC 连接数据库的原理
- 掌握 MyBatis Plus 连接 MySQL 的配置
- 能独立配置数据库连接

## JDBC 是什么？

JDBC（Java Database Connectivity）是 Java 连接数据库的**标准接口**。

**类比：** JDBC 就像电源插座的标准 — 不管哪个国家的电器（数据库），只要插头符合标准（JDBC 接口），就能插上用电（连接数据库）。

## 原生 JDBC 连接

```java
// 原生 JDBC — 需要写大量模板代码
String url = "jdbc:mysql://localhost:3306/chat_db";
String user = "root";
String password = "123456";

try (Connection conn = DriverManager.getConnection(url, user, password)) {
    String sql = "SELECT * FROM users WHERE id = ?";
    PreparedStatement ps = conn.prepareStatement(sql);
    ps.setLong(1, 1L);
    ResultSet rs = ps.executeQuery();

    if (rs.next()) {
        System.out.println(rs.getString("name"));
    }
}
```

问题：
1. 连接管理繁琐
2. 需要手动关闭资源
3. 结果集需要手动映射
4. 每次查询都要写同样代码

## MyBatis Plus 连接数据库

### 添加依赖

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

### 配置连接

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chat_db?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**url 参数说明：**

| 参数 | 作用 |
|------|------|
| useSSL=false | 不使用 SSL（本地开发） |
| serverTimezone=Asia/Shanghai | 设置时区，避免时间差 |
| characterEncoding=utf8mb4 | 设置字符编码 |

**注意：** MySQL 8.0+ 的 driver-class-name 是 `com.mysql.cj.jdbc.Driver`（不是旧的 `com.mysql.jdbc.Driver`）。

### 使用

```java
// 1. 创建实体类
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String email;
    private Integer age;
}

// 2. 创建 Mapper
@Repository
public interface UserRepository extends BaseMapper<User> {}

// 3. 注入使用
@Service
public class DefaultUserService implements UserService {
    @Autowired
    private UserRepository userMapper;

    public User findById(Long id) {
        return userMapper.selectById(id);  // 自动执行 SELECT
    }
}
```

## 连接池

MyBatis Plus 默认使用 HikariCP 连接池，不需要额外配置。

**连接池的作用：** 复用数据库连接，避免每次查询都建立新连接。

**可选配置：**

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10       # 最大连接数
      minimum-idle: 5              # 最小空闲连接
      connection-timeout: 30000    # 连接超时（毫秒）
      idle-timeout: 600000         # 空闲超时（毫秒）
```

## 常见错误

### 1. Access denied for user 'root'@'localhost'

```
java.sql.SQLException: Access denied for user 'root'@'localhost' (using password: YES)
```

**原因：** 用户名或密码错误。

**解决：** 检查 application.yml 中的 username 和 password 是否正确。

### 2. Unknown database 'chat_db'

```
java.sql.SQLException: Unknown database 'chat_db'
```

**原因：** 数据库不存在。

**解决：** 先创建数据库：`CREATE DATABASE chat_db;`

### 3. Server time zone warning

```
WARN: Establishing SSL connection without server's identity verification
```

**解决：** 在 url 中添加 `serverTimezone=Asia/Shanghai`。

### 4. Communications link failure

```
com.mysql.cj.exceptions.CCommunicationsException: Communications link failure
```

**原因：** MySQL 服务没有启动，或端口错误。

**解决：**
1. 检查 MySQL 是否运行：`mysql -u root -p`
2. 检查端口是否为 3306
3. 检查防火墙设置

### 5. Loading class `com.mysql.jdbc.Driver'

```
java.lang.ClassNotFoundException: com.mysql.jdbc.Driver
```

**原因：** MySQL 8.0+ 的驱动类名变了。

**解决：** 把 `driver-class-name` 改为 `com.mysql.cj.jdbc.Driver`。

## 测试连接

### 方式1：用 MySQL 命令行

```bash
mysql -u root -p -h localhost -P 3306
```

输入密码后能登录说明 MySQL 正常运行。

### 方式2：用 Spring Boot 测试

```java
@SpringBootTest
class ConnectionTest {
    @Autowired
    private UserRepository userMapper;

    @Test
    void testConnection() {
        List<User> users = userMapper.selectList(null);
        System.out.println("连接成功！共 " + users.size() + " 条记录");
    }
}
```

### 方式3：用 DBeaver 连接

1. 下载 DBeaver（免费数据库工具）
2. 新建连接 → MySQL
3. 填入主机、端口、用户名、密码
4. 测试连接

## 练习任务

### 任务1：配置数据库连接

1. 确保 MySQL 已安装并运行
2. 创建数据库：`CREATE DATABASE chat_db;`
3. 修改 application.yml 配置数据库连接
4. 运行 Spring Boot 项目，观察启动日志中的连接信息

### 任务2：创建测试表

```sql
USE chat_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    age INT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, age, status) VALUES
('张三', 'zhangsan@example.com', 20, 'active'),
('李四', 'lisi@example.com', 22, 'active'),
('王五', 'wangwu@example.com', 19, 'inactive');
```

### 任务3：查询测试

```java
@Autowired
private UserRepository userMapper;

// 查询所有用户
List<User> users = userMapper.selectList(null);
users.forEach(u -> System.out.println(u.getName()));

// 查询 active 状态的用户
List<User> activeUsers = userMapper.selectList(
    new LambdaQueryWrapper<User>().eq(User::getStatus, "active")
);
```

## 自测题

### 题目1：MySQL 8.0+ 的驱动类名是什么？

A. com.mysql.jdbc.Driver
B. com.mysql.cj.jdbc.Driver
C. org.mysql.jdbc.Driver
D. com.mysql8.jdbc.Driver

<details>
<summary>查看答案</summary>

**答案：B** — MySQL 8.0+ 的驱动类名是 com.mysql.cj.jdbc.Driver。

</details>

### 题目2：url 中 serverTimezone 的作用是什么？

A. 设置字符编码
B. 设置时区，避免时间差
C. 设置 SSL
D. 设置连接超时

<details>
<summary>查看答案</summary>

**答案：B** — serverTimezone 设置数据库服务器时区，避免插入时间数据时出现时差问题。

</details>

### 题目3：MyBatis Plus 默认使用什么连接池？

A. Druid
B. C3P0
C. HikariCP
D. Tomcat JDBC

<details>
<summary>查看答案</summary>

**答案：C** — Spring Boot 默认使用 HikariCP 作为连接池。

</details>
