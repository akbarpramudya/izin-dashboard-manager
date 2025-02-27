
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PermissionStatus, PermissionType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Function to format time
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Function to format date and time
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Function to calculate duration between two dates
export function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffInMs = Math.abs(end.getTime() - start.getTime());
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `${Math.round(diffInHours)} hours`;
  } else {
    const diffInDays = diffInHours / 24;
    return `${Math.round(diffInDays)} days`;
  }
}

// Function to get status color
export function getStatusColor(status: PermissionStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Function to get permission type label
export function getPermissionTypeLabel(type: PermissionType): string {
  switch (type) {
    case "sick":
      return "Sick Leave";
    case "vacation":
      return "Vacation";
    case "personal":
      return "Personal Leave";
    case "other":
      return "Other";
    default:
      return type;
  }
}

// Function to generate a mock QR code (in a real app this would be more complex)
export function generateQRCode(data: string): string {
  // In a real app, this would generate an actual QR code
  // For this mock, we'll just return a fake data URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
}

// Function to get notification color based on type
export function getNotificationColor(type: 'info' | 'success' | 'warning' | 'error'): string {
  switch (type) {
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "success":
      return "bg-green-100 text-green-800 border-green-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "error":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Modified toast removal delay (5000ms = 5 seconds instead of 1000000ms)
export function updateToastSettings() {
  const TOAST_REMOVE_DELAY = 5000; // 5 seconds is more reasonable
  return TOAST_REMOVE_DELAY;
}

// Function to get current user (mock)
let currentUser = {
  id: "user-1",
  role: "admin",
};

export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(userId: string, role: string) {
  currentUser = { id: userId, role };
}
