// 从 ./index.json 加载配置
async function loadConfig() {
    // 显示加载状态，隐藏错误信息和内容区域
    // document.getElementById('loading').style.display = 'flex';
    // document.getElementById('error-message').style.display = 'none';
    // document.getElementById('content-area').style.display = 'none';
    
    try {
        // 使用Fetch API获取JSON文件
        const response = await fetch('./index.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const config = await response.json();
        
        // 隐藏加载状态
        // document.getElementById('loading').style.display = 'none';
        
        console.log('加载的配置:', config);
        
        // 遍历配置对象的每个键值对
        for (const [key, value] of Object.entries(config)) {
            // 查找具有对应id的元素
            const element = document.getElementById(key);
            if (element) {
                // 将配置值设置为元素内容
                console.log(`更新元素 #${key}:`, value);
                element.textContent = value;
            } else {
                console.warn(`未找到ID为"${key}"的元素`);
            }
        }
        
        // 显示当前使用的JSON配置
        // document.getElementById('json-display').textContent = JSON.stringify(config, null, 2);
        
        // 显示内容区域
        // document.getElementById('content-area').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading config:', error);
        
        // 隐藏加载状态，显示错误信息
        // document.getElementById('loading').style.display = 'none';
        // document.getElementById('error-message').style.display = 'block';
    }
}

// 页面加载时读取配置
document.addEventListener('DOMContentLoaded', loadConfig);