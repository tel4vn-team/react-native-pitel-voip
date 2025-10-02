/**
 * Navigation Helper
 * Cleans navigation params to avoid serialization issues
 */

export const cleanNavigationParams = (params) => {
  const cleanedParams = {};

  for (const [key, value] of Object.entries(params)) {
    // Skip functions and complex objects that can't be serialized
    if (typeof value === 'function') {
      console.warn(`[Navigation] Skipping function parameter: ${key}`);
      continue;
    }

    if (value && typeof value === 'object') {
      // Check if it's a simple object or has circular references
      try {
        JSON.stringify(value);
        cleanedParams[key] = value;
      } catch (error) {
        console.warn(
          `[Navigation] Skipping non-serializable parameter: ${key}`,
          error.message
        );
        continue;
      }
    } else {
      cleanedParams[key] = value;
    }
  }

  return cleanedParams;
};

export const createCallScreenParams = ({
  phoneNumber,
  displayName,
  direction,
  callState,
  callID,
  // pitelSDK should be accessed via context, not params
}) => {
  return cleanNavigationParams({
    phoneNumber,
    displayName,
    direction,
    callState,
    callID,
  });
};
