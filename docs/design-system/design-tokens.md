# 个人网站 — 设计系统文档

> 风格定位：Apple 式极简现代科技感。大量留白、清晰字体层级、克制配色、流畅动效。

---

## 一、设计原则

| 原则 | 说明 |
|---|---|
| **极简克制** | 每个元素都有存在的理由，去掉一切装饰性噪音 |
| **内容优先** | 版式服务于内容，不喧宾夺主 |
| **呼吸感** | 充足留白，让视觉有节奏地流动 |
| **一致性** | 相同语义的元素保持相同视觉表达 |
| **无障碍** | 颜色对比度满足 WCAG 2.1 Level AA |

---

## 二、颜色 Token

### 2.1 原始色板（Primitive）

```json
{
  "gray": {
    "0":   "#FFFFFF",
    "50":  "#F9F9F9",
    "100": "#F2F2F2",
    "200": "#E5E5E5",
    "300": "#D4D4D4",
    "400": "#A3A3A3",
    "500": "#737373",
    "600": "#525252",
    "700": "#404040",
    "800": "#262626",
    "900": "#171717",
    "950": "#0A0A0A"
  },
  "blue": {
    "50":  "#EFF6FF",
    "100": "#DBEAFE",
    "400": "#60A5FA",
    "500": "#3B82F6",
    "600": "#2563EB",
    "700": "#1D4ED8"
  }
}
```

### 2.2 语义色（Semantic）

