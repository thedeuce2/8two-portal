'use client';

import { useMemo } from 'react';
import { BASE_SHIPPING, BULK_DISCOUNTS } from '@/data/products';

interface ShippingCalculatorProps {
  itemCount: number;
}

export default function ShippingCalculator({ itemCount }: ShippingCalculatorProps) {
  const { shipping, discount, savings, tier } = useMemo(() => {
    let shippingCost = BASE_SHIPPING;
    let appliedDiscount = 0;
    let appliedTier = null;
    let tierSavings = 0;

    // Find applicable bulk discount
    for (const tier of BULK_DISCOUNTS) {
      if (itemCount >= tier.minItems) {
        shippingCost = BASE_SHIPPING * (1 - tier.discount);
        appliedDiscount = tier.discount;
        appliedTier = tier;
        tierSavings = BASE_SHIPPING * tier.discount;
        break;
      }
    }

    return {
      shipping: shippingCost,
      discount: appliedDiscount,
      savings: tierSavings,
      tier: appliedTier,
    };
  }, [itemCount]);

  return (
    <div className="bg-zinc-900 rounded-xl p-4">
      <h3 className="font-bold text-white mb-3">Shipping</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        
        <div className="flex justify-between text-white">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        
        {tier && (
          <div className="flex justify-between text-green-400 text-sm">
            <span>{tier.label}</span>
            <span>-${savings.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Progress to next tier */}
      {!tier || tier.minItems !== 20 ? (
        <div className="mt-4 pt-4 border-t border-zinc-700">
          {tier ? (
            <div>
              <p className="text-gray-400 text-xs mb-2">
                Add {20 - itemCount} more items for 25% off shipping!
              </p>
              <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(itemCount / 20) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-xs mb-2">
                Add {5 - itemCount} more items for 10% off shipping!
              </p>
              <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(itemCount / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <p className="text-green-400 text-sm">🎉 Maximum shipping discount applied!</p>
        </div>
      )}
    </div>
  );
}
