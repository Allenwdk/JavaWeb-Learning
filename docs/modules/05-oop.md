# 面向对象实战

## 学习目标

- 理解面向对象编程的三大特性（封装、继承、多态）
- 掌握接口（Interface）在 Web 开发中的应用
- 理解包（Package）的组织方式
- 能在 Spring Boot 项目中正确使用 OOP

## 面向对象是什么？

面向对象（OOP）是一种编程思想：**把现实世界的事物抽象成代码**。

**类比：** 如果你要做一个"交通系统"，面向过程会写成 `driveCar()`、`flyPlane()`、`sailShip()` 三个独立函数。面向对象则定义 `Vehicle` 类，让汽车、飞机、船都继承它，共享 `move()` 方法。

## 三大特性

### 1. 封装 — 隐藏内部实现

```java
// 不好的设计 — 字段公开，任何人都能改
public class User {
    public String name;
    public int age;  // 有人可以设为 -100
}

// 好的设计 — 字段私有，通过方法控制
public class User {
    private String name;
    private int age;

    // 设置年龄时做验证
    public void setAge(int age) {
        if (age > 0 && age < 150) {
            this.age = age;
        }
    }

    public int getAge() {
        return age;
    }
}
```

**封装的好处：**
- 防止外部代码修改非法值
- 内部实现改变不影响外部调用者
- 便于添加日志、校验等逻辑

### 2. 继承 — 代码复用

```java
// 父类 — 通用行为
public class Animal {
    protected String name;

    public void eat() {
        System.out.println(name + " is eating");
    }
}

// 子类 — 继承父类，添加特有行为
public class Dog extends Animal {
    public void bark() {
        System.out.println(name + " says: Woof!");
    }
}

public class Cat extends Animal {
    public void meow() {
        System.out.println(name + " says: Meow!");
    }
}
```

**继承的注意事项：**
- Java 只支持单继承（一个类只能有一个父类）
- 用 `@Override` 标注重写的方法
- 优先使用组合而非继承

### 3. 多态 — 同一接口，不同实现

```java
public class Main {
    public static void main(String[] args) {
        Animal dog = new Dog();
        Animal cat = new Cat();

        dog.eat();  // Animal 的方法
        cat.eat();  // Animal 的方法

        // 多态 — 同一方法调用，不同行为
        makeSound(dog);  // Dog 的 bark()
        makeSound(cat);  // Cat 的 meow()
    }

    // 参数类型是 Animal，实际可以传入任何子类
    public static void makeSound(Animal animal) {
        if (animal instanceof Dog d) {
            d.bark();
        } else if (animal instanceof Cat c) {
            c.meow();
        }
    }
}
```

## 接口 — Web 开发的核心

接口定义"做什么"，不定义"怎么做"。

```java
// 接口 — 定义契约
public interface UserRepository {
    User findById(Long id);
    List<User> findAll();
    User save(User user);
    void delete(Long id);
}

// 实现类 — 具体实现
public class JdbcUserRepository implements UserRepository {
    @Override
    public User findById(Long id) {
        // 用 JDBC 查询数据库
        return null;
    }

    @Override
    public List<User> findAll() {
        // 用 JDBC 查询所有用户
        return List.of();
    }

    @Override
    public User save(User user) {
        // 用 JDBC 保存用户
        return user;
    }
}

// 另一个实现
public class RedisUserRepository implements UserRepository {
    @Override
    public User findById(Long id) {
        // 用 Redis 查询
        return null;
    }
    // ... 其他方法
}
```

**接口在 Spring Boot 中的应用：**

```java
@RestController
public class UserController {
    // 依赖接口，而不是具体实现
    private final UserRepository userRepository;

    // Spring 自动注入实现类
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id);
    }
}
```

**为什么用接口？**
- 可以更换实现（JDBC → MyBatis → Redis）而不改 Controller
- 方便测试（用 Mock 实现）
- 职责清晰（Controller 只管调用接口）

## 包 — 代码组织

```
com.example.chat/
├── controller/        # 控制器层
│   ├── UserController.java
│   └── MessageController.java
├── service/           # 业务逻辑层
│   ├── UserService.java
│   └── MessageService.java
├── repository/        # 数据访问层
│   ├── UserRepository.java
│   └── MessageRepository.java
├── model/             # 实体类
│   ├── User.java
│   └── Message.java
└── ChatApplication.java  # 启动类
```

**包命名规范：**
- 全小写
- 用公司域名倒序（com.example、org.springframework）
- 层名用单数（controller、service，不是 controllers）

## 在 Web 开发中的 OOP 实践

### 场景1：定义接口和实现

```java
// 接口
public interface MessageService {
    List<Message> getMessages(Long userId);
    Message sendMessage(Long fromId, Long toId, String content);
}

// 实现
@Service  // Spring 注解，标记这是一个 Service 实现
public class DefaultMessageService implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Override
    public List<Message> getMessages(Long userId) {
        return messageRepository.findByUserId(userId);
    }

    @Override
    public Message sendMessage(Long fromId, Long toId, String content) {
        Message msg = new Message();
        msg.setFromId(fromId);
        msg.setToId(toId);
        msg.setContent(content);
        return messageRepository.save(msg);
    }
}
```

### 场景2：Controller 依赖接口

```java
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{userId}")
    public List<Message> getMessages(@PathVariable Long userId) {
        return messageService.getMessages(userId);
    }

    @PostMapping
    public Message send(@RequestBody SendRequest request) {
        return messageService.sendMessage(
            request.getFromId(),
            request.getToId(),
            request.getContent()
        );
    }
}
```

## 练习任务

### 任务1：定义一个接口和实现

```java
// 定义接口
public interface ProductService {
    Product findById(Long id);
    List<Product> findAll();
    Product save(Product product);
}

// 定义实现
@Service
public class DefaultProductService implements ProductService {
    // 先用空实现
    @Override
    public Product findById(Long id) {
        return null;
    }

    @Override
    public List<Product> findAll() {
        return List.of();
    }

    @Override
    public Product save(Product product) {
        return product;
    }
}
```

### 任务2：创建 Controller 依赖接口

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.findById(id);
    }
}
```

## 自测题

### 题目1：Java 支持哪种继承？

A. 单继承
B. 多继承
C. 多重继承（接口）
D. A 和 C

<details>
<summary>查看答案</summary>

**答案：D** — Java 支持单继承（类只能有一个父类）和多重继承（接口可以有多个实现）。

</details>

### 题目2：封装的主要好处是什么？

A. 代码更短
B. 保护数据，防止非法修改
C. 提高运行速度
D. 支持多态

<details>
<summary>查看答案</summary>

**答案：B** — 封装通过私有字段和公共方法保护数据。

</details>

### 题目3：@Service 注解的作用是什么？

A. 标记这是一个业务逻辑类
B. 让类可以被 Spring 自动注入
C. 以上全部
D. 没有实际作用

<details>
<summary>查看答案</summary>

**答案：C** — @Service 标记业务逻辑类，同时让 Spring 容器管理这个 Bean。

</details>
