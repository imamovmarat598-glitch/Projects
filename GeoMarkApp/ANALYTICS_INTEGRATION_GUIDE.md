# Analytics Integration Guide

## Overview

This guide shows exactly how to integrate the analytics tracking from `src/utils/analytics.ts` into all key screens of the GeoMark app.

---

## Installation Steps

### 1. Install Required Packages

```bash
# Navigate to GeoMarkApp directory
cd C:\Users\ASuS\Documents\Projects\Projects\GeoMarkApp

# Install Firebase packages
npx expo install @react-native-firebase/app @react-native-firebase/analytics

# Install Sentry (optional, for advanced error tracking)
npx expo install @sentry/react-native
```

### 2. Configure Firebase in app.json

Add to the `plugins` array in `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      [
        "@react-native-firebase/analytics",
        {
          "analyticsCollectionEnabled": true
        }
      ]
      // ... existing plugins (expo-camera, expo-location, etc.)
    ],
    "extra": {
      "firebaseApiKey": "YOUR_FIREBASE_API_KEY",
      "firebaseProjectId": "YOUR_FIREBASE_PROJECT_ID",
      "firebaseAppId": "YOUR_FIREBASE_APP_ID",
      "eas": {
        "projectId": "cc081ce5-4531-42ff-aad6-664e60b3a28f"
      }
    }
  }
}
```

### 3. Create Firebase Projects

1. Go to https://console.firebase.google.com
2. Create new project: "GeoMark Production"
3. Add iOS app (bundle ID: `com.geomark.app`)
4. Add Android app (package: `com.geomark.app`)
5. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
6. Place files in project root

---

## Screen Integration Examples

### App.tsx - Initialize Analytics

**File**: `GeoMarkApp/App.tsx`

Add analytics initialization on app startup:

```typescript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { initializeAnalytics, setUserId } from './src/utils/analytics';
import { supabase } from './src/lib/supabase';

export default function App() {
  useEffect(() => {
    // Initialize analytics on app start
    const setupAnalytics = async () => {
      await initializeAnalytics();

      // Get current user and set user ID
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        await setUserId(data.session.user.id);
      }
    };

    setupAnalytics();
  }, []);

  return (
    <NavigationContainer>
      {/* Your navigation setup */}
    </NavigationContainer>
  );
}
```

---

### CameraScreen.tsx - Track Photo Captures

**File**: `GeoMarkApp/src/screens/CameraScreen.tsx`

Add tracking when user captures photos:

```typescript
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import {
  logPhotoCapture,
  logPhotoCaptureFailure,
  logPhotoSaved,
  logScreenView,
  logPermissionRequested,
  logPermissionResult,
  logFreeTierLimitHit,
} from '../utils/analytics';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Track screen view on mount
  useEffect(() => {
    logScreenView('CameraScreen', 'CameraScreen');
  }, []);

  // Track permission requests
  const handleRequestPermission = async () => {
    logPermissionRequested('camera');
    const result = await requestPermission();
    logPermissionResult('camera', result.granted);
    return result;
  };

  const takePicture = async () => {
    try {
      if (!cameraRef.current) {
        logPhotoCaptureFailure('camera_not_ready');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      if (!location) {
        logPhotoCaptureFailure('no_location');
        Alert.alert('Error', 'Could not get GPS location');
        return;
      }

      // Check free tier limit (example: 100 photos/month)
      const photoCount = await getMonthlyPhotoCount(); // Your function
      if (!isPremium && photoCount >= 100) {
        await logFreeTierLimitHit('photos');
        // Show upgrade prompt
        navigation.navigate('Paywall', { source: 'camera_limit' });
        return;
      }

      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
      });

      // Track successful capture with location
      await logPhotoCapture({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        altitude: location.coords.altitude || undefined,
      });

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      await logPhotoSaved();

      // Save to Supabase (your existing logic)
      await savePhotoToDatabase(photo, location);

      Alert.alert('Success', 'Photo captured with GPS data!');
    } catch (error) {
      logPhotoCaptureFailure('camera_error');
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera}>
        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <Text>Capture</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}
```

---

### MapScreen.tsx - Track Satellite Service Usage

