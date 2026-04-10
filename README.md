# Discord Quest Claimer 

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Discord](https://img.shields.io/badge/Discord-Desktop-5865F2?style=for-the-badge&logo=discord)
![Version](https://img.shields.io/badge/Version-5.0_Stable-green)

![Visitor Badge](https://api.visitorbadge.io/api/VisitorHit?user=Nattapat2871&repo=discord-questclaim&countColor=%237B1E7A)

Language : [🇺🇸 English](README.md) | [🇹🇭 ไทย](README_th.md)

> [!CAUTION]
> # 🚩 IMPORTANT: QUEST AUTOMATION CRACKDOWN (APRIL 2026)
> **As of April 7th, 2026, Discord has expressed their intent to crack down on automating quest completion.**
> 
> Discord has recently updated their security systems to detect **"Inauthentic Engagement"**. Many users have already received the following system message:
> 
> <img width="836" height="272" alt="image" src="https://github.com/user-attachments/assets/751e8e41-37e2-41da-932c-304a1a7c6a8a" />
> 
> There isn't much that can be done to make any script 100% undetected. **Use this tool at your own risk**, as you most likely **WILL** get flagged by doing so.
>
>## ⚠️ Detailed Risk Information
>
>### 1. Discord Crackdown
>Discord has actively started flagging accounts using scripts for Quest automation. If flagged, you will receive an official **"Quest Activity Notice"** warning. Continued use may lead to permanent **Quest access limitations** or further account actions.
>
>### 2. Risk Acknowledgment
>* **Detection:** Any script bypassing Quest requirements carries a high risk of being flagged by Discord's anti-cheat and telemetry systems.
>* **Liability:** By using this tool, you acknowledge that **you are solely responsible** for any actions taken against your account (e.g., Quest restrictions or account suspension).
>* **Recommendation:** If you value your main account or have already received a warning, it is highly recommended to complete Quests manually or use an alternative account for testing.
>
>### 3. Technical Requirement & Stealth
>* **Desktop Client Only:** This script relies on internal Discord Desktop stores. It **will not work** in a web browser for game-based quests.
>* **Stealth Logic:** While this script uses "Force Timer" logic and human-like jitter to minimize detection, please understand that no automation is 100% invisible to server-side checks.

---

A powerful, stealthy, and feature-rich JavaScript tool designed to automatically complete **Discord Quests** (Play, Stream, Watch, and Activities) directly from the Discord client console.

**Developed by [Nattapat2871](https://github.com/Nattapat2871)**

---

<img width="1550" height="1023" alt="image" src="https://github.com/user-attachments/assets/f69014ef-6634-4754-bbb1-920825481587" />

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

## 🛠️ Prerequisites: Enable Developer Console

By default, Discord disables the Developer Console. You must enable it first to be able to paste the script. We have prepared a quick command to do this for you automatically!

1. Press `Windows + R` on your keyboard, type `cmd`, and hit **Enter** to open the Command Prompt.
2. **Copy and paste** the following command into the CMD window and hit **Enter**:

   ```cmd
   echo [INFO] Closing Discord... & taskkill /f /im discord.exe >nul 2>&1 & timeout /t 2 >nul & echo [INFO] Updating settings.json... & (echo {& echo   "IS_MAXIMIZED": false,& echo   "IS_MINIMIZED": false,& echo   "WINDOW_BOUNDS": {& echo     "x": 295,& echo     "y": 167,& echo     "width": 1284,& echo     "height": 724& echo   },& echo   "DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true,& echo   "MIN_WIDTH": 940,& echo   "MIN_HEIGHT": 500,& echo   "chromiumSwitches": {},& echo   "BACKGROUND_COLOR": "#2c2d32",& echo   "openH264Enabled": true,& echo   "audioSubsystem": "experimental",& echo   "offloadAdmControls": true& echo }) > "%appdata%\discord\settings.json" & echo [INFO] Starting Discord... & start "" "%localappdata%\Discord\Update.exe" --processStart discord.exe & echo [INFO] Done!
   ```

3. The script will automatically close Discord, enable the Developer Console, and reopen Discord for you.

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
