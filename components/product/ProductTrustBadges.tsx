import { Shield, Zap, Lock } from 'lucide-react';

export function ProductTrustBadges() {
  return (
    <div className="flex flex-col gap-2 text-sm text-[#967F71]">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-[#CDA7B2]" />
        <span>Instant Access</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-[#CDA7B2]" />
        <span>Secure Checkout</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-[#CDA7B2]" />
        <span>Satisfaction Guaranteed</span>
      </div>
    </div>
  );
}
