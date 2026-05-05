# 项目部署基础

## 学习目标

- 理解部署的概念
- 掌握 Spring Boot 打包和运行的方法
- 了解基本的部署流程

## 什么是部署？

部署就是把开发好的项目放到服务器上，让其他人能访问。

**类比：** 你在家里写了一道菜（开发），部署就是把这道菜放到餐厅的厨房里（服务器），让客人（用户）能吃到。

## 本地开发 vs 生产环境

| 对比项 | 本地开发 | 生产环境 |
|--------|----------|----------|
| 运行位置 | 本地电脑 | 云服务器 |
| 端口 | 8080 | 80/443 |
| 数据库 | 本地 MySQL | 远程 MySQL |
| 访问者 | 只有你 | 所有用户 |
| 配置 | application-dev.yml | application-prod.yml |

## 打包

### Maven 打包

```bash
mvn clean package -DskipTests
```

`-DskipTests` 跳过测试（生产打包时加快速度）。

打包成功后，在 target 目录下生成 jar 包：

```
target/chat-backend-0.0.1-SNAPSHOT.jar
```

### 运行 jar 包

```bash
java -jar target/chat-backend-0.0.1-SNAPSHOT.jar
```

## 配置文件分离

### 方式1：命令行参数

```bash
java -jar chat-backend.jar --spring.profiles.active=prod
```

### 方式2：环境变量

```bash
export DB_PASSWORD=secret123
java -jar chat-backend.jar
```

在 application.yml 中引用：

```yaml
spring:
  datasource:
    password: ${DB_PASSWORD}
```

## 部署到云服务器

### 1. 准备服务器

需要：
- 一台云服务器（阿里云、腾讯云等）
- SSH 登录权限
- root 或 sudo 权限

### 2. 安装 Java

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# 验证
java -version
```

### 3. 安装 MySQL（或连接远程数据库）

```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 4. 创建数据库

```sql
CREATE DATABASE chat_db CHARACTER SET utf8mb4;
```

### 5. 上传 jar 包

```bash
scp target/chat-backend-0.0.1-SNAPSHOT.jar user@server:/opt/app/
```

### 6. 运行

```bash
cd /opt/app
java -jar chat-backend.jar \
  --spring.profiles.active=prod \
  --server.port=8080
```

### 7. 配置防火墙

```bash
# Ubuntu
sudo ufw allow 8080/tcp
sudo ufw enable
```

## 后台运行

### 使用 nohup

```bash
nohup java -jar chat-backend.jar > app.log 2>&1 &
```

- `nohup` — 后台运行，关闭终端不退出
- `> app.log` — 日志输出到文件
- `2>&1` — 错误日志也输出到文件
- `&` — 后台运行

### 查看日志

```bash
tail -f app.log      # 实时查看日志
tail -n 100 app.log  # 查看最后 100 行
```

### 停止进程

```bash
# 查找进程
ps aux | grep chat-backend
# 杀死进程
kill -9 <PID>
```

## 用 systemd 管理（推荐）

创建服务文件：

```ini
# /etc/systemd/system/chat-backend.service
[Unit]
Description=Chat Backend Service
After=network.target

[Service]
User=www-data
ExecStart=/usr/bin/java -jar /opt/app/chat-backend.jar
SuccessExitStatus=143
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl start chat-backend
sudo systemctl enable chat-backend  # 开机自启
sudo systemctl status chat-backend  # 查看状态
sudo systemctl logs chat-backend    # 查看日志
```

## 部署检查清单

- [ ] 数据库已创建并导入数据
- [ ] application.yml 配置了生产环境参数
- [ ] 数据库密码使用环境变量（不硬编码）
- [ ] 服务器防火墙开放了端口
- [ ] jar 包已上传到服务器
- [ ] Java 已安装
- [ ] 服务已启动
- [ ] 用 curl 测试接口是否正常
- [ ] 配置了日志输出
- [ ] 配置了自动重启

## 练习任务

### 任务1：打包并本地测试

```bash
mvn clean package -DskipTests
java -jar target/chat-backend-0.0.1-SNAPSHOT.jar
curl http://localhost:8080/api/users
```

### 任务2：用 nohup 后台运行

```bash
nohup java -jar chat-backend.jar > app.log 2>&1 &
tail -f app.log
```

## 自测题

### 题目1：Maven 打包时跳过测试用什么参数？

A. -DnoTests
B. -DskipTests
C. -Dtest=none
D. --skip

<details>
<summary>查看答案</summary>

**答案：B** — `-DskipTests` 跳过测试。

</details>

### 题目2：nohup 命令的作用是什么？

A. 前台运行
B. 后台运行，关闭终端不退出
C. 停止进程
D. 查看日志

<details>
<summary>查看答案</summary>

**答案：B** — nohup 让进程在后台运行，关闭终端后不退出。

</details>

### 题目3：systemd 服务中 Restart=always 的作用是什么？

A. 服务崩溃时自动重启
B. 每次启动都重启
C. 不需要
D. 删除服务

<details>
<summary>查看答案</summary>

**答案：A** — Restart=always 让 systemd 在服务退出时自动重启。

</details>
