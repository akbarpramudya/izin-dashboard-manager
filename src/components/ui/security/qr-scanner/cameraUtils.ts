
/**
 * Camera utility functions for QR scanning
 */

// Check for available cameras
export const checkAvailableCameras = async (): Promise<MediaDeviceInfo[]> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.error("MediaDevices API not supported in this browser");
    return [];
  }

  try {
    // First request camera permission before enumerating devices
    // This is crucial for iOS Safari and some Android browsers
    await requestCameraPermission(null);
    
    // After permission is granted, enumerate devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log("Available cameras:", videoDevices);
    return videoDevices;
  } catch (error) {
    console.error("Error accessing camera devices:", error);
    return [];
  }
};

// Request camera permissions
export const requestCameraPermission = async (selectedCamera: string | null): Promise<boolean> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("getUserMedia not supported in this browser");
    return false;
  }
  
  try {
    // For mobile browsers, it's better to use simpler constraints
    const constraints = {
      video: selectedCamera 
        ? { deviceId: { exact: selectedCamera } }
        : { facingMode: "environment" } // Default to back camera for mobile
    };
    
    console.log("Requesting camera with constraints:", constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Stop the stream immediately - we just needed to request permission
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error("Error when requesting camera permission:", error);
    return false;
  }
};

// Get user-friendly error message
export const getCameraErrorMessage = (error: any): string => {
  console.error("Camera error details:", error);
  
  let errorMessage = "An error occurred while accessing the camera.";
  
  if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
    errorMessage = "Camera access was denied. Please allow camera access in your browser settings.";
  } else if (error?.name === "NotFoundError" || error?.name === "DevicesNotFoundError") {
    errorMessage = "No camera was found on your device.";
  } else if (error?.name === "NotReadableError" || error?.name === "TrackStartError") {
    errorMessage = "The camera is already in use by another application.";
  } else if (error?.name === "OverconstrainedError") {
    errorMessage = "The requested camera does not meet the required constraints.";
  } else if (error?.message) {
    errorMessage = error.message;
  }
  
  return errorMessage;
};

// Check if browser supports camera access
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// Manually attempt to initialize camera (for browsers that need extra prompting)
export const initializeCamera = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: "environment" },
      audio: false
    });
    
    // Stop stream immediately after initializing
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error("Failed to initialize camera:", error);
    return false;
  }
};
