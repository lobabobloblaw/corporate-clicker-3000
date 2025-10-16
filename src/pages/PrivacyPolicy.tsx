/**
 * Privacy Policy Page
 * Required for Discord Activity Verification
 */

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Effective Date:</strong> October 16, 2025
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to Corporate Clicker 3000 ("the Activity", "we", "us", or "our").
              This Privacy Policy explains how we collect, use, and protect your information
              when you use our Discord Activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Discord User Information</h3>
            <p className="mb-4">
              Through the Discord Embedded App SDK, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>User ID</strong>: Your unique Discord user identifier</li>
              <li><strong>Username</strong>: Your Discord display name</li>
              <li><strong>Avatar</strong>: Your Discord profile picture (if available)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">2.2 Game Data</h3>
            <p className="mb-4">
              We store game progress locally in your browser, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Money balance</li>
              <li>Upgrades purchased</li>
              <li>Achievements earned</li>
              <li>Click statistics</li>
            </ul>
            <p className="mt-2 text-sm italic">
              Note: All game data is stored locally in your browser's localStorage and is not
              transmitted to or stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information solely to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Display your Discord username in the game interface</li>
              <li>Personalize your gaming experience</li>
              <li>Save your game progress locally on your device</li>
              <li>Authenticate you with Discord's services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Data Storage and Security</h2>
            <p className="mb-4">
              <strong>Local Storage Only:</strong> Corporate Clicker 3000 does not operate any
              backend servers. All game data is stored locally in your browser using localStorage.
              Your Discord user information is only used during your active session and is not
              persisted beyond that.
            </p>
            <p className="mb-4">
              <strong>No Data Transmission:</strong> We do not collect, store, or transmit any
              personal data to external servers or third parties.
            </p>
            <p>
              <strong>Discord's Privacy:</strong> Communication with Discord's services is handled
              through Discord's official Embedded App SDK and is subject to
              <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 hover:underline"> Discord's Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Sharing</h2>
            <p>
              <strong>We do not share, sell, or distribute your data to any third parties.</strong>
              The only data sharing that occurs is between your browser and Discord's servers
              through the official Discord SDK, which is governed by Discord's Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Data Deletion</h2>
            <p className="mb-4">
              Since all game data is stored locally on your device:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You can delete all game data by clearing your browser's localStorage</li>
              <li>Uninstalling or removing the Activity from Discord will prevent future data collection</li>
              <li>We retain no data on any servers as we do not operate any backend infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Children's Privacy</h2>
            <p>
              Corporate Clicker 3000 is intended for users who meet Discord's minimum age requirements
              (13 years or older, or the minimum age in your country). We do not knowingly collect
              information from children under these age limits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be
              indicated by an updated "Effective Date" at the top of this policy. We encourage
              you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have certain rights regarding your personal data, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The right to access your personal data</li>
              <li>The right to delete your personal data</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
            <p className="mt-2">
              Since we store no data on our servers, you have full control over your data
              through your browser's settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Third-Party Services</h2>
            <p className="mb-4">
              Corporate Clicker 3000 integrates with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Discord Embedded App SDK</strong>: Subject to
                <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline ml-1">Discord's Privacy Policy</a>
              </li>
              <li>
                <strong>Cloudflare</strong>: Our hosting infrastructure uses Cloudflare for HTTPS tunneling,
                subject to
                <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline ml-1">Cloudflare's Privacy Policy</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@corporateclicker3000.example</p>
              <p className="text-sm text-gray-600 mt-2">
                (Note: This is a demonstration contact. Update with your actual contact information.)
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Compliance</h2>
            <p>
              This Privacy Policy is designed to comply with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>General Data Protection Regulation (GDPR)</li>
              <li>California Consumer Privacy Act (CCPA)</li>
              <li>Discord Developer Terms of Service</li>
              <li>Discord Developer Policy</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-300">
          <p className="text-center text-sm text-gray-600">
            Last updated: October 16, 2025
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            Corporate Clicker 3000™ - A satirical idle clicker game
          </p>
        </div>
      </div>
    </div>
  )
}
