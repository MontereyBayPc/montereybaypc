import { useEffect, useState } from 'react';
import { CheckoutElementsProvider, ExpressCheckoutElement, PaymentElement, ShippingAddressElement, ContactDetailsElement, useCheckout } from '@stripe/react-stripe-js/checkout';
import { getStripe } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
function PaymentForm({shipping}:{shipping:boolean}) {
  const result=useCheckout();const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  if(result.type==='loading')return <p className="py-6">Loading secure payment...</p>;
  if(result.type==='error')return <p role="alert" className="text-destructive">{result.error.message}</p>;
  const checkout=result.checkout;
  return <div className="space-y-6"><ExpressCheckoutElement options={{buttonHeight:48,layout:{maxColumns:2,maxRows:2},paymentMethods:{applePay:'auto',googlePay:'auto'}} onConfirm={async event=>{setBusy(true);setError('');const response=await checkout.confirm({expressCheckoutConfirmEvent:event});if(response.type==='error')setError(response.error.message);setBusy(false);}}/><ContactDetailsElement/>{shipping&&<ShippingAddressElement/>}<PaymentElement/>{error&&<p role="alert" className="text-destructive">{error}</p>}<Button disabled={busy} className="w-full" onClick={async()=>{setBusy(true);setError('');const response=await checkout.confirm();if(response.type==='error')setError(response.error.message);setBusy(false);}}>{busy?'Processing...':'Pay securely'}</Button></div>;
}
export default function ExpressPayment({loadSecret,shipping}:{loadSecret:()=>Promise<string>;shipping:boolean}) {
  const [secret,setSecret]=useState<string|null>(null);const [error,setError]=useState('');
  useEffect(()=>{let active=true;loadSecret().then(s=>{if(active)setSecret(s);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[loadSecret]);
  if(error)return <p role="alert" className="text-destructive p-6">{error}</p>;
  if(!secret)return <p className="p-6">Loading secure checkout...</p>;
  return <div className="p-6"><CheckoutElementsProvider stripe={getStripe()} options={{clientSecret:secret}}><PaymentForm shipping={shipping}/></CheckoutElementsProvider></div>;
}