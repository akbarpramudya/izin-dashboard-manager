
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
    return false;
  }
  
  try {
    await navigator.mediaDevices.getUserMedia({ 
      video: selectedCamera 
        ? { deviceId: { exact: selectedCamera } }
        : true 
    });
    return true;
  } catch (error) {
    console.error("Error when requesting camera permission:", error);
    return false;
  }
};

// Get user-friendly error message
export const getCameraErrorMessage = (error: any): string => {
  let errorMessage = "An error occurred while accessing the camera.";
  
  if (error?.name === "NotAllowedError") {
    errorMessage = "Camera access was denied. Please allow camera access in your browser settings.";
  } else if (error?.name === "NotFoundError") {
    errorMessage = "No camera was found on your device.";
  } else if (error?.name === "NotReadableError") {
    errorMessage = "The camera is already in use by another application.";
  } else if (error?.name === "OverconstrainedError") {
    errorMessage = "The requested camera does not meet the required constraints.";
  } else if (error?.message) {
    errorMessage = error.message;
  }
  
  return errorMessage;
};
