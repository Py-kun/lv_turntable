class GridLottery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isSpinning = false;
        this.cells = [];
        this.order = [0,1,2,5,8,7,6,3];
        this.prizes = [
            { text: '谢谢惠顾', bubbleType: 'thanks', prize: '谢谢参与' },
            { text: '特等奖', bubbleType: 'special', prize: '特等奖' },
            { text: '很不幸奖', bubbleType: 'very_unlucky', prize: '很不幸奖' },
            { text: '不幸奖', bubbleType: 'unlucky', prize: '不幸奖' },
            { text: '抽奖', bubbleType: 'special', prize: '抽奖按钮' },
            { text: '二等奖', bubbleType: 'second', prize: '二等奖' },
            { text: '谢谢惠顾', bubbleType: 'thanks', prize: '谢谢参与' },
            { text: '参与奖', bubbleType: 'third', prize: '参与奖' },
            { text: '一等奖', bubbleType: 'first', prize: '一等奖' }
        ];
        this.render();
    }
    render() {
        this.container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'grid-lottery';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            const prize = this.prizes[i];
            const icon = this.getIcon(prize.bubbleType, prize.text);
            cell.innerHTML = `<div class="icon">${icon}</div><div class="label">${prize.text}</div>`;
            if (i === 4) cell.classList.add('grid-center');
            grid.appendChild(cell);
            this.cells.push(cell);
        }
        this.container.appendChild(grid);
    }
    getIcon(type, text) {
        if (text === '抽奖') return '🎯';
        switch (type) {
            case 'special': return '🎁';
            case 'first': return '🥇';
            case 'second': return '🥈';
            case 'third': return '🥉';
            case 'thanks': return '🍀';
            case 'unlucky': return '🪙';
            case 'very_unlucky': return '📸';
            default: return '✨';
        }
    }
    spin() {
        if (this.isSpinning) return Promise.reject('正在抽奖');
        this.isSpinning = true;
        const targetIndex = Math.floor(Math.random() * this.order.length);
        const loops = 3 + Math.floor(Math.random() * 2);
        const steps = loops * this.order.length + targetIndex + 1;
        let step = 0;
        let current = -1;
        return new Promise((resolve) => {
            this.container.querySelector('.grid-lottery').classList.add('marquee');
            const tick = () => {
                if (current >= 0) this.cells[this.order[current]].classList.remove('active');
                current = (current + 1) % this.order.length;
                this.cells[this.order[current]].classList.add('active');
                step++;
                const base = 50;
                const extra = Math.min(step / steps, 1) * 200;
                const delay = base + extra;
                if (step < steps) {
                    setTimeout(tick, delay);
                } else {
                    this.isSpinning = false;
                    this.container.querySelector('.grid-lottery').classList.remove('marquee');
                    const prizeIdx = this.order[current];
                    const prize = this.prizes[prizeIdx];
                    resolve({ prize, index: prizeIdx });
                }
            };
            setTimeout(tick, 100);
        });
    }
}
