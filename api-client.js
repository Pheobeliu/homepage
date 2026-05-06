/**
 * 前端 API 客户端
 * 用于调用后端 API 接口
 */

const API_BASE = 'http://localhost:3000/api';

/**
 * 获取所有主题
 */
async function fetchThemes() {
    try {
        const response = await fetch(`${API_BASE}/themes`);
        const data = await response.json();
        console.log('主题列表:', data);
        return data;
    } catch (error) {
        console.error('获取主题失败:', error);
    }
}

/**
 * 保存用户主题选择
 */
async function saveThemeSelection(themeName) {
    try {
        const response = await fetch(`${API_BASE}/save-theme`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ theme: themeName })
        });
        const data = await response.json();
        console.log('主题已保存:', data);
        return data;
    } catch (error) {
        console.error('保存主题失败:', error);
    }
}

/**
 * 获取访客总数
 */
async function getVisitorCount() {
    try {
        const response = await fetch(`${API_BASE}/visitor-count`);
        const data = await response.json();
        console.log('访客总数:', data);
        return data;
    } catch (error) {
        console.error('获取访客数失败:', error);
    }
}

/**
 * 获取每日统计
 */
async function getDailyStats() {
    try {
        const response = await fetch(`${API_BASE}/daily-stats`);
        const data = await response.json();
        console.log('每日统计:', data);
        return data;
    } catch (error) {
        console.error('获取统计数据失败:', error);
    }
}

/**
 * 获取热门主题
 */
async function getPopularThemes() {
    try {
        const response = await fetch(`${API_BASE}/popular-themes`);
        const data = await response.json();
        console.log('热门主题:', data);
        return data;
    } catch (error) {
        console.error('获取热门主题失败:', error);
    }
}

/**
 * 健康检查
 */
async function healthCheck() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        console.log('服务器状态:', data);
        return data;
    } catch (error) {
        console.error('健康检查失败:', error);
    }
}

// 扩展原有的 setTheme 函数以支持后端记录
const originalSetTheme = window.setTheme;
window.setTheme = function(themeName) {
    // 调用原有函数
    if (typeof originalSetTheme === 'function') {
        originalSetTheme.call(this, themeName);
    }
    
    // 同时保存到后端
    saveThemeSelection(themeName).catch(err => {
        console.warn('后端保存失败，但前端主题切换正常:', err);
    });
};

// 页面加载时进行初始化
document.addEventListener('DOMContentLoaded', () => {
    // 可选：检查服务器是否在线
    healthCheck().then(data => {
        if (data && data.status === 'ok') {
            console.log('✓ 后端服务已连接');
            // 加载统计数据
            getVisitorCount();
            getPopularThemes();
        }
    }).catch(() => {
        console.warn('⚠ 后端服务未连接，功能仅限前端');
    });
});
