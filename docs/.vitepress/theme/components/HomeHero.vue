<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="home-hero-custom">
    <!-- Terminal Header -->
    <div class="terminal-window">
      <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">JavaWeb-Learning</span>
      </div>
      <div class="terminal-body">
        <div class="terminal-line">
          <span class="prompt">$</span>
          <span class="command">java --version</span>
        </div>
        <div class="terminal-output">
          <span class="output-text">java 17.0.12 2024-10-15 LTS</span>
        </div>
        <div class="terminal-line">
          <span class="prompt">$</span>
          <span class="command">git clone https://github.com/learning/java-web</span>
        </div>
        <div class="terminal-output">
          <span class="output-text">Cloning into 'java-web'...</span>
        </div>
        <div class="terminal-line blink">
          <span class="prompt">$</span>
          <span class="cursor">█</span>
        </div>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="hero-content">
      <h1 class="hero-main-title">
        <span class="brand-text">JavaWeb</span>
        <span class="amp">&amp;</span>
        <span class="slash">/</span>
        学习路线
      </h1>
      <p class="hero-tagline">
        从零基础到手写聊天后端
      </p>
      <p class="hero-desc">
        面向大一学生，有 Java 和 C 语言基础。<br>
        目标：<strong>不借助 AI 和文档，手写一个聊天后端</strong>，通过科技协会面试。
      </p>

      <div class="hero-actions">
        <a :href="withBase('/modules/intro')" class="btn btn-primary">
          <span>▶</span> 开始学习
        </a>
        <a :href="withBase('/exercises')" class="btn btn-secondary">
          <span>{ }</span> 练习项目
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-hero-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 20px;
}

/* --- Terminal Window --- */
.terminal-window {
  width: 100%;
  max-width: 560px;
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #1c2333;
  border-radius: 8px 8px 0 0;
  border: 1px solid rgba(139, 148, 158, 0.16);
  border-bottom: none;
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dot.red { background: #ff5f57; }
.terminal-dot.yellow { background: #febc2e; }
.terminal-dot.green { background: #28c840; }

.terminal-title {
  margin-left: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #6e7681;
}

.terminal-body {
  background: #0d1117;
  border: 1px solid rgba(139, 148, 158, 0.16);
  border-radius: 0 0 8px 8px;
  padding: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.8;
  min-height: 140px;
}

.terminal-line {
  display: flex;
  align-items: center;
}

.prompt {
  color: #2ecc71;
  margin-right: 8px;
  font-weight: 700;
}

.command {
  color: #e6edf3;
}

.terminal-output {
  margin: 4px 0 8px 20px;
}

.output-text {
  color: #8b949e;
  font-style: italic;
}

.blink {
  animation: blink-pulse 1.2s ease-in-out infinite;
}

.cursor {
  display: inline-block;
  color: #2ecc71;
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes blink-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* --- Hero Content --- */
.hero-content {
  text-align: center;
}

.hero-main-title {
  font-family: 'Outfit', sans-serif;
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 16px;
}

.brand-text {
  color: #e74c3c;
}

.amp {
  color: #6e7681;
}

.slash {
  color: #2ecc71;
}

.hero-tagline {
  font-size: 20px;
  color: #8b949e;
  margin-bottom: 12px;
  font-weight: 300;
}

.hero-desc {
  font-size: 15px;
  color: #6e7681;
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto;
}

.hero-desc strong {
  color: #e6edf3;
  font-weight: 600;
}

/* --- Action Buttons --- */
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn-primary {
  background: #e74c3c;
  color: #fff;
  border: 1px solid #e74c3c;
  box-shadow: 0 0 24px rgba(231, 76, 60, 0.3);
}

.btn-primary:hover {
  background: #ff6b5a;
  border-color: #ff6b5a;
  box-shadow: 0 0 36px rgba(231, 76, 60, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #1c2333;
  color: #e6edf3;
  border: 1px solid rgba(139, 148, 158, 0.24);
}

.btn-secondary:hover {
  background: #151b23;
  border-color: #e74c3c;
  transform: translateY(-2px);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .hero-main-title {
    font-size: 36px;
  }

  .hero-tagline {
    font-size: 17px;
  }

  .hero-desc {
    font-size: 14px;
  }

  .btn {
    padding: 12px 24px;
    font-size: 13px;
  }

  .terminal-body {
    font-size: 11px;
    padding: 16px;
  }
}
</style>
