import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils";
import { Check } from "lucide-react"
import React from "react"

interface AlertProps {
  type: 'success' | 'error';
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  description?: string
  cancel?: string | React.ReactNode
  next?: string | React.ReactNode
  className?: string
} 

export const Alert: React.FC<AlertProps> = ({ open, setOpen, type='success', title, description, cancel='Скасувати', next, className }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={cn(className, 'rounded-none')}>
        <AlertDialogHeader>
          <div className="flex justify-center">
            {type === 'success' && (
              <Check size={35} className="text-green-700 border border-green-800 rounded-full p-1" />
            )}
          </div>
          <AlertDialogTitle className="py-3 text-center">{title}</AlertDialogTitle>
          {description && <AlertDialogDescription className="pb-3 text-center">{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)} className={`${!next ? 'w-full' : 'sm:w-1/2'} rounded-none cursor-pointer`}>
            {cancel}
          </AlertDialogCancel>
          {next && <AlertDialogAction onClick={() => setOpen(false)} className="sm:w-1/2 rounded-none">
            {next}
          </AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
