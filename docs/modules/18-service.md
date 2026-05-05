# 聊天后端 — Service 层

## 学习目标

- 掌握 Service 接口和实现类的编写
- 理解事务管理 @Transactional
- 能实现业务逻辑

## Service 层职责

```
Controller（接收请求）
    │
    ▼
Service（业务逻辑） ← 这一节
    │
    ▼
Repository（数据库操作）
```

**Service 层做什么？**
- 业务逻辑处理（校验、转换、计算）
- 事务管理（@Transactional）
- 调用多个 Repository 协调操作

## 创建 Service 接口

```java
package com.example.chat.service;

import com.example.chat.model.User;
import java.util.List;

public interface UserService {
    User findById(Long id);
    User findByEmail(String email);
    List<User> findAll();
    User create(String name, String email, String password);
    User update(Long id, String name, String email);
    void delete(Long id);
}
```

**为什么用接口？**
- 方便更换实现（DefaultUserService → MockUserService）
- 方便测试（注入 Mock 实现）
- 职责清晰（接口定义契约）

## 创建 Service 实现

```java
package com.example.chat.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.chat.model.User;
import com.example.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service  // 标记为 Spring Service Bean
@Transactional  // 所有方法自动开启事务
public class DefaultUserService implements UserService {

    @Autowired
    private UserRepository userMapper;

    @Override
    public User findById(Long id) {
        return userMapper.selectById(id);
    }

    @Override
    public User findByEmail(String email) {
        return userMapper.selectOne(
            new LambdaQueryWrapper<User>().eq(User::getEmail, email)
        );
    }

    @Override
    public List<User> findAll() {
        return userMapper.selectList(
            new LambdaQueryWrapper<User>()
                .orderByDesc(User::getCreatedAt)
        );
    }

    @Override
    @Transactional  // 覆盖类级别的 @Transactional
    public User create(String name, String email, String password) {
        // 1. 校验
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("邮箱不能为空");
        }

        // 2. 检查邮箱是否已存在
        User existing = findByEmail(email);
        if (existing != null) {
            throw new IllegalArgumentException("邮箱已注册");
        }

        // 3. 创建用户
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);  // 实际项目中需要加密
        user.setStatus("active");

        userMapper.insert(user);
        return user;
    }

    @Override
    public User update(Long id, String name, String email) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new IllegalArgumentException("用户不存在");
        }

        user.setName(name);
        user.setEmail(email);
        userMapper.updateById(user);
        return user;
    }

    @Override
    public void delete(Long id) {
        userMapper.deleteById(id);
    }
}
```

## @Transactional 事务管理

### 什么时候需要事务？

当**一个操作涉及多条数据库语句**时，需要事务保证一致性：

```java
@Transactional
public Message sendMessage(Long fromId, Long toId, String content) {
    // 1. 检查发送者是否存在
    User from = userMapper.selectById(fromId);
    if (from == null) throw new IllegalArgumentException("发送者不存在");

    // 2. 检查接收者是否存在
    User to = userMapper.selectById(toId);
    if (to == null) throw new IllegalArgumentException("接收者不存在");

    // 3. 保存消息（两条 INSERT 语句）
    Message msg = new Message();
    msg.setFromId(fromId);
    msg.setToId(toId);
    msg.setContent(content);
    messageMapper.insert(msg);

    // 4. 更新发送者的消息计数（额外操作）
    // ...

    return msg;  // 全部成功或全部失败
}
```

### 事务传播行为

```java
@Transactional(propagation = Propagation.REQUIRED)     // 默认：有事务就加入，没有就新建
@Transactional(propagation = Propagation.REQUIRES_NEW) // 总是新建事务（不受外层事务影响）
@Transactional(propagation = Propagation.NESTED)       // 嵌套事务（保存点）
```

**大多数情况用默认 REQUIRED 即可。**

### 事务回滚

```java
@Transactional(rollbackFor = Exception.class)  // 所有异常都回滚
public User create(String name, String email, String password) {
    // 任何异常都会回滚事务
}
```

**默认行为：** 只回滚 RuntimeException，不回滚 Checked Exception。

## MessageService 示例

```java
// 接口
public interface MessageService {
    List<Message> getMessages(Long userId);
    Message sendMessage(Long fromId, Long toId, String content);
    void markAsRead(Long messageId);
}

// 实现
@Service
public class DefaultMessageService implements MessageService {

    @Autowired
    private MessageRepository messageMapper;

    @Autowired
    private UserRepository userMapper;

    @Override
    public List<Message> getMessages(Long userId) {
        // 获取与 userId 相关的所有消息（发送或接收）
        return messageMapper.selectList(
            new LambdaQueryWrapper<Message>()
                .eq(Message::getFromId, userId)
                .or()
                .eq(Message::getToId, userId)
                .orderByAsc(Message::getCreatedAt)
        );
    }

    @Override
    @Transactional
    public Message sendMessage(Long fromId, Long toId, String content) {
        // 校验
        User from = userMapper.selectById(fromId);
        User to = userMapper.selectById(toId);
        if (from == null || to == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        if (content == null || content.isEmpty()) {
            throw new IllegalArgumentException("消息内容不能为空");
        }
        if (content.length() > 2000) {
            throw new IllegalArgumentException("消息内容不能超过 2000 字");
        }

        // 保存
        Message msg = new Message();
        msg.setFromId(fromId);
        msg.setToId(toId);
        msg.setContent(content);
        msg.setType("text");
        msg.setIsRead(false);
        messageMapper.insert(msg);
        return msg;
    }

    @Override
    public void markAsRead(Long messageId) {
        messageMapper.update(
            null,
            new LambdaUpdateWrapper<Message>()
                .set(Message::getIsRead, true)
                .eq(Message::getId, messageId)
        );
    }
}
```

## 练习任务

### 任务1：创建 UserService 接口和实现

1. 创建 UserService 接口
2. 创建 DefaultUserService 实现
3. 实现 findById、findAll、create 方法
4. 添加业务校验逻辑

### 任务2：创建 MessageService

1. 创建 MessageService 接口
2. 创建 DefaultMessageService 实现
3. 实现 sendMessage 方法，包含事务管理

## 自测题

### 题目1：@Service 注解的作用是什么？

A. 标记这是一个 Service 类
B. 让 Spring 管理这个类的 Bean 生命周期
C. 以上全部
D. 没有实际作用

<details>
<summary>查看答案</summary>

**答案：C** — @Service 标记业务逻辑类，同时让 Spring 容器管理这个 Bean。

</details>

### 题目2：@Transactional 默认回滚哪种异常？

A. 所有异常
B. 只回滚 RuntimeException
C. 只回滚 Exception
D. 不回滚任何异常

<details>
<summary>查看答案</summary>

**答案：B** — @Transactional 默认只回滚 RuntimeException，Checked Exception 不回滚。

</details>

### 题目3：Service 层和 Controller 层的区别是什么？

A. Service 处理业务逻辑，Controller 处理 HTTP 请求
B. Service 返回 JSON，Controller 返回视图
C. Service 用 @RestController，Controller 用 @Service
D. 没有区别

<details>
<summary>查看答案</summary>

**答案：A** — Service 层处理业务逻辑和事务，Controller 层处理 HTTP 请求和响应。

</details>
