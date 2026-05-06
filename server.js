const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// 初始化 SQLite 数据库
const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('数据库连接失败:', err);
    } else {
        console.log('SQLite 数据库已连接');
        initializeDatabase();
    }
});

// 初始化数据库表
function initializeDatabase() {
    db.serialize(() => {
        // 访客记录表
        db.run(`
            CREATE TABLE IF NOT EXISTS visitors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT,
                user_agent TEXT,
                visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                theme_preference TEXT
            )
        `, (err) => {
            if (err) console.error('创建 visitors 表失败:', err);
        });

        // 主题偏好表
        db.run(`
            CREATE TABLE IF NOT EXISTS theme_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                theme_name TEXT UNIQUE,
                select_count INTEGER DEFAULT 0,
                last_selected DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('创建 theme_preferences 表失败:', err);
            else {
                // 初始化主题数据
                const themes = [
                    'midnight-blue',
                    'deep-teal',
                    'charcoal-warm',
                    'forest-mist',
                    'dusk-purple',
                    'misty-blue-macaron',
                    'mint-green-macaron',
                    'sakura-pink-macaron',
                    'cream-apricot-macaron',
                    'lavender-purple-macaron',
                    'glacial-blue-light'
                ];

                themes.forEach(theme => {
                    db.run(
                        `INSERT OR IGNORE INTO theme_preferences (theme_name, select_count) VALUES (?, 0)`,
                        [theme]
                    );
                });
            }
        });

        // 访问统计表
        db.run(`
            CREATE TABLE IF NOT EXISTS access_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                visit_date DATE UNIQUE,
                visit_count INTEGER DEFAULT 1,
                UNIQUE(visit_date)
            )
        `, (err) => {
            if (err) console.error('创建 access_stats 表失败:', err);
        });
    });
}

// ==================== API 端点 ====================

/**
 * 获取所有主题列表
 * @route GET /api/themes
 */
app.get('/api/themes', (req, res) => {
    db.all(`
        SELECT theme_name, select_count 
        FROM theme_preferences 
        ORDER BY select_count DESC
    `, (err, rows) => {
        if (err) {
            console.error('查询主题失败:', err);
            res.status(500).json({ error: '查询失败' });
        } else {
            res.json({ 
                success: true,
                data: rows,
                total: rows.length 
            });
        }
    });
});

/**
 * 保存用户主题偏好并记录访客
 * @route POST /api/save-theme
 */
app.post('/api/save-theme', (req, res) => {
    const { theme } = req.body;
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    if (!theme) {
        res.status(400).json({ error: '主题参数缺失' });
        return;
    }

    db.serialize(() => {
        // 记录访客
        db.run(`
            INSERT INTO visitors (ip_address, user_agent, theme_preference)
            VALUES (?, ?, ?)
        `, [ip, userAgent, theme], (err) => {
            if (err) console.error('记录访客失败:', err);
        });

        // 更新主题选择计数
        db.run(`
            UPDATE theme_preferences
            SET select_count = select_count + 1, last_selected = CURRENT_TIMESTAMP
            WHERE theme_name = ?
        `, [theme], (err) => {
            if (err) {
                console.error('更新主题统计失败:', err);
                res.status(500).json({ error: '保存失败' });
            } else {
                res.json({ success: true, message: '主题已保存' });
            }
        });
    });
});

/**
 * 获取访客总数
 * @route GET /api/visitor-count
 */
app.get('/api/visitor-count', (req, res) => {
    db.get(`
        SELECT COUNT(*) as total_visitors
        FROM visitors
    `, (err, row) => {
        if (err) {
            console.error('查询访客数失败:', err);
            res.status(500).json({ error: '查询失败' });
        } else {
            res.json({
                success: true,
                total_visitors: row.total_visitors
            });
        }
    });
});

/**
 * 获取每日访问统计
 * @route GET /api/daily-stats
 */
app.get('/api/daily-stats', (req, res) => {
    db.all(`
        SELECT 
            DATE(visit_time) as visit_date,
            COUNT(*) as count
        FROM visitors
        GROUP BY DATE(visit_time)
        ORDER BY visit_date DESC
        LIMIT 30
    `, (err, rows) => {
        if (err) {
            console.error('查询日统计失败:', err);
            res.status(500).json({ error: '查询失败' });
        } else {
            res.json({
                success: true,
                data: rows,
                total_days: rows.length
            });
        }
    });
});

/**
 * 获取最受欢迎的主题
 * @route GET /api/popular-themes
 */
app.get('/api/popular-themes', (req, res) => {
    db.all(`
        SELECT theme_name, select_count
        FROM theme_preferences
        WHERE select_count > 0
        ORDER BY select_count DESC
        LIMIT 5
    `, (err, rows) => {
        if (err) {
            console.error('查询热门主题失败:', err);
            res.status(500).json({ error: '查询失败' });
        } else {
            res.json({
                success: true,
                data: rows || [],
                message: rows.length === 0 ? '暂无选择数据' : '热门主题排行'
            });
        }
    });
});

/**
 * 健康检查端点
 * @route GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ==================== 错误处理 ====================

app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

// ==================== 启动服务器 ====================

app.listen(port, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         Liu Jinjing Personal Website API Server             ║
║                                                              ║
║  Server is running at http://localhost:${port}              ║
║                                                              ║
║  📍 API Endpoints:                                           ║
║    GET  /api/themes           - 获取所有主题列表              ║
║    POST /api/save-theme       - 保存用户主题偏好              ║
║    GET  /api/visitor-count    - 获取访客总数                 ║
║    GET  /api/daily-stats      - 获取每日统计                 ║
║    GET  /api/popular-themes   - 获取热门主题                 ║
║    GET  /api/health           - 健康检查                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n关闭服务器...');
    db.close((err) => {
        if (err) console.error('关闭数据库出错:', err);
        else console.log('数据库已关闭');
        process.exit(0);
    });
});
