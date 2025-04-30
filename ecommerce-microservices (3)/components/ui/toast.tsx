"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useToast } from "./use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center justify-between w-72 p-4 rounded-md shadow-lg",
            toast.variant === "destructive" && "bg-destructive text-destructive-foreground",
            toast.variant === "success" && "bg-green-600 text-white",
            toast.variant === "default" && "bg-background border",
          )}
        >
          <div className="flex items-start gap-3">
            {toast.variant === "success" && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
            {toast.variant === "destructive" && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            {toast.variant === "default" && <Info className="h-5 w-5 flex-shrink-0" />}
            <div className="space-y-1">
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
            </div>
          </div>
          <button onClick={() => dismiss(toast.id)} className="ml-4 p-1 rounded-full hover:bg-background/10">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
