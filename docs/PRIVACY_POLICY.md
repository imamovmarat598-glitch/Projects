# Privacy Policy — GeoMark: GPS Camera

**Effective Date:** January 15, 2026
**Last Updated:** January 15, 2026

## 1. Introduction

Welcome to **GeoMark: GPS Camera** ("we", "our", "us", or "the App").

This Privacy Policy explains how we collect, use, store, and protect your information when you use our mobile application and website (collectively, "the Service").

**By using GeoMark, you agree to the collection and use of information in accordance with this Privacy Policy.**

**Important:** GeoMark is designed for anonymous use. We do NOT require registration, email, password, or personal identification. However, we collect certain technical and location data as described below.

---

## 2. Information We Collect

### 2.1. Information You Provide

**Photos:**
- You upload photos with embedded GPS coordinates
- Photos include EXIF metadata (camera settings, timestamp, GPS location)
- We store photos in encrypted cloud storage (Cloudflare R2)

**GPS Coordinates:**
- Latitude, longitude, accuracy, altitude
- Automatically captured when you take a photo
- Used to display photos on the map and generate location addresses

**Deletion Settings:**
- You choose auto-deletion period: 1 hour, 24 hours, 7 days, or never
- Default: 24 hours

### 2.2. Information We Automatically Collect

**Device Information:**
- Device model (e.g., "iPhone 15 Pro")
- Operating system version (e.g., "iOS 17.2")
- App version (e.g., "1.0.0")
- Device identifier (see section 2.3)

**Network Information:**
- IP address
- Country and city (derived from IP)
- Internet service provider

**Usage Data:**
- Upload timestamp
- Upload duration
- Number of uploads
- Public link views

### 2.3. Device Identifier

We generate a **Device ID** to prevent abuse and implement rate limiting.

**iOS:**
- We use `identifierForVendor` (IDFV) provided by Apple
- IDFV is unique per app developer and resets if you delete all our apps
- We combine IDFV with device model and OS version
- Stored securely in iOS Keychain

**Android:**
- We use `ANDROID_ID` (Settings.Secure.ANDROID_ID)
- Resets when you factory reset your device
- We combine it with device model and OS version
- Stored in app-specific SharedPreferences

**Web:**
- We generate a random UUID stored in browser localStorage
- Clears when you clear browser data

**Important:** We do NOT use device fingerprinting, canvas fingerprinting, or any tracking techniques prohibited by Apple App Store Guidelines.

---

## 3. How We Use Your Information

We use collected information for the following purposes:

### 3.1. Core Functionality
- Store and display your photos with GPS markers on the map
- Generate public shareable links
- Reverse geocode GPS coordinates to human-readable addresses (e.g., "Red Square, Moscow")
- Automatic deletion based on your chosen retention period

### 3.2. Security and Abuse Prevention
- **Rate limiting:** Prevent spam uploads (max 10 uploads/hour per device)
- **Pattern detection:** Identify suspicious behavior (see section 3.3)
- **Moderation:** All uploads are routed to our internal Telegram moderation channels for manual review

### 3.3. Pattern Detection (Security Monitoring)

We analyze upload patterns to detect potential abuse:

**Location Patterns:**
- Uploads from the same location (within 50m radius)
- Regular upload intervals (e.g., every 5 minutes)
- Nighttime uploads (00:00 - 06:00 local time)
- Route detection (moving patterns)

**Behavioral Patterns:**
- Multiple uploads in short time
- Same IP address for many uploads
- Device switching patterns

**Purpose:** Detect fake GPS spoofing, automated bots, or illegal surveillance.

**Action:** Flagged uploads are sent to our `#suspicious` Telegram channel for manual review. We do NOT automatically ban users based on patterns alone.

### 3.4. Analytics
- Count total uploads, active users, popular regions
- Monitor app performance and errors
- Improve user experience

**Note:** We use privacy-focused analytics (Sentry) that do NOT track individual users across apps or websites.

---

## 4. Data Retention and Deletion

### 4.1. Photos

**You control retention period:**
- **1 hour:** Photo deleted after 1 hour
- **24 hours (default):** Photo deleted after 24 hours
- **7 days:** Photo deleted after 7 days
- **Never:** Photo kept until you manually delete it

**Deletion process:**
- Photo file permanently deleted from cloud storage (Cloudflare R2)
- Public links stop working
- Photo removed from map and gallery

### 4.2. Metadata Retention

**⚠️ IMPORTANT — Please read carefully:**

When you delete a photo, the photo file is immediately and permanently deleted. However, **metadata** (GPS coordinates, IP address, device ID, upload timestamp) may be retained for security purposes.

**Why we retain metadata:**
- Detect abuse patterns (e.g., someone uploading illegal content repeatedly)
- Comply with legal requests from law enforcement
- Prevent service misuse

**Retention period:** Up to **90 days** after photo deletion

**What metadata includes:**
- GPS coordinates (latitude, longitude)
- IP address and location (country, city)
- Device ID (see section 2.3)
- Upload timestamp
- Device model and OS version

**Your Rights:**
- **EU residents (GDPR):** You have the right to request full deletion of your metadata. Contact us at privacy@geomark.app.
- **Russian residents (ФЗ-152):** Same rights as GDPR.
- **Other jurisdictions:** Contact us, and we'll comply with local laws.

**Legal Basis:**
- **Legitimate Interests (GDPR Article 6(1)(f)):** Security, fraud prevention, legal compliance.