**File**: `GeoMarkApp/src/screens/MapScreen.tsx`

Track when users open Roscosmos and other satellite services:

```typescript
import { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, Linking } from 'react-native';
import { SATELLITE_SERVICES } from '../utils/satelliteLinks';
import {
  logScreenView,
  logSatelliteView,
  logSatelliteModalOpened,
  logMapInteraction,
  logMapLayerChange,
} from '../utils/analytics';

export default function MapScreen() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  // Track screen view
  useEffect(() => {
    logScreenView('MapScreen', 'MapScreen');
  }, []);

  // Track map layer changes
  const handleMapTypeChange = (newType: 'standard' | 'satellite') => {
    setMapType(newType);
    logMapLayerChange(newType);
  };

  // Track when satellite modal is opened
  const handlePhotoPress = (photo: PhotoMetadata) => {
    setSelectedPhoto(photo);
    logSatelliteModalOpened();
  };

  // Track satellite service selection
  const openSatelliteService = async (serviceId: string, coords: Coordinates) => {
    const service = SATELLITE_SERVICES.find((s) => s.id === serviceId);
    if (!service) return;

    // Track which service was opened
    await logSatelliteView(serviceId as any, {
      lat: coords.latitude,
      lon: coords.longitude,
    });

    // Open external link
    const url = service.getLink(coords);
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Cannot open this satellite service');
    }

    // Close modal
    setSelectedPhoto(null);
  };

  // Track map interactions
  const handleMapPress = () => {
    logMapInteraction('pan');
  };

  const handleMarkerPress = (photo: PhotoMetadata) => {
    logMapInteraction('marker_tap');
    handlePhotoPress(photo);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType={mapType}
        onPress={handleMapPress}
      >
        {photos.map((photo) => (
          <Marker
            key={photo.id}
            coordinate={{
              latitude: photo.latitude,
              longitude: photo.longitude,
            }}
            onPress={() => handleMarkerPress(photo)}
          >
            <Image source={{ uri: photo.thumbnail }} style={styles.markerImage} />
          </Marker>
        ))}
      </MapView>

      {/* Satellite service selection modal */}
      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>View on Satellite Maps</Text>

            {SATELLITE_SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceButton}
                onPress={() =>
                  openSatelliteService(service.id, {
                    latitude: selectedPhoto!.latitude,
                    longitude: selectedPhoto!.longitude,
                  })
                }
              >
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPhoto(null)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
```

---

### GalleryScreen.tsx - Track Export and Search

**File**: `GeoMarkApp/src/screens/GalleryScreen.tsx`

Track photo exports and gallery interactions:

```typescript
import { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import {
  logScreenView,
  logExport,
  logExportFailure,
  logPhotoDeleted,
  logSearch,
  logShare,
  logFreeTierLimitHit,
} from '../utils/analytics';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  // Track screen view
  useEffect(() => {
    logScreenView('GalleryScreen', 'GalleryScreen');
  }, []);

  // Track search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    const results = photos.filter((p) =>
      p.location?.toLowerCase().includes(query.toLowerCase())
    );

    await logSearch(query, results.length);
  };

  // Track export
  const handleExport = async (format: 'csv' | 'geojson' | 'kml', selectedPhotos: Photo[]) => {
    try {
      // Check free tier limit (example: 10 exports/month)
      const exportCount = await getMonthlyExportCount(); // Your function
      if (!isPremium && exportCount >= 10) {
        await logFreeTierLimitHit('exports');
        navigation.navigate('Paywall', { source: 'export_limit' });
        return;
      }

      // Perform export (your existing logic)
      const exportData = await exportPhotos(selectedPhotos, format);

      // Track successful export
      await logExport({
        format: format,
        photoCount: selectedPhotos.length,
        includesMetadata: true,
      });

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(exportData.uri);
        await logShare('export_file');
      }

      Alert.alert('Success', `Exported ${selectedPhotos.length} photos as ${format.toUpperCase()}`);
    } catch (error) {
      await logExportFailure(error.message, format);
      Alert.alert('Error', 'Failed to export photos');
      console.error('Export error:', error);
    }
  };

  // Track deletion
  const handleDeletePhoto = async (photoId: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePhoto(photoId); // Your function
            await logPhotoDeleted();
            setPhotos((prev) => prev.filter((p) => p.id !== photoId));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search by location..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={photos}
        renderItem={({ item }) => (
          <PhotoCard
            photo={item}
            onDelete={() => handleDeletePhoto(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.exportButton}
        onPress={() => handleExport('geojson', photos)}
      >
        <Text>Export All</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

### SettingsScreen.tsx - Track Premium Upgrades

**File**: `GeoMarkApp/src/screens/SettingsScreen.tsx`

Track premium upgrade flows and settings changes:

```typescript
import { useState, useEffect } from 'react';
import { Switch, TouchableOpacity, Alert } from 'react-native';
import {
  logScreenView,
  logPremiumUpgrade,
  logPremiumPurchaseSuccess,
  logPremiumUpgradeCancel,
  logSettingChanged,
  setUserProperties,
} from '../utils/analytics';

