// Discord QuestClaim - Vesktop Safe Compatibility Monitor
// Author: nattapat2871 (https://nattapat2871.me)
//
// This companion script is intentionally read-only. It detects Vesktop and
// displays Discord Quest progress based on real client activity. It does not
// create fake processes, fake stream metadata, synthetic heartbeats, or mutate
// Discord stores.

(async function () {
    const PREFIX = "[Discord-QuestClaim/Vesktop]";
    const POLL_INTERVAL_MS = 2000;

    if (typeof window === "undefined" || typeof window.VesktopNative === "undefined") {
        console.error(`${PREFIX} Vesktop was not detected. Run this inside Vesktop DevTools.`);
        return;
    }

    let wpRequire;
    try {
        wpRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
        window.webpackChunkdiscord_app.pop();
    } catch (error) {
        console.error(`${PREFIX} Failed to access Discord modules.`, error);
        return;
    }

    const modules = Object.values(wpRequire.c || {});
    const findExport = predicate => {
        for (const module of modules) {
            const exports = module?.exports;
            if (!exports) continue;

            const candidates = [exports, exports.default, exports.Z, exports.ZP, exports.A, exports.Ay].filter(Boolean);
            for (const candidate of candidates) {
                try {
                    if (predicate(candidate)) return candidate;
                } catch (_) {}
            }
        }
        return null;
    };

    const QuestsStore = findExport(x => typeof x?.getQuest === "function" || typeof x?.getQuests === "function" || x?.quests instanceof Map);
    const RunningGameStore = findExport(x => typeof x?.getRunningGames === "function");
    const ApplicationStreamingStore = findExport(x => typeof x?.getStreamerActiveStreamMetadata === "function");

    if (!QuestsStore) {
        console.error(`${PREFIX} Could not locate QuestsStore.`);
        return;
    }

    const getQuestCollection = () => {
        try {
            const raw = QuestsStore.quests ?? QuestsStore.getQuests?.();
            if (raw instanceof Map) return [...raw.values()];
            if (Array.isArray(raw)) return raw;
            return Object.values(raw || {});
        } catch (_) {
            return [];
        }
    };

    const getTask = quest => {
        const config = quest?.config?.taskConfig || quest?.config?.taskConfigV2;
        if (!config?.tasks) return null;
        const supported = ["PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP"];
        const type = Object.keys(config.tasks).find(key => supported.includes(key));
        if (!type) return null;
        return {
            type,
            target: Number(config.tasks[type]?.target || 0)
        };
    };

    const getProgress = (quest, type) => {
        if (quest?.config?.configVersion === 1 && type === "STREAM_ON_DESKTOP") {
            return Number(quest?.userStatus?.streamProgressSeconds || 0);
        }
        return Number(quest?.userStatus?.progress?.[type]?.value || 0);
    };

    const getApplicationId = quest => String(
        quest?.config?.application?.id
        || quest?.config?.applicationId
        || quest?.config?.application_id
        || ""
    );

    const getApplicationName = quest =>
        quest?.config?.application?.name
        || quest?.config?.applicationName
        || quest?.config?.messages?.questName
        || "Unknown Game";

    const getRealActivityState = (quest, taskType) => {
        const applicationId = getApplicationId(quest);
        const applicationName = getApplicationName(quest).toLowerCase();

        if (taskType === "PLAY_ON_DESKTOP") {
            let games = [];
            try {
                games = RunningGameStore?.getRunningGames?.() || [];
            } catch (_) {}

            const game = games.find(entry => {
                const idMatches = applicationId && String(entry?.id || "") === applicationId;
                const name = String(entry?.name || entry?.processName || "").toLowerCase();
                return idMatches || (!!applicationName && name === applicationName);
            });

            return game
                ? { active: true, text: `Real game detected: ${game.name || game.processName || "running"}` }
                : { active: false, text: "Start the real game with Vesktop Rich Presence enabled" };
        }

        if (taskType === "STREAM_ON_DESKTOP") {
            let stream = null;
            try {
                stream = ApplicationStreamingStore?.getStreamerActiveStreamMetadata?.() || null;
            } catch (_) {}

            const matches = !!stream && (!applicationId || String(stream.id || "") === applicationId);
            return matches
                ? { active: true, text: "Real Vesktop stream detected" }
                : { active: false, text: "Start a real stream of the required game in Vesktop" };
        }

        return { active: false, text: "Waiting for real activity" };
    };

    const root = document.createElement("div");
    root.id = "discord-questclaim-vesktop-monitor";
    Object.assign(root.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        width: "360px",
        maxHeight: "55vh",
        overflowY: "auto",
        zIndex: "999999",
        padding: "14px",
        borderRadius: "10px",
        background: "#1e1f22",
        color: "#f2f3f5",
        boxShadow: "0 8px 30px rgba(0,0,0,.45)",
        fontFamily: "gg sans, system-ui, sans-serif",
        fontSize: "13px"
    });

    document.body.appendChild(root);

    let active = true;

    const escapeHtml = value => String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const render = () => {
        const quests = getQuestCollection().filter(quest => {
            const task = getTask(quest);
            return task
                && quest?.userStatus?.enrolledAt
                && !quest?.userStatus?.completedAt
                && (!quest?.config?.expiresAt || new Date(quest.config.expiresAt).getTime() > Date.now());
        });

        const cards = quests.map(quest => {
            const task = getTask(quest);
            const progress = Math.max(0, Math.floor(getProgress(quest, task.type)));
            const target = Math.max(0, Math.floor(task.target));
            const percent = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
            const activity = getRealActivityState(quest, task.type);
            const questName = quest?.config?.messages?.questName || getApplicationName(quest);

            return `
                <div style="margin-top:10px;padding:10px;border-radius:8px;background:#2b2d31;border:1px solid #3f4147;">
                    <div style="font-weight:700;">${escapeHtml(questName)}</div>
                    <div style="margin-top:4px;color:#b5bac1;">${escapeHtml(task.type)} · ${progress}/${target}s (${percent}%)</div>
                    <div style="margin-top:6px;color:${activity.active ? "#57f287" : "#f0b232"};">${escapeHtml(activity.text)}</div>
                </div>`;
        }).join("");

        root.innerHTML = `
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <div>
                    <div style="font-weight:800;color:#5865f2;">Discord QuestClaim · Vesktop</div>
                    <div style="margin-top:2px;color:#b5bac1;">Real activity / read-only progress monitor</div>
                </div>
                <button id="dqc-vesktop-close" style="border:0;border-radius:6px;padding:5px 8px;background:#da373c;color:white;cursor:pointer;">Close</button>
            </div>
            ${cards || '<div style="margin-top:12px;color:#b5bac1;">No active Play/Stream desktop quests found.</div>'}
        `;

        root.querySelector("#dqc-vesktop-close")?.addEventListener("click", close);
    };

    const close = () => {
        active = false;
        root.remove();
        delete window.namVesktopMonitor;
        console.log(`${PREFIX} Monitor stopped.`);
    };

    window.namVesktopMonitor = { close };
    console.log(`${PREFIX} Vesktop detected. Read-only quest monitor started.`);
    console.log(`${PREFIX} This mode never spoofs process, stream, heartbeat, or quest progress data.`);

    while (active) {
        render();
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    }
})();
