// 背景音乐控制器
class MusicPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.5; // 默认音量50%
        this.isMuted = false;
        this.previousVolume = 0.5; // 记录静音前的音量
        this.init();
    }

    init() {
        // 创建音频元素
        this.audio = new Audio('music/background-music.mp3');
        this.audio.loop = true; // 循环播放
        this.audio.volume = this.volume;
        this.audio.autoplay = true; // 尝试自动播放
        
        // 初始化控制面板
        this.createMusicControls();
        
        // 添加事件监听
        this.addEventListeners();
        
        // 尝试自动播放
        this.tryAutoPlay();
    }
    
    // 尝试自动播放（可能受浏览器策略限制）
    tryAutoPlay() {
        // 尝试播放
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayIcon();
                console.log('自动播放成功');
            })
            .catch(error => {
                console.log('自动播放被浏览器阻止，需要用户交互:', error);
                // 监听用户首次点击页面，然后开始播放
                const startPlayOnUserInteraction = () => {
                    this.play();
                    document.removeEventListener('click', startPlayOnUserInteraction);
                };
                document.addEventListener('click', startPlayOnUserInteraction);
            });
    }

    createMusicControls() {
        // 创建音乐控制面板HTML
        const musicControlHTML = `
            <div class="music-control">
                <div class="music-control-inner">
                    <button id="toggle-music" class="music-btn">
                        <i class="music-icon play-icon"></i>
                    </button>
                    <div class="volume-control">
                        <button id="toggle-mute" class="music-btn">
                            <i class="music-icon volume-icon"></i>
                        </button>
                        <input type="range" id="volume-slider" min="0" max="100" value="50" class="volume-slider">
                    </div>
                </div>
            </div>
        `;
        
        // 将控制面板添加到页面
        document.body.insertAdjacentHTML('beforeend', musicControlHTML);
    }

    addEventListeners() {
        // 播放/暂停按钮
        const toggleBtn = document.getElementById('toggle-music');
        toggleBtn.addEventListener('click', () => this.togglePlay());
        
        // 静音按钮
        const muteBtn = document.getElementById('toggle-mute');
        muteBtn.addEventListener('click', () => this.toggleMute());
        
        // 音量滑块
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
            this.updateVolumeIcon();
        });
        
        // 页面加载完成后自动播放
        window.addEventListener('load', () => {
            // 由于浏览器策略限制，不能自动播放，需要用户交互
            // 这里只更新UI状态
            this.updatePlayIcon();
            this.updateVolumeIcon();
        });
        
        // 添加拖拽功能
        this.addDragFunctionality();
    }
    
    // 添加拖拽功能
    addDragFunctionality() {
        const musicControl = document.querySelector('.music-control');
        const musicControlInner = document.querySelector('.music-control-inner');
        
        let isDragging = false;
        let offsetX, offsetY;
        
        // 鼠标按下事件
        musicControlInner.addEventListener('mousedown', (e) => {
            // 如果点击的是按钮或滑块，不启动拖拽
            if (e.target.closest('.music-btn') || e.target.closest('.volume-slider')) {
                return;
            }
            
            isDragging = true;
            
            // 计算鼠标在元素内的偏移量
            const rect = musicControl.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // 添加临时样式
            musicControl.style.transition = 'none';
            musicControl.style.opacity = '0.8';
        });
        
        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            // 计算新位置
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // 设置新位置
            musicControl.style.left = `${x}px`;
            musicControl.style.top = `${y}px`;
            musicControl.style.right = 'auto';
            musicControl.style.bottom = 'auto';
        });
        
        // 鼠标释放事件
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                musicControl.style.transition = 'all 0.3s ease';
                musicControl.style.opacity = '1';
            }
        });
        
        // 触摸事件支持
        musicControlInner.addEventListener('touchstart', (e) => {
            // 如果触摸的是按钮或滑块，不启动拖拽
            if (e.target.closest('.music-btn') || e.target.closest('.volume-slider')) {
                return;
            }
            
            const touch = e.touches[0];
            isDragging = true;
            
            // 计算触摸点在元素内的偏移量
            const rect = musicControl.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            
            // 添加临时样式
            musicControl.style.transition = 'none';
            musicControl.style.opacity = '0.8';
        }, { passive: true });
        
        // 触摸移动事件
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            
            // 计算新位置
            const x = touch.clientX - offsetX;
            const y = touch.clientY - offsetY;
            
            // 设置新位置
            musicControl.style.left = `${x}px`;
            musicControl.style.top = `${y}px`;
            musicControl.style.right = 'auto';
            musicControl.style.bottom = 'auto';
        }, { passive: true });
        
        // 触摸结束事件
        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                musicControl.style.transition = 'all 0.3s ease';
                musicControl.style.opacity = '1';
            }
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updatePlayIcon();
            })
            .catch(error => {
                console.error('播放失败:', error);
            });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayIcon();
    }

    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    mute() {
        this.previousVolume = this.audio.volume;
        this.audio.volume = 0;
        this.isMuted = true;
        document.getElementById('volume-slider').value = 0;
        this.updateVolumeIcon();
    }

    unmute() {
        this.audio.volume = this.previousVolume;
        this.isMuted = false;
        document.getElementById('volume-slider').value = this.previousVolume * 100;
        this.updateVolumeIcon();
    }

    setVolume(value) {
        this.audio.volume = value;
        this.volume = value;
        if (value > 0 && this.isMuted) {
            this.isMuted = false;
        } else if (value === 0) {
            this.isMuted = true;
        }
    }

    updatePlayIcon() {
        const icon = document.querySelector('.play-icon');
        if (this.isPlaying) {
            icon.classList.remove('play-icon');
            icon.classList.add('pause-icon');
        } else {
            icon.classList.remove('pause-icon');
            icon.classList.add('play-icon');
        }
    }

    updateVolumeIcon() {
        const icon = document.querySelector('.volume-icon');
        if (this.isMuted || this.audio.volume === 0) {
            icon.classList.remove('volume-icon');
            icon.classList.add('mute-icon');
        } else {
            icon.classList.remove('mute-icon');
            icon.classList.add('volume-icon');
        }
    }
}

// 初始化音乐播放器
const musicPlayer = new MusicPlayer();