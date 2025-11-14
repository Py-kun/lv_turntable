/**
 * 幸运转盘类
 * 负责转盘的绘制、旋转和奖品逻辑
 */
class LuckyWheel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = 140;
        
        // 奖品配置 - 按照权重分配扇区大小
        this.prizes = [
            // 交叉排列：有奖和谢谢惠顾交替出现，隐藏大奖放在最不显眼的位置
            { text: '特等奖', color: '#c0392b', bubbleType: 'special', weight: 0.08, prize: '豪华大奖' },
            { text: '谢谢惠顾', color: '#27ae60', bubbleType: 'thanks', weight: 0.15, prize: '谢谢参与' },
            { text: '一等奖', color: '#9b59b6', bubbleType: 'first', weight: 0.12, prize: '一等奖奖品' },
            { text: '再来一次', color: '#f39c12', bubbleType: 'again', weight: 0.15, prize: '再来一次' },
            { text: '二等奖', color: '#8e44ad', bubbleType: 'second', weight: 0.15, prize: '二等奖奖品' },
            { text: '谢谢惠顾', color: '#636e72', bubbleType: 'thanks', weight: 0.15, prize: '谢谢参与' },
            { text: '三等奖', color: '#3498db', bubbleType: 'third', weight: 0.15, prize: '三等奖奖品' },
            { text: '隐藏大奖', color: '#e74c3c', bubbleType: 'hidden', weight: 0.05, prize: '神秘豪华礼包' }
        ];
        
        this.currentAngle = 0;
        this.isSpinning = false;
        
        // 计算加权扇区角度
        this.calculateSegmentAngles();
        
        this.init();
    }
    
    // 全新的角度系统：以奖品索引为核心
    // 12点方向为索引0，顺时针排列
    getPrizeIndexAtTop() {
        // 计算当前12点方向对应的奖品索引
        const normalizedAngle = this.getNormalizedAngle();
        const anglePerPrize = (2 * Math.PI) / this.prizes.length;
        
        // 计算当前角度对应的奖品索引
        let index = Math.floor(normalizedAngle / anglePerPrize);
        if (index >= this.prizes.length) {
            index = this.prizes.length - 1;
        }
        
        return index;
    }
    
    // 获取标准化角度（12点方向为0，顺时针增加）
    getNormalizedAngle() {
        let angle = (-this.currentAngle) % (2 * Math.PI);
        if (angle < 0) angle += 2 * Math.PI;
        return angle;
    }
    
    // 计算加权扇区角度
    calculateSegmentAngles() {
        const totalWeight = this.prizes.reduce((sum, prize) => sum + prize.weight, 0);
        
        // 从12点方向开始计算
        let currentAngle = 0;
        
        this.prizes.forEach(prize => {
            const angle = (prize.weight / totalWeight) * 2 * Math.PI;
            prize.startAngle = currentAngle;
            prize.endAngle = currentAngle + angle;
            currentAngle += angle;
        });
        
        // 打印每个奖品的角度范围用于调试
        this.prizes.forEach((prize, index) => {
            console.log(`奖品${index}: ${prize.text}, 角度范围: ${(prize.startAngle * 180 / Math.PI).toFixed(1)}° - ${(prize.endAngle * 180 / Math.PI).toFixed(1)}°`);
        });
    }
    
    // 角度转换：将当前角度转换为相对于12点方向的角度
    normalizeAngleForDisplay(angle) {
        // 12点方向为0度，顺时针增加
        let normalized = (-angle + Math.PI / 2) % (2 * Math.PI);
        if (normalized < 0) {
            normalized += 2 * Math.PI;
        }
        return normalized;
    }
    
    init() {
        this.drawWheel();
        this.drawOuterRing();
    }
    
    // 绘制转盘
    drawWheel() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制每个扇形
        for (let i = 0; i < this.prizes.length; i++) {
            const prize = this.prizes[i];
            
            // 角度计算：使用统一的角度转换系统
            const normalizedAngle = this.normalizeAngleForDisplay(this.currentAngle);
            const startAngle = prize.startAngle - normalizedAngle;
            const endAngle = prize.endAngle - normalizedAngle;
            
            console.log(`绘制奖品${i}: ${prize.text}, 角度范围: ${(startAngle * 180 / Math.PI).toFixed(1)}° - ${(endAngle * 180 / Math.PI).toFixed(1)}°, 当前角度: ${(this.currentAngle * 180 / Math.PI).toFixed(1)}°`);
            
            // 绘制扇形
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = prize.color;
            this.ctx.fill();
            
            // 绘制文字
            this.drawText(prize.text, startAngle, endAngle, prize.color);
        }
        
        // 绘制中心圆
        this.drawCenterCircle();
    }
    
    // 绘制文字
    drawText(text, startAngle, endAngle, bgColor) {
        const textAngle = (startAngle + endAngle) / 2;
        const textRadius = this.radius * 0.7;
        const x = this.centerX + Math.cos(textAngle) * textRadius;
        const y = this.centerY + Math.sin(textAngle) * textRadius;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(textAngle + Math.PI / 2);
        
        // 根据背景色选择文字颜色
        this.ctx.fillStyle = this.getContrastColor(bgColor);
        
        // 隐藏大奖使用竖排文字，其他使用正常横排
        if (text === '隐藏大奖') {
            this.ctx.font = 'bold 12px Microsoft YaHei';
            // 竖排文字：每个字单独绘制
            const chars = text.split('');
            const lineHeight = 14;
            const startY = -(chars.length - 1) * lineHeight / 2;
            
            chars.forEach((char, index) => {
                this.ctx.save();
                this.ctx.translate(0, startY + index * lineHeight);
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                // 绘制文字轮廓
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.strokeText(char, 0, 0);
                
                // 绘制文字填充
                this.ctx.fillText(char, 0, 0);
                this.ctx.restore();
            });
        } else {
            this.ctx.font = 'bold 14px Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // 绘制文字轮廓
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(text, 0, 0);
            
            // 绘制文字填充
            this.ctx.fillText(text, 0, 0);
        }
        
        this.ctx.restore();
    }
    
    // 绘制中心圆
    drawCenterCircle() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 40, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
    
    // 绘制外圈
    drawOuterRing() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius + 10, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();
        
        // 内圈装饰
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius + 5, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#e67e22';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    // 获取对比色
    getContrastColor(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000' : '#fff';
    }
    
    // 根据权重选择奖品
    selectPrizeByWeight() {
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < this.prizes.length; i++) {
            cumulativeWeight += this.prizes[i].weight;
            if (random <= cumulativeWeight) {
                return i;
            }
        }
        
        return this.prizes.length - 1; // 默认返回最后一个
    }
    
    // 开始旋转
    spin() {
        if (this.isSpinning) return Promise.reject('转盘正在旋转中');
        
        this.isSpinning = true;
        
        // 1. 预先随机确定一个结果（简化为均匀随机索引 0-7）
        const prizeIndex = Math.floor(Math.random() * this.prizes.length);
        const prize = this.prizes[prizeIndex];
        
        // 2. 计算该扇区的中心角度（弧度）
        const sectorCenterAngle = prize.startAngle + (prize.endAngle - prize.startAngle) / 2;
        
        // 3. 计算目标角度：确保最终指针（12点方向）指向该中心
        // 归一规则与绘制一致：normalizedAngle = (-currentAngle + π/2)
        // 令 normalizedAngle_final = sectorCenterAngle
        // 则 currentAngle_final = π/2 - sectorCenterAngle
        const targetAngle = ((Math.PI / 2 - sectorCenterAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        
        // 4. 追加至少4圈旋转以获得动画效果
        const spins = 4 + Math.floor(Math.random() * 4); // 4-7圈
        const totalAngle = spins * 2 * Math.PI + targetAngle - this.currentAngle;
        
        return new Promise((resolve) => {
            this.animateSpin(totalAngle, () => {
                this.isSpinning = false;
                this.currentAngle = (this.currentAngle + totalAngle) % (2 * Math.PI);
                
                // 返回预先确定的结果，确保与显示一致
                resolve({
                    prize: prize,
                    index: prizeIndex
                });
            });
        });
    }
    
    // 旋转动画
    animateSpin(totalAngle, callback) {
        const duration = 5000;
        const startTime = Date.now();
        const startAngle = this.currentAngle;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 缓动函数
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentAngle = startAngle + totalAngle * easeOut;
            
            this.currentAngle = currentAngle;
            this.drawWheel();
            this.drawOuterRing();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        };
        
        animate();
    }
    
    // 获取当前指向的奖品
    getCurrentPrize() {
        const prize = this.getCurrentPrizeByAngle();
        return prize;
    }
    
    // 获取当前指向的奖品（备用实现）
    getCurrentPrizeByAngle() {
        const normalizedAngle = this.normalizeAngleForDisplay(this.currentAngle);
        
        for (let i = 0; i < this.prizes.length; i++) {
            const prize = this.prizes[i];
            const startAngle = prize.startAngle;
            const endAngle = prize.endAngle;
            
            if (normalizedAngle >= startAngle && normalizedAngle < endAngle) {
                return prize;
            }
        }
        
        return this.prizes[this.prizes.length - 1];
    }
    
    // 验证显示和实际结果是否一致
    validateDisplayConsistency() {
        const currentPrize = this.getCurrentPrize();
        console.log('验证显示一致性 - 当前指向:', currentPrize.text);
        return currentPrize;
    }
}
