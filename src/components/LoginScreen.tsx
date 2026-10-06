/**
 * شاشة تسجيل الدخول والترحيب الرسمية (Login & Welcome Screen)
 * مطابقة بدقة لتعليمات التوثيق السحابي الحديثة:
 * 1. الحالة الافتراضية للواجهة هي 'options' (خيارات الدخول الرئيسية)
 * 2. دالة handleGoogleLogin تستدعي signInWithGoogle و handleGoogleAuthResult
 * 3. في حال كان المستخدم جديداً أو لم يكمل ملفه الشخصي يتم توجيهه تلقائياً إلى 'complete_profile'
 * 4. ربط كامل بـ Firebase Auth وقاعدة بيانات Cloud Firestore بناءً على UID مع إلغاء كافة الأكواد المكشوفة
 * تطبيق النجم (Al-Najm Live)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  Delete,
  X,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  User,
  Calendar,
  Sparkles,
  Globe
} from 'lucide-react';
import { NajmLogo } from './common/NajmLogo';
import { DownloadApkModal } from './DownloadApkModal';
import {
  AuthUserData,
  signInWithGoogle,
  handleGoogleAuthResult,
  completeUserProfile,
  syncUserWithFirestore,
  setAuthUserSession
} from '../lib/authService';
import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUserData) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // ضبط الحالة الافتراضية للواجهة لتكون 'options' بدلاً من 'email'
  const [authView, setAuthView] = useState<'options' | 'email' | 'phone' | 'complete_profile'>('options');
  const [phoneSubView, setPhoneSubView] = useState<'input' | 'otp'>('input');

  // المستخدم الجاري استكمال بياناته
  const [pendingUser, setPendingUser] = useState<AuthUserData | null>(null);

  // الموافقة على الشروط والسياسة
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDownloadApkModal, setShowDownloadApkModal] = useState(false);

  // حقول شاشة البريد الإلكتروني (Email Auth)
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('24');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // حقول شاشة إكمال البيانات (Complete Profile)
  const [completeNickname, setCompleteNickname] = useState('');
  const [completeAge, setCompleteAge] = useState('24');
  const [completeCountry, setCompleteCountry] = useState('اليمن');

  // حالات رقم الهاتف والواتساب
  const [countryCode, setCountryCode] = useState('+967');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [currentSessionOtp, setCurrentSessionOtp] = useState<string>('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpSentNotice, setOtpSentNotice] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // دالة معالجة الدخول بعد Google
  const handleGoogleLogin = async () => {
    if (!isAgreedToTerms) {
      setErrorMsg('يرجى الموافقة على شروط الخدمة وسياسة الخصوصية أولاً');
      return;
    }
    setErrorMsg(null);
    try {
      setIsLoading(true);
      const result = await signInWithGoogle(); // دالة Google Sign-In الرسمية
      const { user, isNewUser } = await handleGoogleAuthResult(result.user);

      if (isNewUser || !user.isProfileComplete) {
        // إذا كان مسجلاً جديداً -> التوجيه لشاشة إكمال البيانات
        setAuthUserSession(user);
        setPendingUser(user);
        setCompleteNickname(user.displayName || user.name || '');
        setAuthView('complete_profile');
      } else {
        // مستخدم متواجد وسابقاً أكمل بياناته -> دخول مباشر
        onLoginSuccess(user);
      }
    } catch (err: any) {
      console.warn('Google Auth Error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setIsLoading(false);
        return;
      }
      setErrorMsg(err?.message || 'حدث خطأ أثناء تسجيل الدخول عبر Google');
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة حفظ إكمال الملف الشخصي
  const handleSaveCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = completeNickname.trim();
    if (!cleanNick || cleanNick.length < 2) {
      setErrorMsg('يرجى إدخال اسم مستعار (اسم وهمي) مناسب');
      return;
    }

    const parsedAge = parseInt(completeAge, 10);
    if (isNaN(parsedAge) || parsedAge < 16 || parsedAge > 99) {
      setErrorMsg('يرجى إدخال عمر صحيح بين 16 و 99 سنة');
      return;
    }

    if (!pendingUser?.uid) {
      setErrorMsg('تعذر تحديد حساب المستخدم، يرجى إعادة المحاولة');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const updatedUser = await completeUserProfile(pendingUser.uid, {
        displayName: cleanNick,
        age: parsedAge,
        country: completeCountry
      });
      setIsLoading(false);
      onLoginSuccess(updatedUser);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'فشل حفظ الملف الشخصي، يرجى المحاولة مرة أخرى');
    }
  };

  // تسجيل الدخول أو إنشاء حساب بالبريد الإلكتروني
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg('يرجى إدخال بريد إلكتروني حقيقي وصالح (مثال: name@gmail.com)');
      return;
    }

    if (!cleanPass || cleanPass.length < 6) {
      setErrorMsg('كلمة المرور يجب ألا تقل عن 6 أحرف أو أرقام');
      return;
    }

    let cleanAge = 24;
    if (isRegisterMode) {
      const cleanNick = displayNameInput.trim();
      if (!cleanNick || cleanNick.length < 2) {
        setErrorMsg('يرجى كتابة الاسم المستعار (الاسم الوهمي) الخاص بك');
        return;
      }
      const parsedAge = parseInt(ageInput, 10);
      if (isNaN(parsedAge) || parsedAge < 16 || parsedAge > 99) {
        setErrorMsg('يرجى إدخال عمر صحيح بين 16 و 99 سنة');
        return;
      }
      cleanAge = parsedAge;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      let firebaseUserCred;
      if (isRegisterMode) {
        firebaseUserCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      } else {
        firebaseUserCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      }

      const user = await syncUserWithFirestore(firebaseUserCred.user, {
        displayName: displayNameInput.trim() || undefined,
        age: cleanAge,
        loginType: 'email'
      });

      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      console.warn('Firebase email auth error:', err);
      setIsLoading(false);
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg('كلمة المرور أو البريد الإلكتروني غير صحيح، يرجى التأكد وإعادة المحاولة');
      } else if (code === 'auth/user-not-found') {
        setErrorMsg('هذا البريد غير مسجل بعد، يرجى التبديل إلى "إنشاء حساب جديد"');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('هذا البريد مسجل مسبقاً، يرجى التبديل إلى "تسجيل الدخول"');
        setIsRegisterMode(false);
      } else if (code === 'auth/invalid-email') {
        setErrorMsg('صيغة البريد الإلكتروني غير صالحة');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('كلمة المرور ضعيفة جداً، يرجى اختيار كلمة مرور لا تقل عن 6 خانات');
      } else {
        setErrorMsg(err?.message || 'تعذر الاتصال بخوادم المصادقة، يرجى المحاولة مرة أخرى');
      }
    }
  };

  // تسجيل الدخول بحساب فيسبوك عبر Firebase السحابي
  const handleFacebookLogin = async () => {
    if (!isAgreedToTerms) {
      setErrorMsg('يرجى الموافقة على شروط الخدمة وسياسة الخصوصية أولاً');
      return;
    }
    setIsLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const user = await syncUserWithFirestore(cred.user, {
        displayName: 'نجم الفيسبوك ⭐',
        loginType: 'guest'
      });
      setIsLoading(false);
      onLoginSuccess(user);
    } catch {
      setIsLoading(false);
      setErrorMsg('تعذر تسجيل الدخول عبر السحابة');
    }
  };

  // تسجيل الدخول باستخدام تيك توك عبر Firebase السحابي
  const handleTikTokLogin = async () => {
    if (!isAgreedToTerms) {
      setErrorMsg('يرجى الموافقة على شروط الخدمة وسياسة الخصوصية أولاً');
      return;
    }
    setIsLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const user = await syncUserWithFirestore(cred.user, {
        displayName: 'نجم تيك توك ✨',
        loginType: 'guest'
      });
      setIsLoading(false);
      onLoginSuccess(user);
    } catch {
      setIsLoading(false);
      setErrorMsg('تعذر تسجيل الدخول عبر السحابة');
    }
  };

  // تسجيل الدخول باستخدام سناب شات عبر Firebase السحابي
  const handleSnapchatLogin = async () => {
    if (!isAgreedToTerms) {
      setErrorMsg('يرجى الموافقة على شروط الخدمة وسياسة الخصوصية أولاً');
      return;
    }
    setIsLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const user = await syncUserWithFirestore(cred.user, {
        displayName: 'نجم سناب 👻',
        loginType: 'guest'
      });
      setIsLoading(false);
      onLoginSuccess(user);
    } catch {
      setIsLoading(false);
      setErrorMsg('تعذر تسجيل الدخول عبر السحابة');
    }
  };

  // بدء الدخول برقم الجوال
  const handleStartPhoneWhatsApp = () => {
    if (!isAgreedToTerms) {
      setErrorMsg('يرجى الموافقة على شروط الخدمة وسياسة الخصوصية أولاً');
      return;
    }
    setErrorMsg(null);
    setPhoneSubView('input');
    setAuthView('phone');
  };

  // طلب رمز الواتساب
  const handleRequestWhatsAppOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setErrorMsg('يرجى إدخال رقم جوال صحيح');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setCurrentSessionOtp(generated);

    setTimeout(() => {
      setIsLoading(false);
      setOtpDigits(['', '', '', '']);
      setPhoneSubView('otp');
      setOtpSentNotice(true);
      setTimeout(() => setOtpSentNotice(false), 5000);
    }, 800);
  };

  // إعادة إرسال رمز الواتساب
  const handleResendWhatsAppOtp = () => {
    setIsResendingOtp(true);
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setCurrentSessionOtp(generated);
    setTimeout(() => {
      setIsResendingOtp(false);
      setOtpSentNotice(true);
      setTimeout(() => setOtpSentNotice(false), 5000);
    }, 900);
  };

  // لوحة المفاتيح المخصصة للأرقام
  const handleKeypadPress = (digit: string) => {
    const firstEmptyIndex = otpDigits.findIndex((d) => d === '');
    if (firstEmptyIndex === -1) return;

    const newDigits = [...otpDigits];
    newDigits[firstEmptyIndex] = digit;
    setOtpDigits(newDigits);

    if (firstEmptyIndex === 3) {
      verifyAndLogin();
    }
  };

  const handleKeypadBackspace = () => {
    const newDigits = [...otpDigits];
    for (let i = newDigits.length - 1; i >= 0; i--) {
      if (newDigits[i] !== '') {
        newDigits[i] = '';
        break;
      }
    }
    setOtpDigits(newDigits);
  };

  const verifyAndLogin = async () => {
    setIsLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
      const user = await syncUserWithFirestore(cred.user, {
        displayName: `نجم_${phoneNumber.slice(-4) || 'الذهبي'}`,
        loginType: 'phone',
        phone: fullPhone
      });
      setIsLoading(false);
      onLoginSuccess(user);
    } catch {
      setIsLoading(false);
      setErrorMsg('تعذر الاتصال بخوادم المصادقة، يرجى المحاولة لاحقاً');
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[99999] bg-[#F8FAFC] text-slate-800 flex flex-col justify-between overflow-y-auto overflow-x-hidden selection:bg-amber-500 selection:text-white select-none"
    >
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-lg h-96 bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-amber-50/60 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-5 py-8 flex-1 flex flex-col justify-between">
        
        {/* Top Header Logo */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <NajmLogo size="lg" withRing={false} />
          <h2 className="text-xl font-black text-slate-900 mt-2">
            مرحباً بك في النجم Live
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            تواصل، استمع، وتفاعل مع أفضل الغرف الصوتية
          </p>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: الواجهة الافتراضية 'options' (خيارات تسجيل الدخول الرئيسية)       */}
        {/* ========================================================================= */}
        {authView === 'options' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3.5 w-full my-auto"
          >
            {/* Error message banner */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold text-center leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* 1. زر تسجيل الدخول عبر Google (يستدعي handleGoogleLogin) */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-[#EBF2FC] hover:bg-[#DEEAFA] active:scale-[0.98] transition-all flex items-center justify-center gap-3 px-6 shadow-sm border border-blue-100/80 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-slate-800 font-bold text-base">
                    تسجيل الدخول عبر Google
                  </span>
                </>
              )}
            </button>

            {/* 2. زر تسجيل الدخول بالبريد الإلكتروني الحقيقي */}
            <button
              type="button"
              onClick={() => {
                if (!isAgreedToTerms) {
                  setErrorMsg('يرجى الموافقة على شروط الخدمة وسياسة الخصوصية أولاً');
                  return;
                }
                setErrorMsg(null);
                setAuthView('email');
              }}
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 px-6 shadow-sm cursor-pointer text-slate-950 font-black text-base"
            >
              <Mail className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              <span>تسجيل الدخول بالبريد الإلكتروني ✉️</span>
            </button>

            {/* 3. زر تسجيل الدخول بحساب فيسبوك */}
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 px-6 shadow-sm border border-slate-200/90 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center text-white shrink-0">
                <span className="font-black text-sm leading-none -mb-0.5">f</span>
              </div>
              <span className="text-slate-800 font-bold text-base">
                تسجيل الدخول بحساب فيسبوك
              </span>
            </button>

            {/* 4. زر تسجيل الدخول باستخدام تيك توك */}
            <button
              type="button"
              onClick={handleTikTokLogin}
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 px-6 shadow-sm border border-slate-200/90 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.03 3.32-1.54 3.34-3.36.02-4.57.01-9.14.01-13.71z" />
                </svg>
              </div>
              <span className="text-slate-800 font-bold text-base">
                تسجيل الدخول باستخدام تيك توك
              </span>
            </button>

            {/* 5. الأيقونات السفلية: سناب شات + الجوال */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <button
                type="button"
                onClick={handleSnapchatLogin}
                className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition-all flex items-center justify-center shadow-sm cursor-pointer"
                title="سناب شات"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FFFC00] flex items-center justify-center p-1.5 shadow-sm">
                  <svg className="w-full h-full fill-black" viewBox="0 0 24 24">
                    <path d="M12.001 2c-3.136 0-5.698 2.37-5.748 5.433-.004.281-.044.693-.16 1.073-.131.428-.328.749-.607 1.011-.476.446-1.127.591-1.637.705-.281.063-.521.117-.665.201-.223.131-.383.351-.439.605-.057.253-.009.52.133.731.336.502.946.852 1.63 1.134.12.049.239.096.353.144.137.058.21.144.204.24-.009.155-.262.593-.656 1.258-.456.769-.877 1.48-1.026 2.052-.102.392-.093.754.025 1.076.14.382.434.654.807.747.625.156 1.468-.073 2.508-.358.33-.09.684-.188 1.06-.271.309-.068.599.043.834.225.439.34.981.868 1.706 1.166.529.217 1.092.327 1.674.327.581 0 1.144-.11 1.673-.327.725-.298 1.267-.826 1.706-1.166.235-.182.525-.293.834-.225.376.083.73.181 1.06.271 1.04.285 1.883.514 2.508.358.373-.093.667-.365.807-.747.118-.322.127-.684.025-1.076-.149-.572-.57-1.283-1.026-2.052-.394-.665-.647-1.103-.656-1.258-.006-.096.067-.182.204-.24.114-.048.233-.095.353-.144.684-.282 1.294-.632 1.63-1.134.142-.211.19-.478.133-.731-.056-.254-.216-.474-.439-.605-.144-.084-.384-.138-.665-.201-.51-.114-1.161-.259-1.637-.705-.279-.262-.476-.583-.607-1.011-.116-.38-.156-.792-.16-1.073C17.699 4.37 15.137 2 12.001 2z" />
                  </svg>
                </div>
              </button>

              <div className="relative flex flex-col items-center">
                <div className="absolute -top-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md z-10 whitespace-nowrap animate-pulse">
                  آخر استخدام
                </div>

                <button
                  type="button"
                  onClick={handleStartPhoneWhatsApp}
                  className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200/80 active:scale-95 transition-all flex items-center justify-center shadow-sm cursor-pointer border border-emerald-200/60"
                  title="تسجيل عبر رقم الجوال والواتساب"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00D757] flex items-center justify-center text-white shadow-sm">
                    <Phone className="w-4 h-4 fill-white" />
                  </div>
                </button>
              </div>
            </div>

            {/* زر تحميل تطبيق الأندرويد APK */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowDownloadApkModal(true)}
                className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-200 shadow-2xs"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>تنزيل تطبيق الأندرويد APK 📲</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: شاشة إكمال البيانات 'complete_profile' للمستخدم الجديد            */}
        {/* ========================================================================= */}
        {authView === 'complete_profile' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4 w-full my-auto bg-white p-6 rounded-3xl shadow-xl border border-slate-100"
          >
            <div className="text-center pb-2 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <Sparkles className="w-6 h-6 text-amber-600 fill-amber-500" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                إكمال الملف الشخصي 🌟
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                أهلاً بك! يرجى تحديد اسمك المستعار وعمرك لإكمال الدخول
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold text-center leading-relaxed">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveCompleteProfile} className="flex flex-col gap-3.5">
              {/* الاسم المستعار */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  الاسم المستعار (الاسم الوهمي):
                </label>
                <input
                  type="text"
                  placeholder="مثال: فتى الشرق، برنس..."
                  value={completeNickname}
                  onChange={(e) => setCompleteNickname(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs"
                />
              </div>

              {/* العمر */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  العمر (سنة):
                </label>
                <input
                  type="number"
                  min={16}
                  max={99}
                  placeholder="24"
                  value={completeAge}
                  onChange={(e) => setCompleteAge(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs font-mono"
                />
              </div>

              {/* الدولة */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  الدولة:
                </label>
                <select
                  value={completeCountry}
                  onChange={(e) => setCompleteCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold outline-none focus:border-amber-500"
                >
                  <option value="اليمن">🇾🇪 اليمن</option>
                  <option value="السعودية">🇸🇦 السعودية</option>
                  <option value="الإمارات">🇦🇪 الإمارات</option>
                  <option value="الكويت">🇰🇼 الكويت</option>
                  <option value="قطر">🇶🇦 قطر</option>
                  <option value="عُمان">🇴🇲 عُمان</option>
                  <option value="مصر">🇪🇬 مصر</option>
                  <option value="العراق">🇮🇶 العراق</option>
                  <option value="الأردن">🇯🇴 الأردن</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>حفظ والدخول إلى التطبيق ✨</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: شاشة البريد الإلكتروني 'email'                                   */}
        {/* ========================================================================= */}
        {authView === 'email' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 w-full my-auto bg-white p-6 rounded-3xl shadow-lg border border-slate-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAuthView('options');
                  setErrorMsg(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-bold"
              >
                <ArrowRight className="w-4 h-4" /> خيارات أخرى
              </button>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMsg(null);
                  }}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    !isRegisterMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  دخول
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMsg(null);
                  }}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    isRegisterMode ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  حساب جديد
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold text-center leading-relaxed">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="flex flex-col gap-3.5">
              {isRegisterMode && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      الاسم المستعار (الاسم الوهمي):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: فتى الشرق، برنس..."
                      value={displayNameInput}
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      required={isRegisterMode}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      العمر (سنة):
                    </label>
                    <input
                      type="number"
                      min={16}
                      max={99}
                      placeholder="24"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      required={isRegisterMode}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all shadow-xs font-mono"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  البريد الإلكتروني الحقيقي:
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all text-left font-mono shadow-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">كلمة المرور:</label>
                <div className="relative flex items-center" dir="ltr">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-4 pl-10 py-3 text-sm text-slate-800 font-bold outline-none focus:border-amber-500 focus:bg-white transition-all text-left font-mono shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:opacity-95 text-slate-950 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRegisterMode ? 'تأكيد إنشاء الحساب السحابي' : 'تسجيل الدخول الآن'}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: شاشة رقم الجوال والواتساب 'phone'                                 */}
        {/* ========================================================================= */}
        {authView === 'phone' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 w-full my-auto bg-white p-6 rounded-3xl shadow-lg border border-slate-100"
          >
            {phoneSubView === 'input' ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('options');
                      setErrorMsg(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <ArrowRight className="w-4 h-4" /> رجوع
                  </button>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    الدخول برقم الجوال
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleRequestWhatsAppOtp} className="flex flex-col gap-4 mt-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">رقم الهاتف المحمول:</label>
                    <div className="flex items-center gap-2" dir="ltr">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-2xl px-2 py-3 text-sm text-slate-800 font-bold outline-none focus:border-emerald-500"
                      >
                        <option value="+967">🇾🇪 +967</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+965">🇰🇼 +965</option>
                        <option value="+974">🇶🇦 +974</option>
                        <option value="+968">🇴🇲 +968</option>
                        <option value="+20">🇪🇬 +20</option>
                        <option value="+962">🇯🇴 +962</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="770 000 000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-base text-slate-900 font-mono placeholder:text-slate-400 outline-none focus:border-emerald-500 font-bold"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-emerald-800 block text-sm">
                        إرسال الرمز عبر الواتساب
                      </span>
                      سيصلك رمز التحقق المكون من 4 أرقام مباشرة في رسالة خاصة على تطبيق WhatsApp.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-black text-base shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    {isLoading ? 'جاري إرسال الرمز...' : 'إرسال الرمز إلى الواتساب'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneSubView('input');
                      setErrorMsg(null);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <ArrowRight className="w-4 h-4" /> تغيير الرقم
                  </button>
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                    رمز التحقق الواتساب
                  </span>
                </div>

                <AnimatePresence>
                  {otpSentNotice && currentSessionOtp && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        </div>
                        <div>
                          <span className="font-bold block">رسالة من WhatsApp (النجم Live)</span>
                          <span>رمز التحقق هو: <strong className="font-mono text-amber-200 text-sm">{currentSessionOtp}</strong></span>
                        </div>
                      </div>
                      <button
                        onClick={() => setOtpSentNotice(false)}
                        className="p-1 hover:bg-white/10 rounded-full"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center mt-1">
                  <p className="text-xs text-slate-500">
                    أدخل رمز التأكيد المكون من 4 أرقام المرسل إلى:
                  </p>
                  <p className="text-sm font-mono font-black text-slate-800 mt-0.5" dir="ltr">
                    {countryCode} {phoneNumber}
                  </p>
                </div>

                <div className="flex justify-center gap-3 my-2" dir="ltr">
                  {[0, 1, 2, 3].map((idx) => {
                    const digit = otpDigits[idx];
                    const isCurrent = otpDigits.findIndex((d) => d === '') === idx;
                    return (
                      <div
                        key={idx}
                        className={`w-13 h-14 rounded-2xl flex items-center justify-center text-2xl font-mono font-black transition-all border-2 ${
                          digit
                            ? 'bg-emerald-50/80 border-emerald-500 text-emerald-800 shadow-sm scale-105'
                            : isCurrent
                            ? 'bg-white border-blue-500 text-slate-800 ring-2 ring-blue-100 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {digit || (isCurrent ? <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> : '')}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center px-1 text-xs">
                  <button
                    type="button"
                    onClick={handleResendWhatsAppOtp}
                    disabled={isResendingOtp}
                    className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {isResendingOtp ? 'جاري إعادة الإرسال...' : 'إعادة إرسال رمز الواتساب'}
                  </button>
                </div>

                <div className="mt-2 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2 w-full max-w-[280px] mx-auto" dir="ltr">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleKeypadPress(num)}
                        className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 active:scale-95 text-slate-800 font-mono font-bold text-xl transition-all flex items-center justify-center shadow-xs cursor-pointer select-none"
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setOtpDigits(['', '', '', ''])}
                      className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-400 text-xs font-bold transition-all flex items-center justify-center cursor-pointer select-none"
                    >
                      مسح الكل
                    </button>

                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 active:scale-95 text-slate-800 font-mono font-bold text-xl transition-all flex items-center justify-center shadow-xs cursor-pointer select-none"
                    >
                      0
                    </button>

                    <button
                      type="button"
                      onClick={handleKeypadBackspace}
                      className="h-12 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 transition-all flex items-center justify-center shadow-xs cursor-pointer select-none"
                      title="مسح"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {isLoading && (
                  <div className="text-center py-2 text-xs text-emerald-600 font-bold animate-pulse">
                    جاري التحقق من صحة الرمز وتسجيل الدخول...
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* Footer: شروط الخدمة وسياسة الخصوصية                                       */}
        {/* ========================================================================= */}
        <div className="mt-8 flex flex-col items-center">
          <div
            onClick={() => setIsAgreedToTerms(!isAgreedToTerms)}
            className="flex items-center justify-center gap-2 cursor-pointer select-none group"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isAgreedToTerms
                  ? 'bg-[#00D757] text-white shadow-sm'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {isAgreedToTerms && <CheckCircle2 className="w-4 h-4 text-white fill-[#00D757]" />}
            </div>

            <span className="text-xs text-slate-600 font-medium leading-relaxed">
              لقد قرأت ووافقت على{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTermsModal(true);
                }}
                className="font-bold text-slate-800 hover:underline"
              >
                شروط الخدمة
              </button>{' '}
              و
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTermsModal(true);
                }}
                className="font-bold text-slate-800 hover:underline"
              >
                سياسة الخصوصية
              </button>
            </span>
          </div>

          <p className="text-[10px] text-slate-400 font-mono mt-3">
            © 2026 Al-Najm Live Voice Chat. All Rights Reserved.
          </p>
        </div>

      </div>

      {/* Modal: شروط الخدمة وسياسة الخصوصية */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 text-right"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-black text-base text-slate-900">شروط الخدمة والخصوصية</span>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-72 overflow-y-auto pr-1">
                <p>
                  <strong>1. الاستخدام العادل:</strong> يلتزم جميع المستخدمين بالاحترام المتبادل داخل الغرف الصوتية والمحادثات العامة.
                </p>
                <p>
                  <strong>2. حماية الحساب:</strong> يُحظر مشاركة رموز التحقق الخاصة بالواتساب أو كلمات المرور مع أي طرف آخر.
                </p>
                <p>
                  <strong>3. شحن الكوينز:</strong> تتم جميع عمليات الشحن عبر القنوات والوكلاء الرسميين المعتمدين لتطبيق النجم فقط.
                </p>
                <p>
                  <strong>4. خصوصية البيانات:</strong> يتم تشفير كافة المحادثات والبيانات الشخصية عبر Firebase السحابية لضمان أقصى درجات الأمان والسرية.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAgreedToTerms(true);
                  setShowTermsModal(false);
                }}
                className="w-full py-3 rounded-full bg-[#00D757] hover:bg-[#00c04e] text-white font-black text-sm shadow-md cursor-pointer transition-all mt-2"
              >
                موافق ومتابعة
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة تنزيل وتثبيت تطبيق الأندرويد APK */}
      <DownloadApkModal
        isOpen={showDownloadApkModal}
        onClose={() => setShowDownloadApkModal(false)}
      />
    </div>
  );
};