**⚠️ If you do NOT consent to metadata retention, please do NOT use our Service.**

### 4.3. Manual Deletion

You can delete your photos at any time:
1. Open the photo in the app
2. Tap "Delete"
3. Photo is immediately deleted from cloud storage

**Web uploads:** Public links include a "Delete" button (requires device verification).

---

## 5. Data Sharing and Disclosure

### 5.1. We Do NOT Sell Your Data

We will NEVER sell your data to third parties, advertisers, or data brokers.

### 5.2. Third-Party Services

We use the following trusted third-party services:

| Service | Purpose | Data Shared | Privacy Policy |
|---------|---------|-------------|----------------|
| **Cloudflare R2** | Photo storage | Photos, GPS coordinates | [Link](https://www.cloudflare.com/privacypolicy/) |
| **Google Maps API** | Geocoding (GPS → address) | GPS coordinates | [Link](https://policies.google.com/privacy) |
| **Nominatim (OpenStreetMap)** | Geocoding (fallback) | GPS coordinates | [Link](https://operations.osmfoundation.org/policies/privacy/) |
| **Sentry** | Error tracking | Anonymous crash reports | [Link](https://sentry.io/privacy/) |
| **Upstash Redis** | Caching, rate limiting | Device IDs, IP addresses (temporary) | [Link](https://upstash.com/docs/redis/overall/privacy) |

**Note:** These services are GDPR-compliant and have Data Processing Agreements (DPAs).

### 5.3. Legal Requests

We may disclose your information if required by law:
- Court orders, subpoenas
- Law enforcement requests (with valid legal basis)
- National security requirements

**Transparency:** We will notify you if legally permitted.

### 5.4. Business Transfers

If GeoMark is acquired or merged with another company, your data may be transferred. You will be notified via app notification and email (if provided).

---

## 6. Data Security

We take security seriously:

### 6.1. Technical Measures
- **Encryption in transit:** All API calls use HTTPS (TLS 1.3)
- **Encryption at rest:** Photos stored in Cloudflare R2 with server-side encryption
- **Database security:** PostgreSQL with encrypted connections
- **Access control:** Least privilege principle, role-based access

### 6.2. Organizational Measures
- Limited employee access to data
- Regular security audits
- Incident response plan

### 6.3. Your Responsibility
- Keep your device secure (lock screen, passcode)
- Do NOT share public links with untrusted parties
- Use "1 hour" or "24 hours" auto-deletion for sensitive photos

**Note:** Public links are accessible to anyone with the URL. Treat them like you would treat a shared Dropbox link.

---

## 7. Your Rights (GDPR & ФЗ-152)

If you are in the **EU, UK, or Russia**, you have the following rights:

### 7.1. Right to Access
Request a copy of your data (photos, metadata).

### 7.2. Right to Rectification
Request correction of inaccurate data.

### 7.3. Right to Erasure ("Right to be Forgotten")
Request full deletion of your data (photos + metadata).

**Note:** We will comply within 30 days, except where retention is required by law.

### 7.4. Right to Restriction of Processing
Request we limit how we use your data.

### 7.5. Right to Data Portability
Request your data in a machine-readable format (JSON).

### 7.6. Right to Object
Object to processing based on legitimate interests (e.g., pattern detection).

### 7.7. Right to Withdraw Consent
If you consented to data processing, you can withdraw at any time.

**How to Exercise Your Rights:**
Email us at **privacy@geomark.app** with:
- Your Device ID (found in Settings → About)
- Description of your request

We will respond within **30 days**.

---

## 8. Children's Privacy

GeoMark is NOT intended for children under 13 (or 16 in the EU).

We do NOT knowingly collect data from children. If you believe a child has used our Service, contact us at privacy@geomark.app, and we will delete their data.

---

## 9. International Data Transfers

**Data Processing Locations:**
- **Cloudflare R2:** Distributed globally (you choose region)
- **Backend servers:** EU (GDPR-compliant hosting)
- **Database:** EU or US (depending on hosting provider)

**GDPR Compliance:**
- We use **Standard Contractual Clauses (SCCs)** for data transfers outside the EU
- Cloudflare is certified under EU-U.S. Data Privacy Framework

---

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time.

**Notification:**
- In-app notification
- Updated "Last Updated" date at the top of this policy
- Major changes: email notification (if you provided email)

**Continued use of the Service after changes constitutes acceptance of the updated Privacy Policy.**

---

## 11. Contact Us

If you have questions, concerns, or requests about this Privacy Policy:

**Email:** privacy@geomark.app
**Website:** https://geomark.app/privacy
**Telegram Support:** @geomark_support (coming soon)

**Data Protection Officer (DPO):**
_(To be appointed after legal consultation — see SETUP_CHECKLIST.md)_

**EU Representative (if required by GDPR Article 27):**
_(To be appointed if we have significant EU users)_

---

## 12. Legal Compliance

This Privacy Policy complies with:
- **GDPR** (EU General Data Protection Regulation)
- **ФЗ-152** (Russian Federal Law on Personal Data)
- **CCPA** (California Consumer Privacy Act)
- **Apple App Store Guidelines** (especially 2.5.13 on device fingerprinting)
- **Google Play Developer Policy** (User Data policy)

---

**Thank you for using GeoMark!**

We are committed to protecting your privacy while providing a powerful GPS camera experience.

---

**Version 1.0.0**
**January 15, 2026**
