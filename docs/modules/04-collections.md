# 集合框架

## 学习目标

- 理解 Java 集合框架的作用
- 掌握 List、Set、Map 的区别和使用场景
- 了解 Stream API 和 Lambda 表达式
- 能在 Web 开发中正确使用集合

## 为什么需要集合框架？

在 C 语言中，你需要手动管理数组大小。Java 提供了集合框架来解决这个问题：

```java
// C 语言方式 — 固定大小
int arr[10];  // 最多存 10 个元素，多了就溢出

// Java 集合 — 动态扩容
List<String> list = new ArrayList<>();
list.add("第一个");  // 随时可以加
list.add("第二个");  // 自动扩容
```

## List — 有序可重复

```java
List<String> fruits = new ArrayList<>();
fruits.add("苹果");
fruits.add("香蕉");
fruits.add("橙子");

System.out.println(fruits.get(0));  // 苹果
System.out.println(fruits.size());  // 3
```

**特点：**
- 有序（插入顺序）
- 可重复
- 支持索引访问（get(0)）

**常用方法：**

| 方法 | 作用 |
|------|------|
| add(E e) | 添加元素 |
| get(int i) | 获取第 i 个元素 |
| remove(int i) | 删除第 i 个元素 |
| size() | 元素个数 |
| contains(Object o) | 是否包含某元素 |
| clear() | 清空所有元素 |

### ArrayList vs LinkedList

| 特性 | ArrayList | LinkedList |
|------|-----------|------------|
| 底层实现 | 数组 | 双向链表 |
| 随机访问 | 快（get(i)） | 慢（需要遍历） |
| 插入/删除 | 慢（需要移动元素） | 快（改指针） |
| 内存占用 | 少 | 多（每个节点需要额外指针） |

**Web 开发中的选择：** 绝大多数情况用 ArrayList。只有频繁在头尾插入删除时才用 LinkedList。

## Set — 无序不重复

```java
Set<String> tags = new HashSet<>();
tags.add("Java");
tags.add("Spring");
tags.add("Java");  // 重复，不会添加

System.out.println(tags.size());  // 2
```

**特点：**
- 不重复（自动去重）
- 无序（不保证插入顺序）
- 不支持索引访问

**常用 Set 类型：**

| 类型 | 特点 | 场景 |
|------|------|------|
| HashSet | 无序，最快 | 去重 |
| TreeSet | 有序（自然排序） | 需要排序 |
| LinkedHashSet | 保持插入顺序 | 需要顺序的去重 |

## Map — 键值对

```java
Map<String, Integer> ages = new HashMap<>();
ages.put("张三", 20);
ages.put("李四", 22);
ages.put("王五", 19);

System.out.println(ages.get("张三"));  // 20
System.out.println(ages.containsKey("李四"));  // true
System.out.println(ages.size());  // 3
```

**特点：**
- 键唯一，值可重复
- 通过键查找值（非常快）

**常用方法：**

| 方法 | 作用 |
|------|------|
| put(K key, V value) | 添加键值对 |
| get(Object key) | 根据键获取值 |
| remove(Object key) | 删除键值对 |
| containsKey(Object key) | 是否包含某键 |
| containsValue(Object value) | 是否包含某值 |
| keySet() | 获取所有键 |
| values() | 获取所有值 |

### HashMap 原理（面试常考）

```
HashMap 底层是一个数组（桶数组）

put("张三", 20):
1. 对 "张三" 计算哈希值 → 比如 12345
2. 对数组长度取模 → 12345 % 16 = 9
3. 放到索引 9 的位置

get("张三"):
1. 对 "张三" 计算哈希值 → 12345
2. 对数组长度取模 → 12345 % 16 = 9
3. 去索引 9 找 → 找到 "张三" → 20
```

**碰撞处理：** 如果两个键的哈希值取模后在同一位置，用链表/红黑树解决（Java 8 开始用红黑树优化）。

**面试要点：**
- HashMap 不是线程安全的
- 需要线程安全时用 ConcurrentHashMap
- loadFactor 默认 0.75，超过会扩容

## Stream API — 集合的函数式操作

