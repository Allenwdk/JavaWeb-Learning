<template>
  <div class="path-section">
    <h2 class="section-title">学习路线</h2>
    <p class="section-subtitle">7 个模块，循序渐进，最终独立完成聊天后端项目。</p>
    <div class="path-grid">
      <div v-for="mod in modules" :key="mod.num" class="path-card">
        <span class="path-num">{{ mod.num }}</span>
        <div class="path-title">{{ mod.title }}</div>
        <div class="path-desc">{{ mod.desc }}</div>
        <div class="path-meta">
          <span class="path-lessons">{{ mod.lessons }} 课时</span>
          <span class="path-arrow">→</span>
          <span class="path-tag">{{ mod.tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const modules = [
  { num: '01', title: 'Web 基础', desc: 'HTTP 协议、浏览器与服务器通信', lessons: 2, tag: '网络' },
  { num: '02', title: 'Java 补强', desc: 'Java 17 新特性、集合框架、OOP', lessons: 3, tag: '语言' },
  { num: '03', title: 'Maven', desc: '依赖管理、项目结构规范', lessons: 2, tag: '构建' },
  { num: '04', title: 'Spring Boot', desc: '注解、RESTful API、配置文件', lessons: 4, tag: '框架' },
  { num: '05', title: 'MyBatis Plus', desc: 'ORM 概念、CRUD、查询构造器', lessons: 4, tag: '数据库' },
  { num: '06', title: '聊天后端', desc: '综合项目：数据库→实体→Service→Controller', lessons: 5, tag: '实战' },
  { num: '07', title: '面试准备', desc: '常见问题整理、部署基础', lessons: 2, tag: '求职' },
]
</script>

<style scoped>
.path-section {
  margin-top: 48px;
}

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #e6edf3;
  margin-bottom: 8px;
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 48px;
  height: 3px;
  background: #2ecc71;
  border-radius: 2px;
}

.section-subtitle {
  color: #8b949e;
  font-size: 15px;
  margin-bottom: 24px;
}

.path-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.path-card {
  background: #151b23;
  border: 1px solid rgba(139, 148, 158, 0.16);
  border-radius: 8px;
  padding: 18px;
  transition: all 0.25s ease;
  position: relative;
}

.path-card:hover {
  border-color: rgba(139, 148, 158, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.path-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 10px;
}

.path-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #e6edf3;
  margin-bottom: 6px;
}

.path-desc {
  font-size: 13px;
  color: #8b949e;
  line-height: 1.5;
  margin-bottom: 10px;
}

.path-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #6e7681;
}

.path-arrow {
  color: #e74c3c;
}

.path-tag {
  background: rgba(139, 148, 158, 0.1);
  padding: 1px 6px;
  border-radius: 3px;
  margin-left: auto;
}

@media (max-width: 768px) {
  .path-grid {
    grid-template-columns: 1fr;
  }
}
</style>
