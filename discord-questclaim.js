(async function() {
    // ============================================================
    // 1. CONFIG & MODULES
    // ============================================================
    const PREFIX = "[Discord-QuestClaim]";
    
    console.log(`%c${PREFIX} By Nattapat2871 (v5.2 Reliable Sync)`, "color: #5865F2; font-weight: bold; font-size: 14px;");
    console.log(`%c${PREFIX} if you want to close this script use \`nam.close()\``, "color: #faa61a");
    console.log(`%c${PREFIX} ⚙️ Initializing...`, "color: cyan");

    let wpRequire;
    try {
        wpRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
        window.webpackChunkdiscord_app.pop();
    } catch {
        console.error(`${PREFIX} ❌ Failed to access Webpack.`);
        return;
    }

    const search = (filter) => Object.values(wpRequire.c).find(x => x?.exports && filter(x?.exports))?.exports;
    const findModule = (props) => search(x => props.every(p => x[p] || x.Z?.[p] || x.ZP?.[p]));

    // Extraction Logic
    let api = findModule(['get', 'post', 'put'])?.default || findModule(['get', 'post', 'put']);
    let RunningGameStore = findModule(['getRunningGames']);
    let QuestsStore = findModule(['getQuest', 'getQuests']);
    let FluxDispatcher = findModule(['dispatch', 'subscribe']);
    let ApplicationStreamingStore = findModule(['getStreamerActiveStreamMetadata']);
    let ChannelStore = findModule(['getChannel', 'getDMFromUserId']); 
    let GuildChannelStore = findModule(['getSFWDefaultChannel']);

    if (!RunningGameStore || !QuestsStore) {
        RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getRunningGames)?.exports?.ZP ?? Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getRunningGames)?.exports?.Ay;
        QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getQuest)?.exports?.Z ?? Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A;
        FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.flushWaitQueue)?.exports?.Z ?? Object.values(wpRequire.c).find(x => x?.exports?.h?.__proto__?.flushWaitQueue)?.exports?.h;
        api = Object.values(wpRequire.c).find(x => x?.exports?.tn?.get)?.exports?.tn ?? Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get)?.exports?.Bo;
    }

    const getStore = (m) => m?.Z || m?.ZP || m;
    RunningGameStore = getStore(RunningGameStore);
    QuestsStore = getStore(QuestsStore);
    ApplicationStreamingStore = getStore(ApplicationStreamingStore);
    ChannelStore = getStore(ChannelStore);
    GuildChannelStore = getStore(GuildChannelStore);

    const modules = { api, RunningGameStore, QuestsStore, FluxDispatcher, ApplicationStreamingStore, ChannelStore, GuildChannelStore };

    if (!QuestsStore || !RunningGameStore || !FluxDispatcher) {
        console.error(`${PREFIX} ❌ Failed to load modules.`, modules);
        return;
    }

    // ============================================================
    // 2. UI MANAGER
    // ============================================================
    class OverlayUI {
        constructor() {
            this.element = null;
        }

        create(onClose) {
            if (this.element) return;
            this.element = document.createElement('div');
            this.element.id = 'quest-claimer-overlay';
            
            const githubIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
            const closeIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ed4245" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

            Object.assign(this.element.style, {
                position: 'fixed', bottom: '20px', right: '20px',
                backgroundColor: '#2b2d31', color: '#ffffff', padding: '12px 16px',
                borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                zIndex: '99999', fontFamily: 'gg sans, sans-serif', minWidth: '280px',
                borderLeft: '4px solid #5865F2', transition: 'all 0.3s ease',
                display: 'flex', flexDirection: 'column'
            });

            this.element.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="font-weight: bold; color: #5865F2; font-size: 12px;">${PREFIX}</div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <a href="https://github.com/Nattapat2871/discord-questclaim" target="_blank" title="Visit GitHub" 
                           style="cursor: pointer; opacity: 0.7; display: flex; align-items: center; transition: 0.2s;">
                           ${githubIcon}
                        </a>
                        <div id="btn-close-script" title="Close Script (nam.close)" 
                             style="cursor: pointer; opacity: 0.8; display: flex; align-items: center; transition: 0.2s;">
                             ${closeIcon}
                        </div>
                    </div>
                </div>
                <div id="quest-status-text" style="font-size: 14px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Initializing...</div>
                <div id="quest-time-text" style="font-size: 13px; color: #b5bac1; margin-top: 4px; font-variant-numeric: tabular-nums;">waiting...</div>
            `;

            document.body.appendChild(this.element);
            const closeBtn = this.element.querySelector('#btn-close-script');
            if (closeBtn) closeBtn.onclick = onClose;
        }

        update(text, subtext = "") {
            if (!this.element) return;
            const statusEl = this.element.querySelector('#quest-status-text');
            const timeEl = this.element.querySelector('#quest-time-text');
            if (statusEl) statusEl.innerText = text;
            if (timeEl) timeEl.innerText = subtext;
        }

        remove() {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        }
    }

    // ============================================================
    // 3. LOGIC (Safe Increment)
    // ============================================================
    class QuestSpoofer {
        constructor(mods) {
            this.m = mods;
            this.ui = new OverlayUI();
            this.isRunning = true;
            this.originalGetRunningGames = null;
            this.originalGetStreamMetadata = null;
            this.fakeGameRef = null;
            this.isApp = typeof DiscordNative !== "undefined";
        }

        log(msg, style = "") {
            if (style) console.log(`%c${PREFIX} ${msg}`, style);
            else console.log(`${PREFIX} ${msg}`);
        }

        playSuccessSound() {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            } catch (e) {}
        }

        get activeQuests() {
            let qRaw = this.m.QuestsStore.quests;
            if (!qRaw && this.m.QuestsStore.getQuests) qRaw = this.m.QuestsStore.getQuests();
            const quests = qRaw instanceof Map ? [...qRaw.values()] : Object.values(qRaw || {});

            return quests.filter(q => {
                const config = q.config.taskConfig || q.config.taskConfigV2;
                const supported = ["WATCH_VIDEO", "WATCH_VIDEO_ON_MOBILE", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY"];
                const task = Object.keys(config.tasks).find(k => supported.includes(k));
                return q.userStatus?.enrolledAt && !q.userStatus?.completedAt && 
                       new Date(q.config.expiresAt).getTime() > Date.now() && task;
            });
        }

        async run() {
            this.ui.create(() => this.cleanup());
            this.ui.update("Scanning for quests...");
            
            const quests = this.activeQuests;
            if (quests.length === 0) {
                this.log("🔎 Found 0 active quests.");
                this.ui.update("No active quests found.", "Idle");
                setTimeout(() => this.cleanup(), 5000);
                return;
            }

            this.log(`🔎 Found ${quests.length} active quests.`, "color: lightgreen");

            for (const quest of quests) {
                if (!this.isRunning) break;
                await this.processQuest(quest);
            }

            if (this.isRunning) {
                this.playSuccessSound();
                this.log("🎉 All quests finished!", "color: gold; font-weight: bold");
                this.ui.update("🎉 All quests finished!", "You can claim rewards now.");
                setTimeout(() => this.cleanup(), 10000);
            }
        }

        async processQuest(quest) {
            const config = quest.config.taskConfig || quest.config.taskConfigV2;
            const supported = ["WATCH_VIDEO", "WATCH_VIDEO_ON_MOBILE", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY"];
            const taskType = Object.keys(config.tasks).find(k => supported.includes(k));
            const target = config.tasks[taskType].target;
            const current = quest.userStatus?.progress?.[taskType]?.value || 0;
            const remaining = target - current;
            const questName = quest.config.messages.questName;

            if (remaining <= 0) return;

            this.log(`Processing: ${questName} (${taskType})`, "color: cyan");

            if (taskType === "PLAY_ON_DESKTOP") {
                if (!this.isApp) {
                    this.log(`⚠️ Skipping ${questName}: Must use Discord Desktop App for this quest.`, "color: red");
                    return;
                }
                await this.spoofGame(quest, remaining);
            } else if (taskType === "STREAM_ON_DESKTOP") {
                if (!this.isApp) {
                    this.log(`⚠️ Skipping ${questName}: Must use Discord Desktop App for this quest.`, "color: red");
                    return;
                }
                await this.spoofStream(quest, remaining);
            } else if (taskType === "WATCH_VIDEO" || taskType === "WATCH_VIDEO_ON_MOBILE") {
                await this.spoofVideo(quest, target, current);
            } else if (taskType === "PLAY_ACTIVITY") {
                await this.spoofActivity(quest, target);
            }
        }

        async waitLoop(name, durationSeconds) {
            const safeDuration = durationSeconds + 30; 
            const startTime = Date.now();
            const endTime = startTime + (safeDuration * 1000);
            let lastLoggedMinute = -1;

            while (Date.now() < endTime && this.isRunning) {
                const timeLeft = Math.max(0, endTime - Date.now());
                const totalSeconds = Math.ceil(timeLeft / 1000);
                const mins = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

                this.ui.update(`กำลังทำเควส: ${name}`, `เหลือเวลาอีก ${timeString} นาที`);

                if (mins !== lastLoggedMinute && mins > 0) {
                    this.log(`⌛ ${mins} minute remaining.`, "color: #00ffff; font-weight: bold;");
                    lastLoggedMinute = mins;
                }
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        async spoofGame(quest, durationSeconds) {
            const { id, name } = quest.config.application;
            const pid = Math.floor(Math.random() * 30000) + 1000;
            const fakeGame = { name, id, pid, pidPath: [pid], exePath: "c:/fake/game.exe", processName: name, start: Date.now() };

            this.originalGetRunningGames = this.m.RunningGameStore.getRunningGames;
            this.fakeGameRef = fakeGame;
            
            this.m.RunningGameStore.getRunningGames = () => [fakeGame];
            this.m.FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [], added: [fakeGame], games: [fakeGame] });

            this.log(`🎮 Playing "${name}"...`, "color: #faa61a; font-weight: bold; font-size: 13px;");
            
            await this.waitLoop(name, durationSeconds);
            
            this.playSuccessSound();
            this.log(`quest successfully : ${name}`, "color: #57F287");
            this.restoreDiscord();
        }

        async spoofStream(quest, durationSeconds) {
            const { id, name } = quest.config.application;
            const pid = Math.floor(Math.random() * 30000) + 1000;

            this.originalGetStreamMetadata = this.m.ApplicationStreamingStore.getStreamerActiveStreamMetadata;
            this.m.ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({ id, pid, sourceName: null });

            this.log(`🎥 Streaming "${name}"...`, "color: #faa61a; font-weight: bold; font-size: 13px;");
            
            await this.waitLoop(name, durationSeconds);

            this.playSuccessSound();
            this.log(`quest successfully : ${name}`, "color: #57F287");
            this.restoreDiscord();
        }

        async spoofVideo(quest, target, start) {
            let current = start;
            const questName = quest.config.messages.questName;
            this.ui.update(`Watching: ${questName}`, `Progress: ${current}/${target}`);
            
            // Loop จะทำงานก็ต่อเมื่อ progress (current) ยังน้อยกว่าเป้าหมาย
            while (current < target && this.isRunning) {
                // 1. คำนวณเวลาที่อยากจะส่ง (แต่ยังไม่บวกใส่ current จริงๆ)
                const nextStep = Math.min(target, current + 30);
                const jitter = Math.random() * 0.9;
                const timestampToSend = nextStep + jitter;

                try {
                    // 2. ส่งข้อมูล
                    await this.m.api.post({ url: `/quests/${quest.id}/video-progress`, body: { timestamp: timestampToSend } });
                    
                    // 3. ***สำคัญ*** ส่งผ่านแล้วค่อยอัปเดต current
                    current = nextStep;
                    
                    this.ui.update(`Watching Video...`, `Progress: ${Math.floor(current)}/${target}`);
                    this.log(`📺 Video Progress: ${Math.floor(current)}/${target}`, "color: #00ffff");
                    
                    // รอ 2 วินาทีค่อยไปรอบต่อไป
                    await new Promise(r => setTimeout(r, 2000));

                } catch (e) {
                    // 4. ถ้า Error (400 Bad Request หรือ Net หลุด)
                    const errorMsg = e.body?.message || e.message || "Unknown Error";
                    console.warn(`${PREFIX} ⚠️ Network/API Error (Retrying in 5s...):`, errorMsg);
                    
                    this.ui.update(`Connection Error`, `Retrying...`);
                    
                    // ***สำคัญ*** ไม่บวก current, รอ 5 วินาที แล้ววนลูปเดิม (ส่งเวลาเดิม)
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
            
            this.playSuccessSound();
            this.log(`quest successfully : ${questName}`, "color: #57F287");
        }

        async spoofActivity(quest, target) {
            const questName = quest.config.messages.questName;
            const channelId = this.m.ChannelStore.getSortedPrivateChannels()[0]?.id 
                            ?? Object.values(this.m.GuildChannelStore.getAllGuilds() || {}).find(x => x?.VOCAL?.length > 0)?.VOCAL[0]?.channel.id;
            
            if (!channelId) {
                this.log("⚠️ Cannot find a voice channel for PLAY_ACTIVITY.", "color: red");
                return;
            }

            const streamKey = `call:${channelId}:1`;
            this.log(`🧩 Doing Activity: ${questName}`, "color: #faa61a");

            const interval = setInterval(async () => {
                if (!this.isRunning) clearInterval(interval);
                try {
                    await this.m.api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}});
                } catch (e) {
                    console.warn(`${PREFIX} ⚠️ Network Error during activity heartbeat:`, e.message);
                }
            }, 20000);

            await this.waitLoop(questName, target);
            
            clearInterval(interval);
            try {
                await this.m.api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}});
            } catch(e) {}
            
            this.playSuccessSound();
            this.log(`quest successfully : ${questName}`, "color: #57F287");
        }

        restoreDiscord() {
            if (this.originalGetRunningGames) {
                this.m.RunningGameStore.getRunningGames = this.originalGetRunningGames;
                this.originalGetRunningGames = null;
            }
            if (this.originalGetStreamMetadata) {
                this.m.ApplicationStreamingStore.getStreamerActiveStreamMetadata = this.originalGetStreamMetadata;
                this.originalGetStreamMetadata = null;
            }
            if (this.fakeGameRef) {
                this.m.FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [this.fakeGameRef], added: [], games: [] });
                this.fakeGameRef = null;
            }
        }

        cleanup() {
            this.isRunning = false;
            this.restoreDiscord();
            this.ui.remove();
            this.log("🛑 Script stopped and cleaned up.", "color: red");
            delete window.nam;
        }
    }

    const bot = new QuestSpoofer(modules);
    window.nam = { close: () => bot.cleanup() };
    bot.run();
})();