```java
List<String> names = List.of("张三", "李四", "王五", "赵六");

// 过滤出名字长度 >= 2 的
List<String> result = names.stream()
    .filter(name -> name.length() >= 2)
    .collect(Collectors.toList());
// 结果: ["张三", "李四", "王五", "赵六"]

// 把所有名字转成大写
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// 求年龄总和
List<Integer> ages = List.of(20, 22, 19, 21);
int sum = ages.stream()
    .reduce(0, Integer::sum);
```

**常用 Stream 操作：**

| 操作 | 作用 | 示例 |
|------|------|------|
| filter | 过滤 | `filter(x -> x > 0)` |
| map | 转换 | `map(String::toUpperCase)` |
| sorted | 排序 | `sorted(Comparator.naturalOrder())` |
| distinct | 去重 | `distinct()` |
| limit | 限制数量 | `limit(10)` |
| count | 计数 | `count()` |
| collect | 收集结果 | `collect(Collectors.toList())` |
| reduce | 聚合 | `reduce(0, Integer::sum)` |

### Lambda 表达式基础

```java
// 传统写法
Comparator<String> comp = new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
};

// Lambda 写法
Comparator<String> comp = (a, b) -> a.length() - b.length();

// 方法引用（更简洁）
names.sort(Comparator.comparing(String::length));
```

## 在 Web 开发中的实际场景

### 场景1：缓存用户列表

```java
@RestController
public class UserController {
    // 用 Map 缓存用户数据（实际项目中用数据库）
    private Map<String, User> userCache = new HashMap<>();
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return new ArrayList<>(userCache.values());
    }
}
```

### 场景2：Stream 处理请求数据

```java
@GetMapping("/users/active")
public List<String> getActiveUserNames(List<User> users) {
    return users.stream()
        .filter(User::isActive)
        .map(User::getName)
        .sorted()
        .collect(Collectors.toList());
}
```

### 场景3：统计信息

```java
@GetMapping("/stats")
public Map<String, Integer> getStats(List<Order> orders) {
    return orders.stream()
        .collect(Collectors.groupingBy(
            Order::getStatus,
            Collectors.summingInt(Order::getAmount)
        ));
}
```

## 练习任务

### 任务1：使用 List

```java
@RestController
public class FruitController {
    private List<String> fruits = new ArrayList<>();
    
    @GetMapping("/fruits")
    public List<String> getFruits() {
        return fruits;
    }
    
    @PostMapping("/fruits")
    public String addFruit(@RequestParam String name) {
        fruits.add(name);
        return "Added: " + name;
    }
}
```

### 任务2：使用 Map

```java
@RestController
public class ScoreController {
    private Map<String, Integer> scores = new HashMap<>();
    
    @GetMapping("/score")
    public Integer getScore(@RequestParam String name) {
        return scores.getOrDefault(name, 0);
    }
    
    @PostMapping("/score")
    public String addScore(@RequestParam name, 
                           @RequestParam int score) {
        scores.put(name, score);
        return "Score saved: " + name + " -> " + score;
    }
}
```

### 任务3：使用 Stream

```java
@RestController
public class StreamController {
    @GetMapping("/filter")
    public List<String> filterNames() {
        List<String> names = List.of("Alice", "Bob", "Charlie", "David");
        return names.stream()
            .filter(n -> n.length() > 3)
            .collect(Collectors.toList());
    }
}
```

## 自测题

### 题目1：哪个集合不允许重复元素？

A. ArrayList
B. HashMap
C. HashSet
D. LinkedList

<details>
<summary>查看答案</summary>

**答案：C** — HashSet 不允许重复元素。

</details>

### 题目2：HashMap 的 get() 方法时间复杂度是多少？

A. O(1)
B. O(n)
C. O(log n)
D. O(n²)

<details>
<summary>查看答案</summary>

**答案：A** — 平均 O(1)，最坏 O(n)（所有键都碰撞到同一桶，Java 8 后用红黑树优化为 O(log n)）。

</details>

### 题目3：以下哪个 Stream 操作是终结操作？

A. filter()
B. map()
C. collect()
D. sorted()

<details>
<summary>查看答案</summary>

**答案：C** — collect() 是终结操作，会触发流的执行。filter、map、sorted 都是中间操作。

</details>
