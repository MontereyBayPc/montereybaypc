import { eligibleUpgrades } from '@/lib/shopping';
import { useCart } from '@/context/CartContext';
import { Checkbox } from '@/components/ui/checkbox';
export default function CheckoutUpgrades(){
  const {items,addToCart,removeFromCart}=useCart();
  const upgrades=eligibleUpgrades(items.map(i=>i.slug));
  if(!upgrades.length)return null;
  const count=items.filter(i=>['starter','mid','high-end','extreme'].includes(i.slug)).reduce((n,i)=>n+i.quantity,0);
  if(count!==1)return null;
  return <section className="mt-8 border-t border-border pt-6"><h2 className="font-heading font-semibold">Make room for more</h2><p className="text-xs text-muted-foreground mt-2 mb-4">Optional upgrades for this PC. Standard memory is sufficient for most gaming; choose more for demanding workloads.</p><div className="space-y-5">{upgrades.map(u=><label key={u.slug} className="flex gap-3 cursor-pointer"><Checkbox checked={items.some(i=>i.slug===u.slug)} onCheckedChange={v=>v?addToCart(u):removeFromCart(u.slug)} aria-label={u.name}/><span className="flex-1"><span className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>{u.name}</span><span>+${u.price}</span></span><span className="block mt-1 text-xs text-muted-foreground">{u.description}</span></span></label>)}</div></section>;
}
