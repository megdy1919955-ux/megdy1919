# 🌟 تطبيق النجم (Al-Najm Live Voice & Entertainment)

تطبيق غرف الدردشة الصوتية والبث المباشر المتقدم، يدعم WebRTC و ZEGOCLOUD و LiveKit Cloud مع تزامن فوري للمقاعد، الشات المباشر، الهدايا التفاعلية، ومشاهدة الفيديو الجماعية (Cinema Watch Together).

---

## 🚀 التشغيل السريع على اللابتوب / الكمبيوتر (Quick Start)

لتشغيل المشروع بالكامل على جهازك المحلي (اللابتوب) بكل سلاسة:

### 1. المتطلبات الأساسية
- تثبيت [Node.js](https://nodejs.org/) (الإصدار 18 أو 20 أو 22).

### 2. تثبيت الحزم (Dependencies)
افتح التيرمينال داخل مجلد المشروع ونفّذ:
```bash
npm install
```

### 3. تشغيل سيرفر التطوير المتكامل (Full-Stack Dev Server)
```bash
npm run dev
```
- سيعمل السيرفر فوراً على المنفذ: **`http://localhost:3000`**
- يتم تشغيل خادم Express مع الويب سوكيت للغرف الصوتية (`/ws/audio-room`) ومحرك Vite للواجهة تلقائياً.

---

## 📁 الهيكلية المعمارية للمشروع (Architecture Overview)

* **`server.ts`**: السيرفر الرئيسي (Express + WebSockets + Zego Token04 + LiveKit Cloud + WebRTC Signaling).
* **`src/audio/`**: المعمارية الصوتية المعزولة:
  * `audioEngineService.ts`: إدارة الاتصال الصوتي والبث المباشر.
  * `audioNoiseSuppressionProcessor.ts`: معالج الفلترة الصوتية وعزل الضوضاء DSP في الوقت الحقيقي.
  * `micLogicController.ts`: التحكم الذكي في المايكات وصعود ونزول المقاعد.
  * `zegoAudioService.ts`: محرك ZEGOCLOUD المدمج.
  * `liveKitAudioEngine.ts`: محرك LiveKit Cloud للاتصال الجماعي فائق السرعة.
* **`src/lib/roomRealtimeService.ts`**: المزامنة اللحظية عبر Firebase Firestore (الشات، المقاعد، السينما المشتركة، الإشارات).
* **`src/components/room/`**: واجهات الغرفة الصوتية (الشريط السفلي، المايكات، الهالة الصوتية `SpeakingAura`، الهدايا، لوحة التحكم).
* **`android/`**: مشروع أندرويد المدمج عبر Capacitor 7 لبناء تطبيق APK مباشر.

---

## 📱 بناء تطبيق أندرويد (Android APK)

المشروع مهيأ بالكامل لبناء تطبيق Android أصلي:
```bash
npm run build
npx cap sync android
```
ثم فتح مجلد `android` عبر برنامج **Android Studio** والضغط على `Build APK`.
كما يحتوي المستودع على إعداد جاهز لـ **GitHub Actions** (`.github/workflows/build-apk.yml`) لبناء ملف الـ APK تلقائياً بمجرد الدفع إلى فرع `main`.

---

## 🔒 المزامنة وقواعد الحماية (Security & Rules)
* قاعدة البيانات مهيأة عبر `firebase-blueprint.json` وملف القواعد `firestore.rules`.
* السيرفر يعمل بنمط التشفير وحماية الصلاحيات الإدارية (`/api/hierarchy/permissions/:userId`).
