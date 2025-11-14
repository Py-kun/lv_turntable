/**
 * 气泡动画类
 * 负责创建和管理全屏气泡效果
 */
class BubbleAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isAnimating = false;
        this.bubbles = [];
        this.animationId = null;
        this.onComplete = null;
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.stop();
            }
        });
        
        // 气泡配置
        this.bubbleConfigs = {
            hidden: {
                colors: ['#e74c3c', '#c0392b', '#e67e22'],
                content: ['隐藏大奖', '神秘礼包', '超级幸运'],
                size: { min: 50, max: 110 },
                speed: { min: 1, max: 3 }
            },
            special: {
                colors: ['#ff6b6b', '#ff8e8e', '#ffb3b3'],
                content: ['xxx', '特等奖', '恭喜'],
                size: { min: 40, max: 100 },
                speed: { min: 2, max: 4 }
            },
            first: {
                colors: ['#4ecdc4', '#45b7aa', '#3d9b8f'],
                content: ['xxx', '一等奖', '太棒了'],
                size: { min: 35, max: 90 },
                speed: { min: 1.5, max: 3.5 }
            },
            second: {
                colors: ['#96ceb4', '#81c784', '#66bb6a'],
                content: ['xxx', '二等奖', '不错哦'],
                size: { min: 30, max: 80 },
                speed: { min: 1.8, max: 3.8 }
            },
            third: {
                colors: ['#feca57', '#ffb74d', '#ffa726'],
                content: ['xxx', '三等奖', '很好'],
                size: { min: 25, max: 70 },
                speed: { min: 2, max: 4 }
            },
            fourth: {
                colors: ['#48dbfb', '#42a5f5', '#2196f3'],
                content: ['xxx', '四等奖', '不错'],
                size: { min: 20, max: 60 },
                speed: { min: 2.2, max: 4.2 }
            },
            thanks: {
                colors: ['#636e72', '#78909c', '#90a4ae'],
                content: ['xxx', '谢谢', '参与'],
                size: { min: 20, max: 50 },
                speed: { min: 2.5, max: 4.5 }
            },
            again: {
                colors: ['#00b894', '#26a69a', '#00897b'],
                content: ['xxx', '再来', '一次'],
                size: { min: 30, max: 70 },
                speed: { min: 2, max: 4 }
            }
        };
    }
    
    /**
     * 开始气泡动画
     * @param {string} bubbleType - 气泡类型
     * @param {number} duration - 动画持续时间(毫秒)，0表示永久显示
     */
    start(bubbleType = 'special', duration = 0, onComplete = null) {
        if (this.isAnimating) return;
        this.onComplete = onComplete || null;
        
        this.isAnimating = true;
        this.container.classList.remove('hidden');
        this.container.classList.add('show');
        
        // 特殊：谢谢惠顾 → 满屏慢速飘一遍后重置
        if (bubbleType === 'thanks') {
            const config = { ...this.bubbleConfigs.thanks };
            config.content = ['算你运气好'];
            config.size = { min: 40, max: 80 };
            config.speed = { min: 5, max: 7 };
            this.createThanksBurst(config);
            const runMs = duration > 0 ? duration : 6000;
            setTimeout(() => {
                this.stop();
            }, runMs);
            return;
        }
        
        // 普通中奖：显示可关闭的固定气泡
        const config = this.bubbleConfigs[bubbleType] || this.bubbleConfigs.special;
        const message = this.getPrizeMessage(bubbleType);
        config.content = [message];
        config.size = { min: 80, max: 120 };
        this.createFixedBubble(config, message);
        
        if (duration > 0) {
            setTimeout(() => {
                this.stop();
            }, duration);
        }
    }

    getPrizeMessage(type) {
        switch (type) {
            case 'special':
                return 'lv的iphone15 pro （95新）';
            case 'first':
                return 'lv每日早安一周';
            case 'second':
                return 'lv三角洲陪玩3天';
            case 'third':
                return '没想好 待定';
            case 'unlucky':
                return 'lv每日要饭（3天）';
            case 'very_unlucky':
                return 'lv写真一套';
            default: {
                const currentPrize = window.currentPrize;
                const prizeName = currentPrize ? currentPrize.text : '未知奖品';
                const prizeDesc = currentPrize ? currentPrize.prize : '神秘奖品';
                return `${prizeName}奖的奖品是${prizeDesc}`;
            }
        }
    }
    
    /**
     * 创建初始气泡群
     */
    createInitialBubbles(config) {
        const bubbleCount = 8 + Math.floor(Math.random() * 5); // 8-12个初始气泡
        
        for (let i = 0; i < bubbleCount; i++) {
            setTimeout(() => {
                this.createBubble(config);
            }, i * 100);
        }
    }
    
    /**
     * 创建固定气泡（只显示一个，不消失）
     */
    createFixedBubble(config, content) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble fixed-bubble';
        
        // 固定位置和大小
        bubble.style.width = 'auto';
        bubble.style.height = 'auto';
        bubble.style.padding = '20px 30px';
        bubble.style.borderRadius = '30px';
        bubble.style.fontSize = '18px';
        bubble.style.fontWeight = 'bold';
        bubble.style.color = 'white';
        bubble.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        bubble.style.minWidth = '250px';
        bubble.style.textAlign = 'center';
        bubble.style.position = 'fixed';
        bubble.style.top = '50%';
        bubble.style.left = '50%';
        bubble.style.transform = 'translate(-50%, -50%)';
        bubble.style.zIndex = '1001';
        bubble.style.background = 'linear-gradient(135deg, #ff6b6b, #4ecdc4)';
        bubble.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        bubble.style.backdropFilter = 'blur(10px)';
        
        bubble.textContent = content;
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'bubble-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            this.stop();
        });
        bubble.appendChild(closeBtn);
        
        this.container.appendChild(bubble);
        this.bubbles.push(bubble);
    }
    
    /**
     * 创建单个气泡
     */
    createBubble(config) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // 随机属性
        const size = this.randomBetween(config.size.min, config.size.max);
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const content = config.content[Math.floor(Math.random() * config.content.length)];
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + size;
        const duration = this.randomBetween(config.speed.min, config.speed.max);
        const delay = Math.random() * 0.5;
        
        // 设置样式
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.backgroundColor = color;
        bubble.style.left = `${startX}px`;
        bubble.style.top = `${startY}px`;
        bubble.style.fontSize = `${size * 0.3}px`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.textContent = content;
        
        // 如果是长气泡内容，调整样式
        if (content.includes('奖的奖品是')) {
            bubble.style.width = 'auto';
            bubble.style.height = 'auto';
            bubble.style.padding = '15px 25px';
            bubble.style.borderRadius = '25px';
            bubble.style.fontSize = '16px';
            bubble.style.fontWeight = 'bold';
            bubble.style.color = 'white';
            bubble.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
            bubble.style.minWidth = '200px';
            bubble.style.textAlign = 'center';
        }
        
        // 添加动画结束监听
        bubble.addEventListener('animationend', () => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
            const index = this.bubbles.indexOf(bubble);
            if (index > -1) {
                this.bubbles.splice(index, 1);
            }
        });
        
        this.container.appendChild(bubble);
        this.bubbles.push(bubble);
    }

    /**
     * 谢谢惠顾：创建满屏慢速气泡群
     */
    createThanksBurst(config) {
        const bubbleCount = 36; // 满屏
        for (let i = 0; i < bubbleCount; i++) {
            setTimeout(() => {
                this.createBubble(config);
            }, i * 120);
        }
    }
    
    /**
     * 停止动画
     */
    stop() {
        this.isAnimating = false;
        
        // 立即移除所有气泡
        this.bubbles.forEach((bubble) => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        });
        this.bubbles = [];
        this.container.classList.remove('show');
        this.container.classList.add('hidden');
        
        // 完成回调（用于“谢谢惠顾”结束后重置页面）
        if (typeof this.onComplete === 'function') {
            const cb = this.onComplete;
            this.onComplete = null;
            try { cb(); } catch (e) {}
        }
    }
    
    /**
     * 检查是否正在动画中
     */
    isRunning() {
        return this.isAnimating;
    }
    
    /**
     * 获取随机数
     */
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * 获取气泡配置
     */
    getBubbleConfig(type) {
        return this.bubbleConfigs[type] || this.bubbleConfigs.special;
    }
}
