# Super Legend Voice & Live Agency Platform

منصة وتطبيق الغرف الصوتية والوكالات الرسمية (Super Legend / Al-Najm).

## 🚀 نظرة عامة
تطبيق متكامل للغرف الصوتية وإدارة الوكالات المعتمدة والمضيفين والمندوبين، يدعم:
- **نظام الغرف الصوتية عالي الدقة:** محرك ZEGOCLOUD رسمي (AppID: 2138622497) مع التبديل التلقائي لـ WebRTC في حالات الطوارئ (Automatic Failover).
- **التسلسل الهرمي الصارم للصلاحيات:**
  `Owner -> Manager -> Delegate -> Agency Owner -> Broker -> Broadcaster -> User`
- **توليد المعرفات الهرمية الآلية الذرية:**
  `DEL-XXX`, `AG-XXX`, `BRK-XXX-XX`, `HOST-XXX-XX`.
- **أمان وقواعد Firestore:** قواعد أمان صارمة (`firestore.rules`) لمنع التلاعب المالي وحماية الرتب ونطاقات الرؤية.

## 🛠️ البنية التقنية
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Motion
- **Backend Server:** Node.js (Express) + WebSocket Server (`/ws/audio-room`)
- **Database & Auth:** Firebase Firestore `(default)` + Firebase Authentication
- **Audio Engine:** `zego-express-engine-webrtc` (v3.12.0) + Web Audio API (Media Stream Mode `STREAM_MUSIC`) + Native WebRTC
- **Mobile Packaging:** Capacitor Android Ready (`@capacitor/android`)

## 📦 التثبيت والتشغيل
```bash
# تثبيت التبعيات
bun install
# أو
npm install

# تشغيل خادم التطوير
npm run dev

# فحص البناء والترجمة
npm run build
```
