import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timecapsulefm.app',
  appName: 'Time Capsule FM',
  webDir: 'out', // unused in remote mode, required by schema
  server: {
    url: 'https://time-capsule-fm.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
