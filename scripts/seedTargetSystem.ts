import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const TARGET_SYSTEM_LEVELS = [
  { rank: 1,  diamonds: 13500,     hostUsd: 1,     agencyUsd: 0,     totalUsd: 1 },
  { rank: 2,  diamonds: 27000,     hostUsd: 2,     agencyUsd: 0,     totalUsd: 2 },
  { rank: 3,  diamonds: 40500,     hostUsd: 5,     agencyUsd: 0,     totalUsd: 5 },
  { rank: 4,  diamonds: 100000,    hostUsd: 6,     agencyUsd: 1,     totalUsd: 7 },
  { rank: 5,  diamonds: 81500,     hostUsd: 7,     agencyUsd: 3,     totalUsd: 10 },
  { rank: 6,  diamonds: 100000,    hostUsd: 21,    agencyUsd: 7,     totalUsd: 28 },
  { rank: 7,  diamonds: 400000,    hostUsd: 21,    agencyUsd: 7,     totalUsd: 28 },
  { rank: 8,  diamonds: 300000,    hostUsd: 25,    agencyUsd: 9,     totalUsd: 34 },
  { rank: 9,  diamonds: 700000,    hostUsd: 39,    agencyUsd: 12,    totalUsd: 51 },
  { rank: 10, diamonds: 1000000,   hostUsd: 40,    agencyUsd: 16,    totalUsd: 56 },
  { rank: 11, diamonds: 1500000,   hostUsd: 117,   agencyUsd: 12,    totalUsd: 129 },
  { rank: 12, diamonds: 2000000,   hostUsd: 148,   agencyUsd: 44,    totalUsd: 192 },
  { rank: 13, diamonds: 2500000,   hostUsd: 210,   agencyUsd: 97,    totalUsd: 307 },
  { rank: 14, diamonds: 3000000,   hostUsd: 245,   agencyUsd: 66,    totalUsd: 311 },
  { rank: 15, diamonds: 4500000,   hostUsd: 315,   agencyUsd: 17,    totalUsd: 332 },
  { rank: 16, diamonds: 4500000,   hostUsd: 310,   agencyUsd: 43,    totalUsd: 353 },
  { rank: 17, diamonds: 5000000,   hostUsd: 310,   agencyUsd: 10,    totalUsd: 320 },
  { rank: 18, diamonds: 6000000,   hostUsd: 420,   agencyUsd: 120,   totalUsd: 540 },
  { rank: 19, diamonds: 6000000,   hostUsd: 420,   agencyUsd: 128,   totalUsd: 548 },
  { rank: 20, diamonds: 7000000,   hostUsd: 490,   agencyUsd: 154,   totalUsd: 644 },
  { rank: 21, diamonds: 8000000,   hostUsd: 630,   agencyUsd: 178,   totalUsd: 808 },
  { rank: 22, diamonds: 9000000,   hostUsd: 630,   agencyUsd: 118,   totalUsd: 748 },
  { rank: 23, diamonds: 10000000,  hostUsd: 875,   agencyUsd: 220,   totalUsd: 1095 },
  { rank: 24, diamonds: 12500000,  hostUsd: 875,   agencyUsd: 220,   totalUsd: 1095 },
  { rank: 25, diamonds: 15000000,  hostUsd: 1005,  agencyUsd: 335,   totalUsd: 1340 },
  { rank: 26, diamonds: 20000000,  hostUsd: 1355,  agencyUsd: 425,   totalUsd: 1780 },
  { rank: 27, diamonds: 25000000,  hostUsd: 1380,  agencyUsd: 518,   totalUsd: 1898 },
  { rank: 28, diamonds: 30000000,  hostUsd: 2370,  agencyUsd: 615,   totalUsd: 2985 },
  { rank: 29, diamonds: 40000000,  hostUsd: 2740,  agencyUsd: 715,   totalUsd: 3455 },
  { rank: 30, diamonds: 40000000,  hostUsd: 2740,  agencyUsd: 920,   totalUsd: 3660 },
  { rank: 31, diamonds: 50000000,  hostUsd: 4740,  agencyUsd: 920,   totalUsd: 5660 },
  { rank: 32, diamonds: 50000000,  hostUsd: 4410,  agencyUsd: 1000,  totalUsd: 5410 },
  { rank: 33, diamonds: 50000000,  hostUsd: 4440,  agencyUsd: 1800,  totalUsd: 6240 },
  { rank: 34, diamonds: 70000000,  hostUsd: 4830,  agencyUsd: 1600,  totalUsd: 6430 },
  { rank: 35, diamonds: 80000000,  hostUsd: 5520,  agencyUsd: 1600,  totalUsd: 7120 },
  { rank: 36, diamonds: 90000000,  hostUsd: 6770,  agencyUsd: 1000,  totalUsd: 7770 },
  { rank: 37, diamonds: 100000000, hostUsd: 6730,  agencyUsd: 2050,  totalUsd: 8780 },
  { rank: 38, diamonds: 150000000, hostUsd: 10250, agencyUsd: 1000,  totalUsd: 11250 },
  { rank: 39, diamonds: 200000000, hostUsd: 17600, agencyUsd: 1600,  totalUsd: 19200 },
  { rank: 40, diamonds: 250000000, hostUsd: 17500, agencyUsd: 8500,  totalUsd: 26000 },
  { rank: 41, diamonds: 300000000, hostUsd: 28510, agencyUsd: 8850,  totalUsd: 37360 },
  { rank: 42, diamonds: 350000000, hostUsd: 25575, agencyUsd: 8720,  totalUsd: 34295 },
  { rank: 43, diamonds: 400000000, hostUsd: 27400, agencyUsd: 7800,  totalUsd: 35200 },
  { rank: 44, diamonds: 450000000, hostUsd: 30625, agencyUsd: 8775,  totalUsd: 39400 },
  { rank: 45, diamonds: 500000000, hostUsd: 34250, agencyUsd: 9730,  totalUsd: 43980 }
];

