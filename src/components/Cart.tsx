'use client';

import { useCart } from '@/context/CartContext';
import ShippingCalculator from '@/components/ShippingCalculator';

export default function Cart() {
  const { state, removeItem, updateQuantity, toggleCart, total } = useCart();
  const cartTotal = total();
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={toggleCart}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] z-50 border-l border-[#333]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <h2 className="text-white font-bold text-xl uppercase tracking-wider">
            Your Cart
          </h2>
          <button
            onClick={toggleCart}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 350px)' }}>
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <img 
                src="/logos/8twologo.jpg" 
                alt="8TWO" 
                className="w-20 h-20 mx-auto mb-4 object-contain"
              />
              <p className="text-gray-400">Your cart is empty</p>
              <p className="text-gray-600 text-sm mt-2">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 bg-[#111] p-3 graffiti-border">
                  {/* Image placeholder */}
                  <div className="w-20 h-20 bg-[#1a1a1a] flex-shrink-0 image-placeholder flex items-center justify-center">
                    <span className="text-white font-bold text-xs">8TWO</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                      {item.product.name}
                    </h3>
                    
                    {/* Standard attributes */}
                    <p className="text-gray-500 text-xs mt-1">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' / '}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    
                    {/* Custom jersey details */}
                    {item.customConfig && (
                      <div className="mt-2 space-y-1">
                        {item.customConfig.name && (
                          <p className="text-gray-400 text-xs">
                            Name: <span className="text-white">{item.customConfig.name}</span>
                          </p>
                        )}
                        {item.customConfig.number && (
                          <p className="text-gray-400 text-xs">
                            Number: <span className="text-white">#{item.customConfig.number}</span>
                          </p>
                        )}
                        {item.customConfig.logoImage && (
                          <p className="text-gray-400 text-xs">
                            Logo: <span className="text-white">Custom</span>
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 bg-[#222] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
                        >
                          -
                        </button>
                        <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 bg-[#222] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-[#333] p-4 space-y-4">
            {/* Shipping Calculator */}
            <ShippingCalculator itemCount={itemCount} />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>${(cartTotal + 9.99).toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full bg-white text-black py-4 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
              Checkout
            </button>
            <p className="text-gray-500 text-xs text-center">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
