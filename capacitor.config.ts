export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
  android?: {
    allowMixedContent?: boolean;
    backgroundColor?: string;
  };
}

const config: CapacitorConfig = {
  appId: 'com.alnajm.app',
  appName: 'النجم',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#070a13'
  }
};

export default config;
