import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Time Capsule FM',
  description: 'Privacy Policy for Time Capsule FM',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-2xl mx-auto card-antiquarian p-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Privacy Policy</h1>
        <p className="text-sm text-sepia-light font-body mb-8">Last updated: July 29, 2026</p>

        <div className="space-y-6 font-body text-sepia">
          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">What we collect</h2>
            <p>
              When you create an account, we collect your email address and generate a unique
              user ID (via Firebase Authentication). We store your exploration progress, badges,
              and listening history linked to that account so it can be shown back to you across
              sessions and devices.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">How we use it</h2>
            <p>
              Your account data is used solely to operate the app: signing you in, tracking your
              exploration progress, and personalizing which chapters we suggest next. We do not
              sell your data, and we do not use it for advertising or cross-app tracking.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">Third-party processors</h2>
            <p>
              We use Firebase (Google Cloud) for authentication and data storage. The app&apos;s
              audio chapters are pre-produced ahead of time rather than generated from your
              activity, so no third-party AI service ever processes your personal data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">Your choices</h2>
            <p>
              You can request deletion of your account and associated data at any time by
              contacting us using the information below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">Contact</h2>
            <p>
              Questions about this policy or your data can be sent to{' '}
              <a href="mailto:olin@brellium.com" className="text-brass hover:text-brass-dark font-medium">
                olin@brellium.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
