'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog';
import { FilloutStandardEmbed } from '@fillout/react';

interface Props {
  children: React.ReactNode;
  subscriptionId: string;
  product: string;
  onOpenChange?: () => void;
}

export function CancelDialog({
  children,
  subscriptionId,
  product,
  onOpenChange = () => null
}: Props) {
  const now = new Date();
  now.setMonth(now.getMonth() + 2);

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!p-0 !rounded-xl !border-0">
        <div style={{ width: '100%', height: 650 }}>
          <FilloutStandardEmbed
            filloutId="mCNvn7ZAndus"
            parameters={{
              subscriptionId: subscriptionId,
              product,
              renewDate: now.toDateString()
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
