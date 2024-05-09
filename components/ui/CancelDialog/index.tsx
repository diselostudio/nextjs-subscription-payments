'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/Dialog';
import { FilloutStandardEmbed } from '@fillout/react';

interface Props {
  children: React.ReactNode;
  subscriptionId: string;
}

export function CancelDialog({ children, subscriptionId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!p-0 !rounded-xl !border-0">
        <div style={{ width: '100%', height: 650 }}>
          <FilloutStandardEmbed
            filloutId="mCNvn7ZAndus"
            parameters={{ subscriptionId: subscriptionId }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
