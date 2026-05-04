import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'JavaWeb 学习路线',
  description: '从零基础到手写聊天后端 — 大一学生友好',
  lang: 'zh-CN',

  // Ignore dead links referencing localhost (internal plan docs)
  ignoreDeadLinks: [/\blocalhost\b/],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '学习路线', link: '/modules/intro' },
    ],

    sidebar: {
      '/modules/': [
        {
          text: 'Web 基础',
          items: [
            { text: 'HTTP 协议', link: '/modules/01-http' },
            { text: 'Servlet 与 Spring Boot', link: '/modules/02-servlet' },
          ],
        },
        {
          text: 'Java 基础补强',
          items: [
            { text: 'Java 17 新特性', link: '/modules/03-java17' },
            { text: '集合框架', link: '/modules/04-collections' },
            { text: '面向对象实战', link: '/modules/05-oop' },
          ],
        },
        {
          text: 'Maven',
          items: [
            { text: 'Maven 基础', link: '/modules/06-maven' },
            { text: 'Spring Boot 项目结构', link: '/modules/07-project-structure' },
          ],
        },
        {
          text: 'Spring Boot 核心',
          items: [
            { text: '第一个 Spring Boot 应用', link: '/modules/08-first-app' },
            { text: '注解驱动', link: '/modules/09-annotations' },
            { text: 'RESTful API 设计', link: '/modules/10-restful' },
            { text: '配置文件', link: '/modules/11-config' },
          ],
        },
        {
          text: 'MyBatis Plus',
          items: [
            { text: 'ORM 概念', link: '/modules/12-orm' },
            { text: '基本 CRUD', link: '/modules/13-crud' },
            { text: '条件构造器', link: '/modules/14-query-builder' },
            { text: 'MySQL 连接', link: '/modules/15-mysql-connect' },
          ],
        },
        {
          text: '综合项目 — 聊天后端',
          items: [
            { text: '数据库设计', link: '/modules/16-db-design' },
            { text: '实体类编写', link: '/modules/17-entities' },
            { text: 'Service 层', link: '/modules/18-service' },
            { text: 'Controller 层', link: '/modules/19-controller' },
            { text: '测试与运行', link: '/modules/20-test-run' },
          ],
        },
        {
          text: '面试准备',
          items: [
            { text: '常见面试问题', link: '/modules/21-interview-questions' },
            { text: '项目部署基础', link: '/modules/22-deployment' },
          ],
        },
      ],
    },
  },
})
