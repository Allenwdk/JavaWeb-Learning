<template>
  <div class="tech-section">
    <h2 class="section-title">技术栈</h2>
    <p class="section-subtitle">学习路线中使用的核心技术，全部是面试高频考点。</p>
    <div class="tech-grid">
      <div v-for="tech in techs" :key="tech.name" class="tech-card">
        <div class="tech-icon">{{ tech.icon }}</div>
        <div class="tech-name">{{ tech.name }}</div>
        <div class="tech-desc">{{ tech.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const techs = [
  { icon: '☕', name: 'Java 17', desc: '编程语言' },
  { icon: '🍃', name: 'Spring Boot', desc: 'Web 框架' },
  { icon: '📦', name: 'Maven', desc: '项目构建' },
  { icon: '🅱️', name: 'MyBatis Plus', desc: 'ORM 框架' },
  { icon: '🐬', name: 'MySQL', desc: '数据库' },
  { icon: '🔧', name: 'IntelliJ', desc: '开发工具' },
]
</script>

<style scoped>
.tech-section {
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
  background: #e74c3c;
  border-radius: 2px;
}

.section-subtitle {
  color: #8b949e;
  font-size: 15px;
  margin-bottom: 24px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.tech-card {
  background: #151b23;
  border: 1px solid rgba(139, 148, 158, 0.16);
  border-radius: 8px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.tech-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #e74c3c, #ff6b5a);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.tech-card:hover {
  border-color: #e74c3c;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(231, 76, 60, 0.12);
}

.tech-card:hover::before {
  opacity: 1;
}

.tech-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.tech-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #e6edf3;
}

.tech-desc {
  font-size: 11px;
  color: #6e7681;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