export default function SettingsScreen() {
  const [isPremium, setIsPremium] = useState(false);
  const [autoSaveToGallery, setAutoSaveToGallery] = useState(true);
  const [highAccuracyMode, setHighAccuracyMode] = useState(false);

  // Track screen view
  useEffect(() => {
    logScreenView('SettingsScreen', 'SettingsScreen');
  }, []);

  // Track setting toggles
  const handleToggleAutoSave = async (value: boolean) => {
    setAutoSaveToGallery(value);
    await logSettingChanged('auto_save_to_gallery', value);
    // Save to storage
  };

  const handleToggleHighAccuracy = async (value: boolean) => {
    setHighAccuracyMode(value);
    await logSettingChanged('high_accuracy_mode', value);
    // Save to storage
  };

  // Track premium upgrade flow
  const handleUpgradeToPremium = async (tier: 'premium' | 'pro') => {
    try {
      // Log upgrade initiation
      await logPremiumUpgrade('settings');

      // Show payment screen (RevenueCat or similar)
      const result = await Purchases.purchasePackage(tier); // Example using RevenueCat

      if (result.purchaserInfo.entitlements.active[tier]) {
        // Purchase successful
        await logPremiumPurchaseSuccess(tier, result.price, result.currency);

        // Update user properties
        await setUserProperties({
          subscription_tier: tier,
          is_premium: true,
        });

        setIsPremium(true);
        Alert.alert('Success', `Welcome to GeoMark ${tier === 'pro' ? 'Pro' : 'Premium'}!`);
      }
    } catch (error) {
      if (error.userCancelled) {
        await logPremiumUpgradeCancel('settings', 'user_cancelled');
      } else {
        await logPremiumUpgradeCancel('settings', error.message);
        Alert.alert('Error', 'Purchase failed. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Premium status */}
      {!isPremium && (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => handleUpgradeToPremium('premium')}
        >
          <Text style={styles.upgradeText}>Upgrade to Premium - $4.99/mo</Text>
        </TouchableOpacity>
      )}

      {/* Settings */}
      <View style={styles.settingRow}>
        <Text>Auto-save to Gallery</Text>
        <Switch value={autoSaveToGallery} onValueChange={handleToggleAutoSave} />
      </View>

      <View style={styles.settingRow}>
        <Text>High Accuracy GPS</Text>
        <Switch value={highAccuracyMode} onValueChange={handleToggleHighAccuracy} />
      </View>

      {/* Pro upgrade */}
      {isPremium && (
        <TouchableOpacity
          style={styles.proButton}
          onPress={() => handleUpgradeToPremium('pro')}
        >
          <Text>Upgrade to Pro - $14.99/mo</Text>
          <Text style={styles.proFeatures}>
            Unlock Roscosmos satellite access & unlimited exports
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
```

---

### Paywall Screen - Track Conversion Funnel

**File**: `GeoMarkApp/src/screens/PaywallScreen.tsx` (create if doesn't exist)

Track premium paywall interactions:

```typescript
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  logScreenView,
  logPremiumUpgrade,
  logPremiumPurchaseSuccess,
  logPremiumUpgradeCancel,
} from '../utils/analytics';

interface PaywallScreenProps {
  route: {
    params: {
      source: 'camera_limit' | 'export_limit' | 'feature_gate' | 'settings';
    };
  };
}

export default function PaywallScreen({ route, navigation }: PaywallScreenProps) {
  const { source } = route.params;

  useEffect(() => {
    logScreenView('PaywallScreen', 'PaywallScreen');
  }, []);

  const handlePurchase = async (tier: 'premium' | 'pro') => {
    await logPremiumUpgrade(source);

    // Purchase logic...
    // On success: logPremiumPurchaseSuccess
    // On cancel: logPremiumUpgradeCancel
  };

  const handleClose = async () => {
    await logPremiumUpgradeCancel(source, 'dismissed_paywall');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Full Potential</Text>

      <TouchableOpacity onPress={() => handlePurchase('premium')}>
        <Text>Premium - $4.99/month</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePurchase('pro')}>
        <Text>Pro - $14.99/month</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleClose}>
        <Text>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Testing Analytics

### Development Testing

Run the app in development mode and watch console output:

```bash
npx expo start
```

Look for console logs like:
```
[Analytics] photo_captured { latitude: 55.7558, longitude: 37.6173, ... }
[Analytics] satellite_service_opened { service_name: 'roscosmos', ... }
```

### Firebase Console Testing

1. Open Firebase Console: https://console.firebase.google.com
2. Navigate to Analytics > Events
3. Check "DebugView" tab
4. Run app on simulator/device in debug mode
5. Events should appear in real-time

### Key Events to Verify

- [ ] `app_opened` - Fires on app launch
- [ ] `photo_captured` - Fires when taking photo with GPS
- [ ] `satellite_service_opened` - Fires when opening Roscosmos/other services
- [ ] `photos_exported` - Fires on successful export
- [ ] `premium_purchase_initiated` - Fires when upgrade flow starts
- [ ] `premium_purchase_completed` - Fires on successful purchase
- [ ] `screen_view` - Fires when navigating to any screen

---

## Privacy Compliance

### GDPR / CCPA Settings

Add analytics opt-out in Settings:

```typescript
import { disableAnalytics } from '../utils/analytics';

const handleDisableAnalytics = async () => {
  await disableAnalytics();
  Alert.alert('Privacy', 'Analytics tracking has been disabled');
};
```

### Privacy Policy

Update privacy policy to mention:
- Firebase Analytics data collection
- Location data usage in analytics
- User right to opt-out
- Data retention period (Firebase default: 14 months)

---

## Monitoring Dashboards

### Key Metrics to Track

**User Acquisition:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- New users / day
- Retention (D1, D7, D30)

**Engagement:**
- Photos captured / user / day
- Satellite services opened / user
- Map interactions / session
- Average session duration

**Monetization:**
- Free tier limit hit events
- Premium upgrade funnel (initiated → completed)
- Conversion rate by source
- Monthly Recurring Revenue (MRR)

**Feature Adoption:**
- Roscosmos service usage vs other satellites
- Export format preferences (GeoJSON, KML, CSV)
- High accuracy mode adoption
- Auto-save usage

### Setting Up Dashboards

1. **Firebase Analytics Dashboard** (free):
   - Go to Firebase Console → Analytics
   - Create custom reports for key events
   - Set up funnels for premium conversion

2. **Google Analytics 4** (integrated with Firebase):
   - Link Firebase to GA4 property
   - Create exploration reports
   - Set up conversion goals

3. **RevenueCat Dashboard** (if using for subscriptions):
   - Track MRR, churn, LTV
   - A/B test pricing
   - Cohort analysis

---

## Next Steps

1. [ ] Install Firebase packages
2. [ ] Create Firebase project and add config
3. [ ] Add analytics imports to all screens
4. [ ] Test in development mode
5. [ ] Verify events in Firebase DebugView
6. [ ] Create custom dashboards
7. [ ] Set up alerts for critical events (errors, conversion drops)
8. [ ] Integrate with RevenueCat for subscription analytics

---

**Document Version**: 1.0
**Last Updated**: 2026-01-16
