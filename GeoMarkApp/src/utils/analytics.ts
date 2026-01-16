/**
 * Analytics Utility for GeoMark
 *
 * Centralized analytics tracking for Firebase Analytics, Google Analytics 4, and Sentry.
 * This file provides a unified interface for logging events across all analytics platforms.
 *
 * Setup Instructions:
 * 1. Install dependencies: npx expo install @react-native-firebase/app @react-native-firebase/analytics
 * 2. Configure Firebase in app.json (see ANALYTICS_SETUP.md)
 * 3. Import this module in screens where tracking is needed
 *
 * @module analytics
 */

// Conditional imports - Firebase only available after installation
let analytics: any = null;

try {
  // Firebase Analytics (native iOS/Android)
  analytics = require('@react-native-firebase/analytics').default;
} catch (error) {
  console.warn('Firebase Analytics not available. Install @react-native-firebase/analytics');
}

/**
 * Custom event parameters interface
 */
interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Photo capture location data
 */
interface PhotoLocation {
  lat: number;
  lon: number;
  accuracy?: number;
  altitude?: number;
}

/**
 * Export format and metadata
 */
interface ExportData {
  format: string;
  photoCount: number;
  includesMetadata?: boolean;
}

/**
 * Premium upgrade source tracking
 */
type UpgradeSource = 'paywall' | 'settings' | 'camera_limit' | 'export_limit' | 'feature_gate';

/**
 * Satellite service names
 */
type SatelliteService = 'roscosmos' | 'google_earth' | 'yandex_maps' | 'openstreetmap';

// =============================================================================
// CORE ANALYTICS FUNCTIONS
// =============================================================================

/**
 * Log a custom event with parameters
 *
 * @param eventName - Name of the event (snake_case preferred)
 * @param params - Key-value pairs of event parameters
 *
 * @example
 * logEvent('button_clicked', { button_name: 'capture', screen: 'camera' });
 */
