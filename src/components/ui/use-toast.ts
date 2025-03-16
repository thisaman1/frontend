import { useToast as useHookToast, toast as hookToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

export const useToast = useHookToast;

// Export a combined toast function that uses both
export const toast = {
  ...hookToast,
  // Add sonner toast methods
  success: sonnerToast.success,
  error: sonnerToast.error,
  info: sonnerToast.info,
  warning: sonnerToast.warning,
  loading: sonnerToast.loading,
  promise: sonnerToast.promise,
  custom: sonnerToast
};