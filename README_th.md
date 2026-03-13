[🇺🇸 English](README.md) | [🇹🇭 ไทย](README_th.md)

# Discord Quest Claimer 

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Discord](https://img.shields.io/badge/Discord-Desktop-5865F2?style=for-the-badge&logo=discord)
![Version](https://img.shields.io/badge/Version-5.0_Stable-green)

![Visitor Badge](https://api.visitorbadge.io/api/VisitorHit?user=Nattapat2871&repo=discord-questclaim&countColor=%237B1E7A)

เครื่องมือ JavaScript ที่ทรงพลัง แยบยล และเต็มไปด้วยฟีเจอร์ ออกแบบมาเพื่อทำ **Discord Quests** (เล่นเกม, สตรีม, ดูวิดีโอ, และกิจกรรม) ให้สำเร็จโดยอัตโนมัติผ่าน Developer Console ของแอป Discord โดยตรง   ไม่ต้องโหลดเกมก็ทำเควสได้ทุกอัน

**พัฒนาโดย [Nattapat2871](https://github.com/Nattapat2871)**

---

<img width="1550" height="1023" alt="image" src="https://github.com/user-attachments/assets/f69014ef-6634-4754-bbb1-920825481587" />

## 🌟 ฟีเจอร์หลัก

* **รองรับเควสทุกประเภท:**
    * 🎮 `PLAY_ON_DESKTOP`: จำลองการเล่นเกมโดยไม่ต้องติดตั้งเกมจริง
    * 🎥 `STREAM_ON_DESKTOP`: จำลองการสตรีมในห้องเสียง (*จำเป็นต้องแชร์หน้าจอก่อน*)
    * 📺 `WATCH_VIDEO` / `MOBILE`: จำลองการดูวิดีโอพร้อมระบบสุ่มขยับเมาส์เหมือนคนจริง
    * 🧩 `PLAY_ACTIVITY`: จำลองการเล่นกิจกรรม (Activities) ในห้องเสียง
* **ระบบบังคับนับเวลา (v5.0):** ใช้นาฬิกาของเครื่องคอมพิวเตอร์เพื่อให้นับเวลาถอยหลังบนหน้าจอได้อย่างราบรื่น แม้ API ของ Discord จะหน่วง ค้าง หรือหลุดการเชื่อมต่อ (`ERR_CONNECTION_CLOSED`)
* **หน้าต่าง UI สวยงาม:** มีการ์ดแสดงสถานะความคืบหน้าแบบเรียลไทม์ที่มุมขวาล่าง
* **เสียงแจ้งเตือน:** มีเสียง "ติ๊ง!" แจ้งเตือนเมื่อทำเควสสำเร็จ
* **เพิ่มเวลาเผื่อเพื่อความชัวร์:** เพิ่มเวลาเผื่อ (+30 วินาที) เพื่อให้มั่นใจว่าระบบของ Discord จะบันทึกว่าเควสเสร็จสมบูรณ์ 100%
* **คืนค่าระบบอัตโนมัติ:** เมื่อทำงานเสร็จหรือกดปิด สคริปต์จะลบ UI และคืนค่าการทำงานเดิมของ Discord ให้ทันที

## ⚠️ ข้อควรระวังที่สำคัญ

> **สคริปต์นี้ ไม่สามารถใช้งานบนเว็บเบราว์เซอร์ (Chrome, Edge ฯลฯ) สำหรับเควสประเภทเล่นเกมได้!**
> เนื่องจาก Discord อัปเดตระบบให้ตรวจสอบโปรเซสในเครื่องคอมพิวเตอร์ คุณ **ต้อง** ใช้ **แอป Discord บน Desktop** (เวอร์ชัน Stable, PTB, หรือ Canary) ในการทำเควส Play/Stream เท่านั้น

## 🛠️ สิ่งที่ต้องเตรียม: การเปิดใช้งาน Developer Console

ตามปกติแล้วแอป Discord จะปิดการเข้าถึง Developer Console ไว้ คุณต้องทำการเปิดใช้งานก่อนจึงจะสามารถวางสคริปต์ได้ เราได้เตรียมคำสั่งแบบบรรทัดเดียวเพื่อให้คุณทำขั้นตอนนี้ได้โดยอัตโนมัติ!

1. กดปุ่ม `Windows + R` บนคีย์บอร์ด พิมพ์ `cmd` แล้วกด **Enter** เพื่อเปิดหน้าต่าง Command Prompt
2. **คัดลอกและวาง** คำสั่งด้านล่างนี้ลงในหน้าต่าง CMD แล้วกด **Enter**:

   ```cmd
   echo [INFO] Closing Discord... & taskkill /f /im discord.exe >nul 2>&1 & timeout /t 2 >nul & echo [INFO] Updating settings.json... & (echo {& echo   "IS_MAXIMIZED": false,& echo   "IS_MINIMIZED": false,& echo   "WINDOW_BOUNDS": {& echo     "x": 295,& echo     "y": 167,& echo     "width": 1284,& echo     "height": 724& echo   },& echo   "DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true,& echo   "MIN_WIDTH": 940,& echo   "MIN_HEIGHT": 500,& echo   "chromiumSwitches": {},& echo   "BACKGROUND_COLOR": "#2c2d32",& echo   "openH264Enabled": true,& echo   "audioSubsystem": "experimental",& echo   "offloadAdmControls": true& echo }) > "%appdata%\discord\settings.json" & echo [INFO] Starting Discord... & start "" "%localappdata%\Discord\Update.exe" --processStart discord.exe & echo [INFO] Done!
   ```

3. คำสั่งนี้จะทำการปิด Discord, แก้ไขตั้งค่าเพื่อเปิด Console, และเปิด Discord ขึ้นมาใหม่ให้คุณทันที

## 🚀 วิธีใช้งาน

1.  **เปิด Discord** แล้วไปที่หน้า **Discover > Quests**
2.  **กดรับ (Accept)** เควสที่คุณต้องการทำให้เสร็จ
3.  **คัดลอกโค้ด:**
    * [**คลิกที่นี่เพื่อดูโค้ดเวอร์ชันล่าสุด**](https://raw.githubusercontent.com/Nattapat2871/discord-questclaim/main/discord-questclaim.js)
    * คลุมดำทั้งหมด (`Ctrl + A`) แล้วกดคัดลอก (`Ctrl + C`)
4.  **เปิด Developer Console:**
    * ในหน้าต่าง Discord กดปุ่ม `Ctrl` + `Shift` + `I`
    * คลิกที่แท็บ **"Console"** ที่แถบเมนูด้านบน
5.  **อนุญาตให้วางโค้ด (กรณีทำครั้งแรก):**
    * หากมีข้อความแจ้งเตือนสีแดงยาวๆ ให้พิมพ์คำว่า `allow pasting` แล้วกด **Enter** เพื่อยืนยัน
6.  **รันสคริปต์:**
    * วางโค้ดที่คัดลอกมา (`Ctrl + V`) ลงใน Console แล้วกด **Enter**

### สำหรับเควสประเภท "สตรีม" (Stream) 🎥
หากเควสของคุณคือการ **"Stream a game to a friend"**:
1.  เข้าไปในห้องเสียง (Voice Channel) ที่มีคนหรือบอทอยู่อย่างน้อย 1 ไอดี
2.  คลิก "Share Your Screen" (แชร์หน้าจอ) แล้วเลือกแอปพลิเคชัน **ใดก็ได้** (เช่น Notepad, หรือหน้าจอเว็บเพจ)
3.  รันสคริปต์ใน Console ตัวสคริปต์จะทำการเปลี่ยนข้อมูลการสตรีมของคุณให้ตรงกับเกมที่เควสต้องการอัตโนมัติ

## 🎮 การควบคุม

เมื่อสคริปต์เริ่มทำงาน คุณจะเห็นหน้าต่างแสดงความคืบหน้าที่มุมขวาล่างของ Discord

* **วิธีปิด/หยุดการทำงานแบบแมนนวล:**
    * คลิกที่ **ไอคอนกากบาทสีแดง** หรือปุ่ม **Close** บนหน้าต่างการทำงาน
    * **หรือ** พิมพ์คำสั่งต่อไปนี้ใน Console แล้วกด Enter:
        ```javascript
        nam.close()
        ```

## ❓ คำถามที่พบบ่อย (FAQ)

**Q: ใน Console มีการแจ้งเตือน Error หรือ `ERR_CONNECTION_CLOSED` สคริปต์พังหรือเปล่า?**
A: **ไม่พังครับ** สคริปต์ของเราใช้ระบบ "Force Timer" ต่อให้อินเทอร์เน็ตของคุณจะกระตุก หรือ API ของ Discord ทำการตัดการเชื่อมต่อ สคริปต์ก็จะยังคงนับเวลาในคอมพิวเตอร์ต่อไปและบังคับส่งคำสั่งยืนยันเควสเมื่อหมดเวลา แค่เปิดทิ้งไว้แล้วรอให้นับเวลาเสร็จก็พอครับ!

**Q: ใช้แล้วบัญชีจะโดนแบนไหม?**
A: การใช้งานมีความเสี่ยง ผู้ใช้ควรพิจารณาด้วยตนเอง แม้ว่าสคริปต์นี้จะถูกเขียนมาอย่างแยบยล (แทรกแซงตัวแปรภายในแทนที่จะยิง API รัวๆ) แต่การใช้โปรแกรมอัตโนมัติถือว่าผิดเงื่อนไขการให้บริการ (ToS) ของ Discord ครับ

**Q: รันโค้ดแล้ว แต่ไม่มีอะไรเกิดขึ้นหรือหน้าต่างไม่ขึ้น?**
A: ตรวจสอบให้แน่ใจว่าคุณได้กดปุ่ม **"Accept Quest" (รับเควส)** ในหน้า Quests ของ Discord แล้วจริงๆ ก่อนที่จะรันโค้ดครับ

---