| Token | Light 值 | Dark 值 | 用途 |
|---|---|---|---|
| `brand.primary` | `blue.600` (#2563EB) | `blue.400` (#60A5FA) | CTA、链接、强调 |
| `brand.primary.hover` | `blue.700` | `blue.500` | 悬停状态 |
| `text.primary` | `gray.900` (#171717) | `gray.50` (#F9F9F9) | 正文、标题 |
| `text.secondary` | `gray.500` (#737373) | `gray.400` (#A3A3A3) | 辅助说明、元信息 |
| `text.tertiary` | `gray.400` (#A3A3A3) | `gray.600` (#525252) | 禁用、占位符 |
| `text.inverse` | `gray.0` (#FFFFFF) | `gray.950` (#0A0A0A) | 彩色背景上的文字 |
| `bg.primary` | `gray.0` (#FFFFFF) | `gray.950` (#0A0A0A) | 页面背景 |
| `bg.secondary` | `gray.50` (#F9F9F9) | `gray.900` (#171717) | 卡片、区块背景 |
| `bg.tertiary` | `gray.100` (#F2F2F2) | `gray.800` (#262626) | 输入框、标签背景 |
| `border.default` | `gray.200` (#E5E5E5) | `gray.800` (#262626) | 分割线、边框 |
| `border.subtle` | `gray.100` (#F2F2F2) | `gray.900` (#171717) | 微妙边框 |

### 2.3 对比度验证（WCAG AA）

| 组合 | Light 比值 | Dark 比值 | 是否达标 |
|---|---|---|---|
| text.primary / bg.primary | 16.1:1 | 17.5:1 | ✅ AAA |
| text.secondary / bg.primary | 5.9:1 | 4.6:1 | ✅ AA |
| brand.primary / bg.primary | 5.1:1 | 4.5:1 | ✅ AA |

---

## 三、排版 Token

### 字体族

| 用途 | 字体栈 |
|---|---|
| 正文 / UI | `'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', sans-serif` |
| 代码 | `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` |

### 字号比例（Major Third × 1.25）

| Token | rem | px | 用途 |
|---|---|---|---|
| `xs` | 0.75rem | 12px | 元标签、辅助说明 |
| `sm` | 0.875rem | 14px | 小号正文、说明文字 |
| `base` | 1rem | 16px | 正文默认 |
| `lg` | 1.125rem | 18px | 强调正文 |
| `xl` | 1.25rem | 20px | 小标题 |
| `2xl` | 1.5rem | 24px | 卡片标题 |
| `3xl` | 1.875rem | 30px | 区块标题 |
| `4xl` | 2.25rem | 36px | 页面标题 |
| `5xl` | 3rem | 48px | Hero 大标题 |
| `6xl` | 3.75rem | 60px | Hero 超大标题 |

### 字重

| Token | 值 | 用途 |
|---|---|---|
| `normal` | 400 | 正文 |
| `medium` | 500 | 强调正文、导航 |
| `semibold` | 600 | 卡片标题、按钮 |
| `bold` | 700 | 页面标题 |

### 行高

| Token | 值 | 用途 |
|---|---|---|
| `tight` | 1.25 | 大标题 |
| `snug` | 1.375 | 小标题 |
| `normal` | 1.5 | 正文 |
| `relaxed` | 1.625 | 长文阅读 |

---

## 四、间距 Token（4px 基准）

| Token | rem | px |
|---|---|---|
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |
| `16` | 4rem | 64px |
| `20` | 5rem | 80px |
| `24` | 6rem | 96px |
| `32` | 8rem | 128px |

---

## 五、圆角 Token

| Token | 值 | 用途 |
|---|---|---|
| `none` | 0 | 无圆角 |
| `sm` | 4px | 输入框、小按钮 |
| `base` | 8px | 按钮默认 |
| `md` | 12px | 卡片 |
| `lg` | 16px | 模态框 |
| `xl` | 24px | 大卡片 |
| `full` | 9999px | 标签、徽章、圆形按钮 |

---

## 六、阴影 Token

苹果风格阴影：柔和、分散，避免明显的黑色阴影。

| Token | 值 | 用途 |
|---|---|---|
| `xs` | `0 1px 2px rgba(0,0,0,0.04)` | 微妙浮起 |
| `sm` | `0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | 卡片默认 |
| `md` | `0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | 卡片悬停 |
| `lg` | `0 8px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)` | 模态框、下拉菜单 |

---

## 七、动效 Token

| Token | 值 | 用途 |
|---|---|---|
| `duration.fast` | 150ms | 微交互（悬停、聚焦） |
| `duration.base` | 250ms | 状态切换、颜色变化 |
| `duration.slow` | 400ms | 面板展开、模态框 |
| `duration.page` | 500ms | 页面切换 |
| `easing.standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 通用（MUI 默认） |
| `easing.decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | 元素进入 |
| `easing.accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | 元素离开 |
| `easing.spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 弹性动效（Framer Motion） |

---

## 八、组件规格

### Navbar
- 高度：64px（desktop）/ 56px（mobile）
- 背景：`bg.primary` + `backdrop-filter: blur(20px)` + `bg-opacity: 0.85`（毛玻璃效果）
- 边框：底部 `border.subtle` 1px
- position: `sticky top-0` z-index: 100

### ContentCard（内容卡片）
- 背景：`bg.secondary`
- 圆角：`radius.md` (12px)
- 阴影：`shadow.sm`（默认）→ `shadow.md`（悬停）
- 过渡：`box-shadow 250ms easing.standard`
- 内边距：`spacing.6` (24px)

### Tag（标签）
- 高度：24px
- 内边距：`spacing.2` × `spacing.3` (8px × 12px)
- 圆角：`radius.full`
- 背景：`bg.tertiary`
- 字号：`text.xs` (12px)
- 字重：`font.medium` (500)

### FilterBar（筛选栏）
- 布局：横向滚动（mobile）/ flex-wrap（desktop）
- 间距：`spacing.2` (8px)
- 激活态：`brand.primary` 背景 + `text.inverse` 文字

### Hero
- 最小高度：80vh（desktop）/ 60vh（mobile）
- 内容最大宽度：720px
- 垂直居中对齐

---

## 九、响应式断点

遵循 MUI v7 默认断点：

| 断点 | 最小宽度 | 目标设备 |
|---|---|---|
| `xs` | 0px | 手机竖屏 |
| `sm` | 600px | 手机横屏 / 小平板 |
| `md` | 900px | 平板 |
| `lg` | 1200px | 桌面 |
| `xl` | 1536px | 大屏桌面 |

内容最大宽度：`1280px`，页面水平内边距：`spacing.6`（mobile）/ `spacing.10`（desktop）。

---

## 十、组件层级（Atomic Design）

```
Atoms（原子）
  ├── Tag            — 标签徽章
  ├── CategoryChip   — 分类选择器
  ├── ReadingTime    — 阅读时长
  ├── PlatformBadge  — 视频平台徽章（B站/YouTube）
  └── StarRating     — 星级评分

Molecules（分子）
  ├── ContentCard    — 通用内容卡片（博客/视频/书籍）
  ├── FilterBar      — 分类+标签筛选栏
  ├── BlogCard       — 博客专用卡片
  ├── VideoCard      — 视频专用卡片
  └── BookCard       — 书籍专用卡片

Organisms（有机体）
  ├── Navbar         — 顶部导航栏
  ├── Footer         — 页脚
  ├── Hero           — 首页 Hero 区
  ├── ContentGrid    — 内容卡片网格
  └── ArticleBody    — 文章/笔记富文本渲染器

Templates（模板）
  ├── DefaultLayout  — 默认布局（Navbar + children + Footer）
  └── ArticleLayout  — 文章详情布局（宽度限制 + TOC 预留）
```
