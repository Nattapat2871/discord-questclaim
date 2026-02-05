# Discord Quest Claimer 

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Discord](https://img.shields.io/badge/Discord-Desktop-5865F2?style=for-the-badge&logo=discord)
![Version](https://img.shields.io/badge/Version-5.0_Stable-green)

![Visitor Badge](https://api.visitorbadge.io/api/VisitorHit?user=Nattapat2871&repo=discord-questclaim&countColor=%237B1E7A)

A powerful, stealthy, and feature-rich JavaScript tool designed to automatically complete **Discord Quests** (Play, Stream, Watch, and Activities) directly from the Discord client console.

**Developed by [Nattapat2871](https://github.com/Nattapat2871)**

---

## 🌟 Key Features

* **All Quest Types Supported:**
    * 🎮 `PLAY_ON_DESKTOP`: Spoofs running games without installing them.
    * 🎥 `STREAM_ON_DESKTOP`: Spoofs streaming in VC (*Requires you to share screen first*).
    * 📺 `WATCH_VIDEO` / `MOBILE`: Simulates video watching with human-like jitter.
    * 🧩 `PLAY_ACTIVITY`: Simulates embedded activities in Voice Channels.
* **Force Timer Logic (v5.0):** Uses local machine time to ensure the visual countdown works smoothly even if the Discord API lags, freezes, or disconnects (`ERR_CONNECTION_CLOSED`).
* **Visual Overlay:** A beautiful floating card in the bottom-right corner shows real-time progress.
* **Sound Alerts:** Plays a satisfying "Ding!" sound notification upon quest completion.
* **Safety Buffer:** Adds a small time buffer (+30s) to ensure quests trigger completion 100% of the time.
* **Smart Cleanup:** Automatically restores original Discord functions and removes the UI when finished or closed.

## ⚠️ Important Note

> **This script DOES NOT work in a web browser (Chrome, Edge, etc.) for Game Quests!**
> Discord has updated their system to check for local processes. You **MUST** use the **Discord Desktop App** (Stable, PTB, or Canary) to complete Play/Stream quests.

## 🚀 How to Use

1.  **Open Discord** and go to **Discover > Quests**.
2.  **Accept** the quest(s) you want to complete.
3.  **Get the Code:**
    * [**Click here to view the latest code**](https://raw.githubusercontent.com/Nattapat2871/discord-questclaim/main/discord-questclaim.js)
    * Select all (`Ctrl + A`) and Copy (`Ctrl + C`).
4.  **Open Developer Console:**
    * In Discord, press `Ctrl` + `Shift` + `I`.
    * Click on the **"Console"** tab.
5.  **Allow Pasting:**
    * If you see a red warning message, type `allow pasting` and hit **Enter**.
6.  **Run:**
    * Paste the code (`Ctrl + V`) into the console and hit **Enter**.

### For "Stream" Quests 🎥
If your quest requires you to **"Stream a game to a friend"**:
1.  Join a Voice Channel (VC) with at least one other account (friend or bot).
2.  Click "Share Your Screen" and select **any** application (e.g., Notepad, Calculator).
3.  Run the script. It will hijack your stream status to match the required game.

## 🎮 Controls

Once running, you will see a UI overlay in the bottom right.

* **To Close/Stop Manually:**
    * Click the **Red X icon** or **Close Button** on the floating overlay.
    * **OR** Type the following command in the console:
        ```javascript
        nam.close()
        ```

## ❓ FAQ

**Q: The logs show `ERR_CONNECTION_CLOSED` or Network Error, is it broken?**
A: **No.** The script uses "Force Timer" logic. Even if your internet flickers or Discord API disconnects, the script will continue counting down locally and force the completion state once the time is up. Just wait for the timer!

**Q: Can I get banned?**
A: Use at your own risk. While this script uses stealthy methods (hijacking internal stores rather than spamming API), automating actions technically violates Discord ToS.

**Q: Nothing happens when I run the script.**
A: Make sure you have actually clicked **"Accept Quest"** in the Quests tab before running the script.

---
