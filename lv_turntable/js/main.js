/**
 * 幸运大抽奖主程序
 * 负责整合转盘和气泡功能，处理用户交互
 */

// 全局变量
let wheel;
let bubbleAnimation;
let currentPrize = null;

// DOM元素
let spinButton;
let claimButton;
let resultSection;
let resultText;

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * 初始化应用程序
 */
function initializeApp() {
    // 获取DOM元素
    spinButton = document.getElementById('spinButton');
    claimButton = document.getElementById('claimButton');
    resultSection = document.getElementById('resultSection');
    resultText = document.getElementById('resultText');
    
    // 初始化转盘
    wheel = new GridLottery('gridContainer');
    
    // 初始化气泡动画
    bubbleAnimation = new BubbleAnimation('bubblesContainer');
    
    // 绑定事件
    bindEvents();
    
    // 添加触摸反馈
    addTouchFeedback();
    
    console.log('幸运大抽奖初始化完成！');
}

/**
 * 绑定事件监听器
 */
function bindEvents() {
    // 抽奖按钮点击事件
    spinButton.addEventListener('click', handleSpin);
    
    // 领取奖品按钮点击事件
    claimButton.addEventListener('click', handleClaim);
    
    // 键盘事件支持
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            if (!resultSection.classList.contains('hidden')) {
                handleClaim();
            } else if (!wheel.isSpinning) {
                handleSpin();
            }
        }
    });
    
    // 防止页面滚动干扰
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.grid-container')) {
            e.preventDefault();
        }
    }, { passive: false });
}

/**
 * 处理转盘旋转
 */
async function handleSpin() {
    if (wheel.isSpinning) return;
    
    // 隐藏结果区域
    hideResult();
    
    // 禁用抽奖按钮
    spinButton.disabled = true;
    spinButton.textContent = '抽奖中...';
    
    try {
        // 开始转盘旋转
        const result = await wheel.spin();
        currentPrize = result.prize;
        window.currentPrize = result.prize;
        
        // 显示结果
        showResult(result.prize.text, result.prize.bubbleType);
        
        // 播放音效（可选）
        playSound('win');
        
    } catch (error) {
        console.error('转盘旋转失败:', error);
        spinButton.textContent = '立即抽奖';
        spinButton.disabled = false;
    }
}

/**
 * 处理领取奖品
 */
function handleClaim() {
    if (!currentPrize || bubbleAnimation.isRunning()) return;
    
    // 隐藏结果区域
    hideResult();
    
    const reset = () => {
        spinButton.disabled = false;
        spinButton.textContent = '立即抽奖';
    };
    if (currentPrize.bubbleType === 'thanks') {
        bubbleAnimation.start('thanks', 6000, reset);
    } else {
        bubbleAnimation.start(currentPrize.bubbleType, 0, reset);
    }
    
    // 重置按钮状态
    spinButton.disabled = false;
    spinButton.textContent = '立即抽奖';
    
    // 播放音效（可选）
    playSound('bubble');
    
    console.log(`开始${currentPrize.text}的气泡动画`);
}

/**
 * 显示中奖结果
 */
function showResult(prizeText, prizeType) {
    // 定义真正中奖的奖项类型
    const winningTypes = ['special', 'first', 'second', 'third', 'fourth', 'unlucky', 'very_unlucky'];
    const isWinning = winningTypes.includes(prizeType);
    
    if (isWinning) {
        resultText.textContent = `恭喜中奖：${prizeText}！`;
        resultSection.classList.remove('hidden');
        
        // 显示领取奖品按钮
        claimButton.style.display = 'block';
    } else {
        // 对于谢谢惠顾和再来一次，不显示结果区域
        resultSection.classList.add('hidden');
        claimButton.style.display = 'none';
        
        // 直接重置按钮状态
        spinButton.disabled = false;
        spinButton.textContent = '立即抽奖';
        return;
    }
    
    // 添加动画效果
    setTimeout(() => {
        resultSection.style.opacity = '1';
        resultSection.style.transform = 'translateY(0)';
    }, 100);
}

/**
 * 隐藏中奖结果
 */
function hideResult() {
    resultSection.classList.add('hidden');
    resultSection.style.opacity = '0';
    resultSection.style.transform = 'translateY(30px)';
}

/**
 * 添加触摸反馈
 */
function addTouchFeedback() {
    const buttons = document.querySelectorAll('.spin-button, .claim-button');
    
    buttons.forEach(button => {
        // 触摸开始
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        // 触摸结束
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
        
        // 触摸取消
        button.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
}

/**
 * 播放音效（模拟）
 */
function playSound(type) {
    // 这里可以添加真实的音效播放逻辑
    // 目前只是控制台输出
    const sounds = {
        win: '🎉 中奖音效',
        bubble: '🫧 气泡音效',
        spin: '🎯 转盘音效'
    };
    
    console.log(sounds[type] || '🔊 音效');
    
    // 使用Web Audio API创建简单的音效（可选）
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'win') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
            } else if (type === 'bubble') {
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('音效播放失败:', error);
        }
    }
}

/**
 * 页面可见性变化处理
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        if (bubbleAnimation.isRunning()) {
            bubbleAnimation.stop();
        }
    }
});

/**
 * 页面卸载前清理
 */
window.addEventListener('beforeunload', function() {
    if (bubbleAnimation.isRunning()) {
        bubbleAnimation.stop();
    }
});

/**
 * 错误处理
 */
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    
    // 重置按钮状态
    if (spinButton) {
        spinButton.disabled = false;
        spinButton.textContent = '立即抽奖';
    }
});

/**
 * 导出函数供外部使用（可选）
 */
window.LuckyDrawApp = {
    spin: handleSpin,
    claim: handleClaim,
    getCurrentPrize: () => currentPrize,
    isSpinning: () => wheel ? wheel.isSpinning : false,
    isAnimating: () => bubbleAnimation ? bubbleAnimation.isRunning() : false
};
