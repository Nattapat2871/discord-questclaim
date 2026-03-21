(async function() {
    // ============================================================
    // 1. CONFIG & MODULES
    // ============================================================
    const PREFIX = "[Discord-QuestClaim]";
    
    console.log(`%c${PREFIX} By Nattapat2871 (v6.4 General Edition - Real-time Sync)`, "color: #5865F2; font-weight: bold; font-size: 14px;");
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
    // 2. UI MANAGER (Status Overlay)
    // ============================================================
    class OverlayUI {
        constructor() {
            this.element = null;
        }

        buildInterface(onClose) {
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

        updateStatus(text, subtext = "") {
            if (!this.element) return;
            const statusEl = this.element.querySelector('#quest-status-text');
            const timeEl = this.element.querySelector('#quest-time-text');
            if (statusEl) statusEl.innerText = text;
            if (timeEl) timeEl.innerText = subtext;
        }

        destroyInterface() {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        }
    }

    // ============================================================
    // 3. LOGIC (Hybrid Real-time & Server Sync)
    // ============================================================
    class QuestAutomator {
        constructor(mods) {
            this.m = mods;
            this.ui = new OverlayUI();
            this.isActive = true;
            this.cachedGetRunningGames = null;
            this.cachedGetGameForPID = null;
            this.cachedGetStreamMetadata = null;
            this.simulatedGameData = null;
            this.isDesktopClient = typeof DiscordNative !== "undefined";
        }

        printLog(msg, style = "") {
            if (style) console.log(`%c${PREFIX} ${msg}`, style);
            else console.log(`${PREFIX} ${msg}`);
        }

        triggerSuccessAudio() {
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

        get availableQuests() {
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

        async autoRedeemReward(quest) {
            const questName = quest.config.messages.questName;
            try {
                this.printLog(`🎁 กำลังพยายามกดรับรางวัลสำหรับเควส: ${questName}...`, "color: #faa61a");
                await this.m.api.post({ url: `/quests/${quest.id}/claim` });
                this.printLog(`✅ รับรางวัลเควส ${questName} สำเร็จแล้ว!`, "color: #57F287; font-weight: bold;");
                this.ui.updateStatus(`Claimed: ${questName}`, `ได้รับของรางวัลเรียบร้อย!`);
            } catch (e) {
                const errorMsg = e.body?.message || e.message || "Unknown Error";
                this.printLog(`⚠️ ไม่สามารถรับรางวัล ${questName} อัตโนมัติได้ (อาจจะต้องไปกดรับเอง): ${errorMsg}`, "color: red");
            }
        }

        async startFarming() {
            this.ui.buildInterface(() => this.terminateScript());
            this.ui.updateStatus("Scanning for quests...");
            
            const quests = this.availableQuests;
            if (quests.length === 0) {
                this.printLog("🔎 Found 0 active quests.");
                this.ui.updateStatus("No active quests found.", "Idle");
                setTimeout(() => this.terminateScript(), 5000);
                return;
            }

            this.printLog(`🔎 Found ${quests.length} active quests.`, "color: lightgreen");

            for (const quest of quests) {
                if (!this.isActive) break;
                await this.executeQuestBypass(quest);
            }

            if (this.isActive) {
                this.triggerSuccessAudio();
                this.printLog("🎉 All quests finished!", "color: gold; font-weight: bold");
                this.ui.updateStatus("🎉 All quests finished!", "Done.");
                setTimeout(() => this.terminateScript(), 10000);
            }
        }

        async executeQuestBypass(quest) {
            const config = quest.config.taskConfig || quest.config.taskConfigV2;
            const supported = ["WATCH_VIDEO", "WATCH_VIDEO_ON_MOBILE", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY"];
            const taskType = Object.keys(config.tasks).find(k => supported.includes(k));
            const target = config.tasks[taskType].target;
            const current = quest.userStatus?.progress?.[taskType]?.value || 0;
            const remaining = target - current;
            const questName = quest.config.messages.questName;

            if (remaining <= 0) return;

            this.printLog(`Processing: ${questName} (${taskType})`, "color: cyan");

            if (taskType === "PLAY_ON_DESKTOP") {
                if (!this.isDesktopClient) {
                    this.printLog(`⚠️ Skipping ${questName}: Must use Discord Desktop App for this quest.`, "color: red");
                    return;
                }
                await this.emulateDesktopGame(quest, target, taskType);
            } else if (taskType === "STREAM_ON_DESKTOP") {
                if (!this.isDesktopClient) {
                    this.printLog(`⚠️ Skipping ${questName}: Must use Discord Desktop App for this quest.`, "color: red");
                    return;
                }
                await this.emulateStreaming(quest, target, taskType);
            } else if (taskType === "WATCH_VIDEO" || taskType === "WATCH_VIDEO_ON_MOBILE") {
                await this.emulateVideoWatch(quest, target, current);
            } else if (taskType === "PLAY_ACTIVITY") {
                await this.emulateActivity(quest, target);
            }

            if (this.isActive) {
                await this.autoRedeemReward(quest);
            }
        }

        // ============================================================
        // ฟังก์ชันใหม่: นับเวลาเรียลไทม์ + Sync เซิร์ฟเวอร์ + Logs แจ้งเตือนเวลา
        // ============================================================
        monitorServerSync(quest, targetSeconds, taskName, appName) {
            return new Promise((resolve) => {
                let currentProgress = quest.config.configVersion === 1 ? quest.userStatus?.streamProgressSeconds : quest.userStatus?.progress?.[taskName]?.value;
                currentProgress = Math.floor(currentProgress || 0);

                let lastLoggedMinute = -1; // สำหรับ Log เวลาที่เหลือ

                const updateUIProgress = (prog) => {
                    const remaining = Math.max(0, targetSeconds - prog);
                    const mins = Math.floor(remaining / 60);
                    const secs = remaining % 60;
                    const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                    this.ui.updateStatus(`กำลังทำเควส: ${appName}`, `ความคืบหน้า: ${prog}/${targetSeconds} วิ (เหลือ ${timeString})`);

                    // เพิ่มการแจ้งเตือนเวลาใน Console
                    if (mins !== lastLoggedMinute && mins > 0) {
                        this.printLog(`⌛ ${mins} minute remaining.`, "color: #00ffff; font-weight: bold;");
                        lastLoggedMinute = mins;
                    }
                };

                updateUIProgress(currentProgress);

                const realTimeTick = setInterval(() => {
                    if (!this.isActive) {
                        clearInterval(realTimeTick);
                        return;
                    }
                    if (currentProgress < targetSeconds) {
                        currentProgress++;
                        updateUIProgress(currentProgress);
                    }
                }, 1000);

                const onHeartbeatTick = (data) => {
                    if (!this.isActive) {
                        clearInterval(realTimeTick);
                        this.m.FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeatTick);
                        return resolve();
                    }
                    
                    let serverProgress = quest.config.configVersion === 1 ? data.userStatus?.streamProgressSeconds : data.userStatus?.progress?.[taskName]?.value;
                    serverProgress = Math.floor(serverProgress || 0);

                    currentProgress = serverProgress;
                    updateUIProgress(currentProgress);
                    
                    this.printLog(`📡 Server Sync: ${serverProgress}/${targetSeconds} seconds`, "color: #b5bac1");
                    
                    if (serverProgress >= targetSeconds) {
                        clearInterval(realTimeTick);
                        this.m.FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeatTick);
                        resolve();
                    }
                };
                
                this.m.FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeatTick);
                
                const backgroundCheck = setInterval(() => {
                    if (!this.isActive) {
                        clearInterval(backgroundCheck);
                        clearInterval(realTimeTick);
                        this.m.FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", onHeartbeatTick);
                        resolve();
                    }
                }, 1000);
            });
        }

        async emulateDesktopGame(quest, targetSeconds, taskType) {
            const applicationId = quest.config.application.id;
            const applicationName = quest.config.application.name;
            const processId = Math.floor(Math.random() * 30000) + 1000;

            this.ui.updateStatus(`กำลังเตรียมข้อมูลเกม: ${applicationName}...`);

            try {
                const res = await this.m.api.get({url: `/applications/public?application_ids=${applicationId}`});
                const appData = res.body[0];
                const targetExeName = appData.executables?.find(x => x.os === "win32")?.name?.replace(">", "") ?? appData.name.replace(/[\/\\:*?"<>|]/g, "");
                
                const mockedGameData = {
                    cmdLine: `C:\\Program Files\\${appData.name}\\${targetExeName}`,
                    exeName: targetExeName,
                    exePath: `c:/program files/${appData.name.toLowerCase()}/${targetExeName}`,
                    hidden: false,
                    isLauncher: false,
                    id: applicationId,
                    name: appData.name,
                    pid: processId,
                    pidPath: [processId],
                    processName: appData.name,
                    start: Date.now(),
                };

                this.cachedGetRunningGames = this.m.RunningGameStore.getRunningGames;
                this.cachedGetGameForPID = this.m.RunningGameStore.getGameForPID;
                this.simulatedGameData = mockedGameData;
                
                const activeGamesList = [mockedGameData];
                this.m.RunningGameStore.getRunningGames = () => activeGamesList;
                this.m.RunningGameStore.getGameForPID = (p) => activeGamesList.find(x => x.pid === p);
                this.m.FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [], added: [mockedGameData], games: activeGamesList });

                this.printLog(`🎮 Emulating game "${applicationName}" (EXE: ${targetExeName})...`, "color: #faa61a; font-weight: bold; font-size: 13px;");
                
                await this.monitorServerSync(quest, targetSeconds, taskType, applicationName);
                
                this.triggerSuccessAudio();
                this.printLog(`quest successfully : ${applicationName}`, "color: #57F287");
                this.resetDiscordState();

            } catch (error) {
                this.printLog(`⚠️ Error setting up game emulator: ${error.message}`, "color: red");
            }
        }

        async emulateStreaming(quest, targetSeconds, taskType) {
            const { id, name } = quest.config.application;
            const processId = Math.floor(Math.random() * 30000) + 1000;

            this.cachedGetStreamMetadata = this.m.ApplicationStreamingStore.getStreamerActiveStreamMetadata;
            this.m.ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({ id, pid: processId, sourceName: null });

            this.printLog(`🎥 Emulating stream for "${name}"...`, "color: #faa61a; font-weight: bold; font-size: 13px;");
            
            await this.monitorServerSync(quest, targetSeconds, taskType, name);

            this.triggerSuccessAudio();
            this.printLog(`quest successfully : ${name}`, "color: #57F287");
            this.resetDiscordState();
        }

        async emulateVideoWatch(quest, target, start) {
            let currentProgress = start;
            const questName = quest.config.messages.questName;
            this.ui.updateStatus(`Watching: ${questName}`, `Progress: ${currentProgress}/${target}`);
            
            while (currentProgress < target && this.isActive) {
                const stepForward = Math.min(target, currentProgress + 30);
                const randomizedDelay = Math.random() * 0.9;
                const timestampData = stepForward + randomizedDelay;

                try {
                    await this.m.api.post({ url: `/quests/${quest.id}/video-progress`, body: { timestamp: timestampData } });
                    
                    currentProgress = stepForward;
                    this.ui.updateStatus(`Watching Video...`, `Progress: ${Math.floor(currentProgress)}/${target}`);
                    this.printLog(`📺 Video Sync: ${Math.floor(currentProgress)}/${target}`, "color: #00ffff");
                    
                    await new Promise(r => setTimeout(r, 2000));
                } catch (e) {
                    const errorMsg = e.body?.message || e.message || "Unknown Error";
                    console.warn(`${PREFIX} ⚠️ Network Issue (Retrying...):`, errorMsg);
                    this.ui.updateStatus(`Connection Issue`, `Retrying...`);
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
            
            this.triggerSuccessAudio();
            this.printLog(`quest successfully : ${questName}`, "color: #57F287");
        }

        async emulateActivity(quest, target) {
            const questName = quest.config.messages.questName;
            const activeChannel = this.m.ChannelStore.getSortedPrivateChannels()[0]?.id 
                            ?? Object.values(this.m.GuildChannelStore.getAllGuilds() || {}).find(x => x?.VOCAL?.length > 0)?.VOCAL[0]?.channel.id;
            
            if (!activeChannel) {
                this.printLog("⚠️ Activity emulation requires an active voice channel.", "color: red");
                return;
            }

            const activeStreamKey = `call:${activeChannel}:1`;
            this.printLog(`🧩 Emulating Activity: ${questName}`, "color: #faa61a");
            
            let progressData = 0;
            const backgroundPulse = setInterval(async () => {
                if (!this.isActive) clearInterval(backgroundPulse);
                try {
                    const res = await this.m.api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: activeStreamKey, terminal: false}});
                    progressData = res.body.progress.PLAY_ACTIVITY.value;
                    this.ui.updateStatus(`ทำกิจกรรม: ${questName}`, `ความคืบหน้า: ${progressData}/${target}`);
                    this.printLog(`🧩 Activity Sync: ${progressData}/${target}`, "color: #b5bac1");
                    
                    if (progressData >= target) {
                        clearInterval(backgroundPulse);
                        await this.m.api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: activeStreamKey, terminal: true}});
                    }
                } catch (e) {
                    console.warn(`${PREFIX} ⚠️ Network Drop during activity:`, e.message);
                }
            }, 20000);

            while (progressData < target && this.isActive) {
                await new Promise(r => setTimeout(r, 2000));
            }
            
            this.triggerSuccessAudio();
            this.printLog(`quest successfully : ${questName}`, "color: #57F287");
        }

        resetDiscordState() {
            if (this.cachedGetRunningGames) {
                this.m.RunningGameStore.getRunningGames = this.cachedGetRunningGames;
                this.cachedGetRunningGames = null;
            }
            if (this.cachedGetGameForPID) {
                this.m.RunningGameStore.getGameForPID = this.cachedGetGameForPID;
                this.cachedGetGameForPID = null;
            }
            if (this.cachedGetStreamMetadata) {
                this.m.ApplicationStreamingStore.getStreamerActiveStreamMetadata = this.cachedGetStreamMetadata;
                this.cachedGetStreamMetadata = null;
            }
            if (this.simulatedGameData) {
                this.m.FluxDispatcher.dispatch({ type: "RUNNING_GAMES_CHANGE", removed: [this.simulatedGameData], added: [], games: [] });
                this.simulatedGameData = null;
            }
        }

        terminateScript() {
            this.isActive = false;
            this.resetDiscordState();
            this.ui.destroyInterface();
            this.printLog("🛑 Script terminated safely.", "color: red");
            delete window.nam;
        }
    }

    const runner = new QuestAutomator(modules);
    window.nam = { close: () => runner.terminateScript() };
    runner.startFarming();
})();
