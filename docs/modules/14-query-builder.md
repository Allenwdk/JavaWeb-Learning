# MyBatis Plus 条件构造器

## 学习目标

- 掌握 QueryWrapper 和 LambdaQueryWrapper 的用法
- 学会构建复杂的查询条件
- 能实现模糊查询、范围查询、排序等常用操作

## 条件构造器是什么？

条件构造器是 MyBatis Plus 提供的**链式查询 API**，不用手写 WHERE 子句。

```java
// 不用条件构造器 — 手写 SQL
SELECT * FROM users WHERE age > 18 AND status = 'active' ORDER BY name

// 用条件构造器 — Java 代码
wrapper.lambda()
    .gt(User::getAge, 18)
    .eq(User::getStatus, "active")
    .orderByAsc(User::getName);
```

## QueryWrapper vs LambdaQueryWrapper

### QueryWrapper（传统写法）

```java
QueryWrapper<User> wrapper = new QueryWrapper<>();
wrapper.gt("age", 18)      // WHERE age > 18
    .eq("status", "active") // AND status = 'active'
    .orderByDesc("created_at"); // ORDER BY created_at DESC
```

### LambdaQueryWrapper（推荐）

```java
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
wrapper.gt(User::getAge, 18)      // 不用写列名，用方法引用
    .eq(User::getStatus, "active")
    .orderByDesc(User::getCreatedAt);
```

**推荐 LambdaQueryWrapper：**
- 不用写列名字符串（避免拼写错误）
- 重构安全（字段改名自动报错）
- IDE 有自动补全

## 常用查询条件

### 精确查询

```java
// 单个条件
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>().eq(User::getStatus, "active")
);

// 多个条件（AND）
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .eq(User::getStatus, "active")
        .eq(User::getRole, "admin")
);
```

### 范围查询

```java
// 年龄 18 到 60 之间
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .ge(User::getAge, 18)    // >= 大于等于
        .le(User::getAge, 60)    // <= 小于等于
);

// 不在某个范围内
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .notIn(User::getStatus, "banned", "deleted")
);

// 某个 ID 范围内
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .in(User::getId, 1L, 2L, 3L)
);
```

### 模糊查询

```java
// 名字包含 "张"
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .like(User::getName, "张")
);

// 名字以 "张" 开头
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .likeLeft(User::getName, "张")  // %张
);

// 名字以 "张" 结尾
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .likeRight(User::getName, "张")  // 张%
);
```

### 排序

```java
// 按年龄降序，再按名字升序
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .orderByDesc(User::getAge)
        .orderByAsc(User::getName)
);
```

### OR 查询

```java
// status = 'active' OR age > 30
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .eq(User::getStatus, "active")
        .or()
        .gt(User::getAge, 30)
);

// 更复杂的：(status = 'active' AND role = 'admin') OR (status = 'active' AND age > 30)
List<User> users = userMapper.selectList(
    new LambdaQueryWrapper<User>()
        .nested(wrapper -> wrapper
            .eq(User::getStatus, "active")
            .eq(User::getRole, "admin")
        )
        .or()
        .nested(wrapper -> wrapper
            .eq(User::getStatus, "active")
            .gt(User::getAge, 30)
        )
);
```

## 分页查询

```java
// 第 1 页，每页 10 条
Page<User> page = new Page<>(1, 10);
Page<User> result = userMapper.selectPage(page,
    new LambdaQueryWrapper<User>()
        .eq(User::getStatus, "active")
        .orderByDesc(User::getCreatedAt)
);

// 获取分页结果
List<User> records = result.getRecords();  // 当前页数据
long total = result.getTotal();            // 总记录数
int pages = result.getPages();             // 总页数
long current = result.getCurrent();        // 当前页码
```

## 更新和删除条件

### 条件更新

```java
// 把所有 age > 30 的用户状态改为 "vips"
userMapper.update(
    null,  // 要更新的字段
    new LambdaUpdateWrapper<User>()
        .set(User::getStatus, "vips")  // SET status = 'vips'
        .gt(User::getAge, 30)          // WHERE age > 30
);
```

### 条件删除

```java
// 删除 status = 'deleted' 的用户
userMapper.delete(
    new LambdaQueryWrapper<User>()
        .eq(User::getStatus, "deleted")
);
```

## 在 Service 层中的应用

```java
@Service
public class DefaultUserService implements UserService {
    
    @Autowired
    private UserRepository userMapper;
    
    @Override
    public List<User> search(String keyword, int page, int size) {
        return userMapper.selectPage(
            new Page<>(page, size),
            new LambdaQueryWrapper<User>()
                .like(User::getName, keyword)
                .or()
                .like(User::getEmail, keyword)
                .orderByDesc(User::getCreatedAt)
        ).getRecords();
    }
    
    @Override
    public List<User> getActiveUsersOverAge(int minAge) {
        return userMapper.selectList(
            new LambdaQueryWrapper<User>()
                .eq(User::getStatus, "active")
                .ge(User::getAge, minAge)
                .orderByDesc(User::getCreatedAt)
        );
    }
}
```

## 练习任务

### 任务1：实现搜索功能

```java
@GetMapping("/api/users/search")
public List<User> search(@RequestParam String keyword) {
    return userService.search(keyword);
}

// Service 实现
public List<User> search(String keyword) {
    return userMapper.selectList(
        new LambdaQueryWrapper<User>()
            .like(User::getName, keyword)
            .or()
            .like(User::getEmail, keyword)
    );
}
```

### 任务2：实现分页查询

```java
@GetMapping("/api/users")
public Map<String, Object> getUsers(
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Page<User> result = userMapper.selectPage(
        new Page<>(page, size),
        new LambdaQueryWrapper<User>()
            .orderByDesc(User::getCreatedAt)
    );
    
    Map<String, Object> data = new HashMap<>();
    data.put("data", result.getRecords());
    data.put("total", result.getTotal());
    data.put("page", result.getCurrent());
    data.put("size", result.getSize());
    return data;
}
```

## 自测题

### 题目1：LambdaQueryWrapper 的 gt() 方法对应什么 SQL？

A. < 
B. <=
C. >
D. >=

<details>
<summary>查看答案</summary>

**答案：C** — gt() = greater than，对应 >。ge() 对应 >=。

</details>

### 题目2：likeRight() 生成的 SQL 是什么？

A. column LIKE '%张'
B. column LIKE '张%'
C. column LIKE '%张%'
D. column = '张'

<details>
<summary>查看答案</summary>

**答案：B** — likeRight() 右匹配（张%），likeLeft() 左匹配（%张），like() 全匹配（%张%）。

</details>

### 题目3：分页查询返回的 Page 对象中，哪个方法获取当前页数据？

A. getPage()
B. getRecords()
C. getData()
D. getList()

<details>
<summary>查看答案</summary>

**答案：B** — getRecords() 获取当前页数据。getTotal() 获取总记录数。

</details>
