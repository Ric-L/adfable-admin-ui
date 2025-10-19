import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showNotification(type: string, message: string) {
  if (type === "success") {
    toast.success(message, {
      duration: 2000,
      position: "top-center",
    });
  } else if (type === "error") {
    toast.error(message, {
      duration: 2000,
      position: "top-center",
    });
  }
}
