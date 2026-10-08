import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const LOCKED = ["the-beast", "rush-build"];

const CartDrawer = () => {
  const { items, subtotal, updateQuantity, removeFromCart, drawerOpen, setDrawerOpen } = useCart();
  const close = () => setDrawerOpen(false);
  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading">Your Cart</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            Your cart is empty.
            <Link to="/prebuilts" onClick={close} className="underline text-foreground">Browse builds</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-border mt-4">
              {items.map((i) => (
                <li key={i.slug} className="py-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground truncate">{i.name}</p>
                    <p className="text-sm text-muted-foreground">${(i.price * i.quantity).toLocaleString()}</p>
                  </div>
                  {!LOCKED.includes(i.slug) && (
                    <div className="flex items-center gap-1 border border-border rounded-full px-1">
                      <button aria-label="Decrease" onClick={() => updateQuantity(i.slug, i.quantity - 1)} className="p-1"><Minus className="w-3 h-3" /></button>
                      <span className="w-5 text-center text-sm">{i.quantity}</span>
                      <button aria-label="Increase" onClick={() => updateQuantity(i.slug, i.quantity + 1)} className="p-1"><Plus className="w-3 h-3" /></button>
                    </div>
                  )}
                  <button aria-label={`Remove ${i.name}`} onClick={() => removeFromCart(i.slug)} className="p-1 text-muted-foreground hover:text-foreground"><Trash2 className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-heading">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold text-foreground">${subtotal.toLocaleString()}</span>
              </div>
              <Link to="/checkout" onClick={close} className="btn-brand w-full justify-center">Checkout</Link>
              <Link to="/cart" onClick={close} className="block text-center text-sm text-muted-foreground underline">View full cart</Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
