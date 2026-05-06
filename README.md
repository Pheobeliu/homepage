# Liu Jinjing's Personal Portfolio Website

一个集前端界面设计与后端服务于一体的全栈个人网站项目，展示了高级简约艺术风格的主题切换系统和访客数据追踪功能。

## 🎨 项目特性

### 前端特性
- **11 个专业主题色系**：包括 5 个深色系和 6 个马卡龙浅色系
- **动态水波纹背果**：使用 Canvas 实现的流畅动画效果
- **鼠标互动效果**：跟随鼠标的涟漪动画和光晕效果
- **高级字体设计**：使用 Cormorant Garamond（花体）展现艺术气质
- **主题记忆功能**：localStorage 自动保存用户主题选择
- **响应式设计**：完美适配各种屏幕尺寸

### 后端特性
- **Express.js 服务器**：轻量级 RESTful API 服务
- **SQLite 数据库**：存储访客数据和主题使用统计
- **主题偏好追踪**：记录每个主题的使用频率
- **访客统计**：按日期统计访客数据
- **API 接口**：5 个功能完整的 REST API 端点

## 📦 技术栈

### 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- Canvas API（水波纹动画）
- LocalStorage API（主题记忆）
- Google Fonts（Cormorant Garamond & Inter）

### 后端
- Node.js
- Express.js 4.18+
- SQLite3
- CORS

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 运行服务器
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动

### 访问网站
- 打开浏览器访问 `http://localhost:3000`
- 选择右上角的主题按钮切换色系
- 前端与后端通过 API 自动同步用户选择

## 📡 API 接口文档

### 1. 获取所有主题列表
```http
GET /api/themes
```
**响应示例：**
```json
{
  "success": true,
  "data": [
    {"theme_name": "midnight-blue", "select_count": 5},
    {"theme_name": "deep-teal", "select_count": 3}
  ],
  "total": 11
}
```

### 2. 保存用户主题偏好
```http
POST /api/save-theme
Content-Type: application/json

{"theme": "midnight-blue"}
```

### 3. 获取访客总数
```http
GET /api/visitor-count
```
**响应示例：**
```json
{
  "success": true,
  "total_visitors": 42
}
```

### 4. 获取每日访问统计
```http
GET /api/daily-stats
```

### 5. 获取热门主题排行
```http
GET /api/popular-themes
```

### 6. 健康检查
```http
GET /api/health
```

## 🎯 主题色系

### 深色系（5 个）
- 🌌 **午夜蓝** (midnight-blue)
- 🌊 **深海青松** (deep-teal)
- 🖤 **暖炭灰** (charcoal-warm)
- 🌲 **森林雾霭** (forest-mist)
- 🌆 **暮光紫** (dusk-purple)

### 马卡龙浅色系（6 个）
- 💎 **雾霾蓝玛卡龙** (misty-blue-macaron)
- 🍃 **薄荷绿玛卡龙** (mint-green-macaron)
- 🌸 **樱花粉玛卡龙** (sakura-pink-macaron)
- 🍰 **奶油杏玛卡龙** (cream-apricot-macaron)
- 💜 **薰衣草紫玛卡龙** (lavender-purple-macaron)
- ❄️ **冰川蓝浅色** (glacial-blue-light)

## 📁 项目结构

```
personal-website/
├── server.js                 # Express 后端服务器
├── api-client.js             # 前端 API 客户端
├── index.html                # 主页面
├── style.css                 # 主样式文件
├── script.js                 # 主脚本文件
├── package.json              # 项目配置
├── data/
│   └── app.db                # SQLite 数据库（自动创建）
└── README.md                 # 本文件
```

## 💾 数据库结构

### visitors 表
存储每个访客的信息：
- `id`: 主键
- `ip_address`: 访客 IP
- `user_agent`: 浏览器标识
- `visit_time`: 访问时间
- `theme_preference`: 当前选择的主题

### theme_preferences 表
存储主题使用统计：
- `theme_name`: 主题名称
- `select_count`: 被选择的次数
- `last_selected`: 最后选择时间

### access_stats 表
存储按日期的访问统计：
- `visit_date`: 访问日期
- `visit_count`: 该日访问次数

## 🔄 前后端通信流程

```
用户点击主题按钮
    ↓
script.js 更新 UI 和 LocalStorage
    ↓
api-client.js 扩展的 setTheme 函数触发
    ↓
POST /api/save-theme → 后端
    ↓
SQLite 记录访客和主题数据
    ↓
响应成功消息给前端
```

## 🌐 部署指南

### 本地开发环境
```bash
npm install
npm start
```

### 生产环境（GitHub Pages + Netlify Functions）
1. 前端文件可直接部署到 GitHub Pages
2. 后端 API 可部署到 Netlify Functions 或 Vercel Functions

## 📊 API 调用示例

### 使用 curl
```bash
# 获取主题列表
curl http://localhost:3000/api/themes

# 保存用户主题
curl -X POST http://localhost:3000/api/save-theme \
  -H "Content-Type: application/json" \
  -d '{"theme": "midnight-blue"}'

# 获取访客统计
curl http://localhost:3000/api/visitor-count
```

### 使用 JavaScript
```javascript
// 获取所有主题
fetch('/api/themes')
  .then(res => res.json())
  .then(data => console.log(data));

// 保存主题偏好
fetch('/api/save-theme', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ theme: 'midnight-blue' })
});
```

## 🎓 学习资源

本项目集成了以下技术：
- **前端**：HTML5、CSS3、JavaScript ES6+、Canvas API
- **后端**：Node.js、Express.js、RESTful API 设计
- **数据库**：SQLite3、SQL 查询
- **架构**：前后端分离、CORS 跨域资源共享
- **工程化**：npm 包管理、模块化开发

## 📝 许可证

MIT License

## 👨‍💼 关于作者

**Liu Jinjing** (刘金晶)

- 从美团闪购产品部转岗到平台营销产品团队
- 3 年产品管理经验
- 关键特质：**上善若水** - 适应、包容、坚持

---

**最后更新：** 2026-04-14
