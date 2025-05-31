/**
 * localStorage utility for safe client-side storage operations
 * Handles server-side rendering gracefully and provides type-safe operations
 */

const STORAGE_KEYS = {
  CV_BUILDER_DATA: "siraty_cv_builder_data",
  CV_BUILDER_STEP: "siraty_cv_builder_step",
} as const;

export { STORAGE_KEYS };

/**
 * Check if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const testKey = "__localStorage_test__";
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely get an item from localStorage
 */
export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to parse localStorage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set an item in localStorage
 */
export const setLocalStorageItem = (key: string, value: unknown): boolean => {
  if (!isLocalStorageAvailable()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to set localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 */
export const removeLocalStorageItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Clear all CV builder data from localStorage
 */
export const clearCVBuilderData = (): boolean => {
  if (!isLocalStorageAvailable()) return false;

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.warn("Failed to clear CV builder data:", error);
    return false;
  }
};

/**
 * Get the total size of CV builder data in localStorage (approximate)
 */
export const getCVBuilderDataSize = (): number => {
  if (!isLocalStorageAvailable()) return 0;

  try {
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = window.localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });
    return totalSize;
  } catch {
    return 0;
  }
};
