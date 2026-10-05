# Aura Messenger - Google Play Store Release Specifications

## 1. Application Identity & Metadata
- **App Title**: Aura Messenger: Fast & Secure Social Chat
- **Short Description**: Encrypted chats, 24h stories, status notes & HD audio/video calling.
- **Full Description**:
  Aura Messenger brings you closer to the people that matter most with lightning-fast messaging, crystal-clear voice and video calling, and expressive 24-hour stories. Designed with privacy at its core and crafted with Android Material design.
  
  **Key Features**:
  • Instant Messaging: Send rich text, voice notes, stickers, reactions, and high-res media.
  • Voice & Video Calling: HD one-on-one calling with camera controls and low-latency audio.
  • 24-Hour Stories & Notes: Share your everyday moments with photo/video/text stories and status notes.
  • Group Chats: Create groups, assign admins, and share moments together.
  • Privacy First: Granular controls over last seen, online status, who can call you, and blocking/reporting.
  • Offline Ready & Light: Fast caching, local-first responsiveness, and dark/light mode themes.

- **Package Name**: `com.auramessenger.app`
- **Target SDK**: Android 14 (API level 34)
- **Version Code**: 100
- **Version Name**: 1.0.0

## 2. Google Play Data Safety Section
- **Data Collected**:
  - Personal info: Name, email address, phone number (for account creation & contacts)
  - Messages & Photos/Videos: Stored for transmission and user-initiated cloud backup
  - Audio recordings: For voice messages (ephemeral or stored per user consent)
  - Device IDs: For push notification delivery via Firebase Cloud Messaging
- **Security Practices**:
  - Data is encrypted in transit (TLS 1.3 / HTTPS / WSS)
  - Users can request complete account & data deletion at any time in Settings > Delete Account
  - Independent security auditing compliance
