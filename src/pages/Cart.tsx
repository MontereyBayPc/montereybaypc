import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h1 className="font-heading text-5xl lg:text-6xl font-bold text-foreground mb-10">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 border border-border rounded-2xl">
              <p className="text-muted-foreground mb-6">Your cart is empty.</p>
              <Link
                to="/prebuilts"
                className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full"
              >
                Browse Prebuilts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="border border-border rounded-2xl divide-y divide-border">
                {items.map((item) => (
                  <div key={item.slug} className="p-6 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <Link to={`/prebuilts/${item.slug}`} className="font-heading text-xl font-bold text-foreground hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-muted-foreground text-sm mt-1">${item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-2 border border-border rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="p-1 hover:text-foreground text-muted-foreground"
                        aria-label="Decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="p-1 hover:text-foreground text-muted-foreground"
                        aria-label="Increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-heading font-bold text-foreground w-24 text-right">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.slug)}
                      className="text-muted-foreground hover:text-foreground p-2"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-muted-foreground text-sm">Taxes & delivery calculated at checkout.</div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Subtotal</div>
                    <div className="font-heading text-3xl font-bold text-foreground">${subtotal.toLocaleString()}</div>
                  </div>
                  <Link
                    to="/checkout"
                    className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full hover:scale-105 transition-transform"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
