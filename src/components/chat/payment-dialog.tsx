import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
}

export function PaymentDialog({ open, onOpenChange, onPaymentSuccess }: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl card-shadow">
        <DialogHeader>
          <DialogTitle>Secure Payment</DialogTitle>
          <DialogDescription>
            Enter your card details. This is a simulation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePayment}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-number" className="text-right">
                Card Number
              </Label>
              <Input id="card-number" defaultValue="4242 4242 4242 4242" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry" className="text-right">
                Expiry
              </Label>
              <Input id="expiry" defaultValue="12/26" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvc" className="text-right">
                CVC
              </Label>
              <Input id="cvc" defaultValue="123" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full soft-shadow"
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing ? 'Processing...' : 'Pay $50.00'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