export const logEvent = async (eventName: string, params?: EventParams): Promise<void> => {
  try {
    if (analytics) {
      await analytics().logEvent(eventName, params);
    }

    // Also log to console in development
    if (__DEV__) {
      console.log(`[Analytics] ${eventName}`, params);
    }
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

/**
 * Set user properties for analytics
 *
 * @param properties - User properties to set
 *
 * @example
 * setUserProperties({ subscription_tier: 'premium', language: 'ru' });
 */
export const setUserProperties = async (properties: EventParams): Promise<void> => {
  try {
    if (analytics) {
      for (const [key, value] of Object.entries(properties)) {
        await analytics().setUserProperty(key, String(value));
      }
    }

    if (__DEV__) {
      console.log('[Analytics] User properties set:', properties);
    }
  } catch (error) {
    console.error('Error setting user properties:', error);
  }
};

/**
 * Set user ID for analytics
 *
 * @param userId - Unique user identifier (e.g., Supabase user ID)
 */
export const setUserId = async (userId: string | null): Promise<void> => {
  try {
    if (analytics) {
      await analytics().setUserId(userId);
    }

    if (__DEV__) {
      console.log('[Analytics] User ID set:', userId);
    }
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
};

/**
 * Log screen view event
 *
 * @param screenName - Name of the screen
 * @param screenClass - Optional screen class/component name
 *
 * @example
 * logScreenView('CameraScreen', 'CameraScreen');
 */
export const logScreenView = async (screenName: string, screenClass?: string): Promise<void> => {
  try {
    if (analytics) {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    }

    if (__DEV__) {
      console.log(`[Analytics] Screen view: ${screenName}`);
    }
  } catch (error) {
    console.error('Error logging screen view:', error);
  }
};

// =============================================================================
// PHOTO CAPTURE EVENTS
// =============================================================================

/**
 * Log when a photo is captured with GPS data
 *
 * @param location - GPS coordinates and accuracy
 *
 * Tracked metrics:
 * - Total photos captured
 * - Location accuracy distribution
 * - Geographic coverage (lat/lon ranges)
 * - Altitude usage
 */
export const logPhotoCapture = async (location: PhotoLocation): Promise<void> => {
  await logEvent('photo_captured', {
    latitude: location.lat,
    longitude: location.lon,
    accuracy_meters: location.accuracy || 0,
    altitude_meters: location.altitude || 0,
    timestamp: new Date().toISOString(),
    has_high_accuracy: location.accuracy ? location.accuracy < 10 : false,
  });
};

/**
 * Log when photo capture fails
 *
 * @param reason - Failure reason (e.g., 'no_location', 'camera_error', 'permission_denied')
 */
export const logPhotoCaptureFailure = async (reason: string): Promise<void> => {
  await logEvent('photo_capture_failed', {
    failure_reason: reason,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when user saves photo to device gallery
 */
export const logPhotoSaved = async (): Promise<void> => {
  await logEvent('photo_saved_to_gallery', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when user deletes a photo
 */
export const logPhotoDeleted = async (): Promise<void> => {
  await logEvent('photo_deleted', {
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// SATELLITE SERVICE EVENTS (Roscosmos Integration)
// =============================================================================

/**
 * Log when user opens an external satellite service
 *
 * @param service - Which satellite service was opened
 * @param coordinates - Location coordinates being viewed
 *
 * Key metric for Roscosmos partnership ROI
 */
export const logSatelliteView = async (
  service: SatelliteService,
  coordinates?: { lat: number; lon: number }
): Promise<void> => {
  await logEvent('satellite_service_opened', {
    service_name: service,
    feature: 'roscosmos_integration',
    latitude: coordinates?.lat,
    longitude: coordinates?.lon,
    is_roscosmos: service === 'roscosmos',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when user views satellite service selection modal
 */
export const logSatelliteModalOpened = async (): Promise<void> => {
  await logEvent('satellite_modal_opened', {
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// EXPORT EVENTS
// =============================================================================

/**
 * Log when user exports photos
 *
 * @param data - Export format and metadata
 *
 * Tracks export feature usage and format preferences
 */
export const logExport = async (data: ExportData): Promise<void> => {
  await logEvent('photos_exported', {
    export_format: data.format,
    photo_count: data.photoCount,
    includes_metadata: data.includesMetadata ?? true,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when export fails
 *
 * @param reason - Failure reason
 * @param format - Intended export format
 */
export const logExportFailure = async (reason: string, format: string): Promise<void> => {
  await logEvent('export_failed', {
    failure_reason: reason,
    export_format: format,
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// PREMIUM/MONETIZATION EVENTS
// =============================================================================

/**
 * Log when user initiates premium upgrade flow
 *
 * @param source - Where the upgrade was initiated from
 *
 * Critical for conversion funnel analysis
 */
export const logPremiumUpgrade = async (source: UpgradeSource = 'paywall'): Promise<void> => {
  await logEvent('premium_purchase_initiated', {
    source: source,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log successful premium purchase
 *
 * @param tier - Subscription tier ('premium' or 'pro')
 * @param price - Price paid
 * @param currency - Currency code (e.g., 'USD', 'RUB')
 */
export const logPremiumPurchaseSuccess = async (
  tier: 'premium' | 'pro',
  price: number,
  currency: string
): Promise<void> => {
  await logEvent('premium_purchase_completed', {
    subscription_tier: tier,
    price: price,
    currency: currency,
    timestamp: new Date().toISOString(),
  });

  // Set user property for segmentation
  await setUserProperties({ subscription_tier: tier });
};

/**
 * Log when user cancels premium upgrade
 *
 * @param source - Where cancellation occurred
 * @param reason - Optional cancellation reason
 */
export const logPremiumUpgradeCancel = async (
  source: UpgradeSource,
  reason?: string
): Promise<void> => {
  await logEvent('premium_purchase_cancelled', {
    source: source,
    cancellation_reason: reason || 'user_dismissed',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when user hits free tier limit
 *
 * @param limitType - Which limit was hit ('photos', 'exports', 'ai_features')
 */
export const logFreeTierLimitHit = async (limitType: string): Promise<void> => {
  await logEvent('free_tier_limit_reached', {
    limit_type: limitType,
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// MAP INTERACTION EVENTS
// =============================================================================

/**
 * Log when user interacts with map
 *
 * @param action - Type of interaction
 */
export const logMapInteraction = async (
  action: 'zoom' | 'pan' | 'marker_tap' | 'layer_change'
): Promise<void> => {
  await logEvent('map_interaction', {
    action: action,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when user changes map layer
 *
 * @param layer - New layer selected
 */
export const logMapLayerChange = async (layer: string): Promise<void> => {
  await logEvent('map_layer_changed', {
    layer_name: layer,
    is_roscosmos: layer.includes('roscosmos') || layer.includes('geoportal'),
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// USER ENGAGEMENT EVENTS
// =============================================================================

/**
 * Log app open event
 */
export const logAppOpen = async (): Promise<void> => {
  await logEvent('app_opened', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when user completes onboarding
 */
export const logOnboardingComplete = async (): Promise<void> => {
  await logEvent('onboarding_completed', {
    timestamp: new Date().toISOString(),
  });

  await setUserProperties({ has_completed_onboarding: true });
};

/**
 * Log when user shares content
 *
 * @param contentType - What was shared ('photo', 'app_link', 'screenshot')
 */
export const logShare = async (contentType: string): Promise<void> => {
  await logEvent('content_shared', {
    content_type: contentType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log when user enables/disables a setting
 *
 * @param settingName - Name of the setting
 * @param value - New value
 */
export const logSettingChanged = async (settingName: string, value: boolean | string): Promise<void> => {
  await logEvent('setting_changed', {
    setting_name: settingName,
    setting_value: String(value),
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// ERROR TRACKING
// =============================================================================

/**
 * Log non-fatal error for monitoring
 *
 * @param errorName - Error identifier
 * @param errorMessage - Error description
 * @param context - Additional context
 */
export const logError = async (
  errorName: string,
  errorMessage: string,
  context?: EventParams
): Promise<void> => {
  await logEvent('app_error', {
    error_name: errorName,
    error_message: errorMessage,
    ...context,
    timestamp: new Date().toISOString(),
  });

  // In production, also send to Sentry or similar service
  if (!__DEV__) {
    console.error(`[Analytics Error] ${errorName}: ${errorMessage}`, context);
  }
};

// =============================================================================
// PERMISSION TRACKING
// =============================================================================

/**
 * Log when permission is requested
 *
 * @param permission - Permission type ('camera', 'location', 'photos')
 */
export const logPermissionRequested = async (permission: string): Promise<void> => {
  await logEvent('permission_requested', {
    permission_type: permission,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log permission grant/denial result
 *
 * @param permission - Permission type
 * @param granted - Whether permission was granted
 */
export const logPermissionResult = async (permission: string, granted: boolean): Promise<void> => {
  await logEvent('permission_result', {
    permission_type: permission,
    was_granted: granted,
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// SEARCH AND DISCOVERY
// =============================================================================

/**
 * Log when user searches in gallery
 *
 * @param query - Search query
 * @param resultsCount - Number of results found
 */
export const logSearch = async (query: string, resultsCount: number): Promise<void> => {
  await logEvent('gallery_search', {
    search_query: query,
    results_count: resultsCount,
    has_results: resultsCount > 0,
    timestamp: new Date().toISOString(),
  });
};

// =============================================================================
// EXPORT UTILITIES
// =============================================================================

/**
 * Initialize analytics on app start
 * Call this in App.tsx or index.js
 */
export const initializeAnalytics = async (): Promise<void> => {
  try {
    if (analytics) {
      // Enable analytics collection
      await analytics().setAnalyticsCollectionEnabled(true);

      // Log app open
      await logAppOpen();

      if (__DEV__) {
        console.log('[Analytics] Initialized successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing analytics:', error);
  }
};

/**
 * Disable analytics (for privacy/GDPR compliance)
 */
export const disableAnalytics = async (): Promise<void> => {
  try {
    if (analytics) {
      await analytics().setAnalyticsCollectionEnabled(false);
      console.log('[Analytics] Collection disabled');
    }
  } catch (error) {
    console.error('Error disabling analytics:', error);
  }
};

// Export all functions as default object for convenience
export default {
  // Core
  logEvent,
  setUserProperties,
  setUserId,
  logScreenView,

  // Photos
  logPhotoCapture,
  logPhotoCaptureFailure,
  logPhotoSaved,
  logPhotoDeleted,

  // Satellite (Roscosmos)
  logSatelliteView,
  logSatelliteModalOpened,

  // Export
  logExport,
  logExportFailure,

  // Premium
  logPremiumUpgrade,
  logPremiumPurchaseSuccess,
  logPremiumUpgradeCancel,
  logFreeTierLimitHit,

  // Map
  logMapInteraction,
  logMapLayerChange,

  // Engagement
  logAppOpen,
  logOnboardingComplete,
  logShare,
  logSettingChanged,

  // Errors
  logError,

  // Permissions
  logPermissionRequested,
  logPermissionResult,

  // Search
  logSearch,

  // Lifecycle
  initializeAnalytics,
  disableAnalytics,
};