const TARGET_SYSTEM_REQUIREMENTS = {
  monthlyDays: 15,
  monthlyHours: 40,
  dailyMinutes: 60,
  dailyHours: 3
};

const TARGET_SYSTEM_EXCHANGE_RATE = {
  diamondsToUsd: 13500,
  currency: 'USD'
};

async function run() {
  console.log('[SeedScript] Initializing Firebase with client SDK...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const targetDocRef = doc(db, 'configs', 'target_system');

  console.log('[SeedScript] Checking current doc in configs/target_system...');
  try {
    const snapBefore = await getDoc(targetDocRef);
    if (snapBefore.exists()) {
      console.log('[SeedScript] Current data exists before seed:', JSON.stringify(snapBefore.data()).slice(0, 300));
    } else {
      console.log('[SeedScript] Doc does not exist yet.');
    }
  } catch (err: any) {
    console.warn('[SeedScript] Error reading before seed:', err.message);
  }

  const payload = {
    levels: TARGET_SYSTEM_LEVELS,
    requirements: TARGET_SYSTEM_REQUIREMENTS,
    exchangeRate: TARGET_SYSTEM_EXCHANGE_RATE,
    seededAt: serverTimestamp(),
    seededBy: 'MGR-9901',
    version: '2026.1',
    description: 'جدول تصنيف الأرباح والمكافآت الشهرية لنظام التارجت الرسمي'
  };

  console.log(`[SeedScript] Writing ${TARGET_SYSTEM_LEVELS.length} levels to configs/target_system...`);
  await setDoc(targetDocRef, payload);
  console.log('[SeedScript] Write complete!');

  console.log('[SeedScript] Verifying by reading back from Firestore...');
  const snapAfter = await getDoc(targetDocRef);
  if (snapAfter.exists()) {
    const data = snapAfter.data();
    console.log('[SeedScript] Verification SUCCESS!');
    console.log(`- levels count: ${data.levels?.length}`);
    console.log(`- requirements:`, JSON.stringify(data.requirements));
    console.log(`- exchangeRate:`, JSON.stringify(data.exchangeRate));
    console.log(`- seededBy: ${data.seededBy}`);
    process.exit(0);
  } else {
    console.error('[SeedScript] Verification FAILED: doc not found after write');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('[SeedScript] Fatal error:', err);
  process.exit(1);
});
