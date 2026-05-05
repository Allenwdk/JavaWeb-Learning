import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HomeHero from './components/HomeHero.vue'
import TechStack from './components/TechStack.vue'
import LearningPath from './components/LearningPath.vue'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, {}, {
      'home-hero-after': () => h(HomeHero),
    })
  },
  enhanceApp({ app }) {
    app.component('TechStack', TechStack)
    app.component('LearningPath', LearningPath)
  },
}
