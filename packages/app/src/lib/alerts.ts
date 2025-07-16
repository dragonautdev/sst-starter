import type { ReactNode } from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"

type AlertType = 'success' | 'error' | 'info'

interface AlertOptions {
  type?: AlertType
  message: string
  timeout?: number
  icon?: ReactNode
}

export const addAlert = ({ 
  type = 'info', 
  message, 
  timeout = 3000, 
  icon 
}: AlertOptions): void => {
  const options = { duration: timeout, ...(icon && { icon }) }
  
  switch (type) {
    case 'success':
      toast.success(message, { duration: timeout })
      break
    case 'error':
      toast.error(message, { duration: timeout })
      break
    default:
      toast(message, options)
  }
}

export const addSuccess = (options: Omit<AlertOptions, 'type'>) => 
  addAlert({ ...options, type: 'success' })

export const addError = (options: Omit<AlertOptions, 'type'>) => 
  addAlert({ ...options, type: 'error' })

export const addInfo = (options: Omit<AlertOptions, 'type' | 'icon'>) => 
  addAlert({ ...options, type: 'info', icon: Info as unknown as ReactNode }) 