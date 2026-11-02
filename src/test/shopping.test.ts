import { describe,it,expect } from 'vitest';
import { cartShareUrl,readSharedCart,eligibleUpgrades,matchesGameTarget } from '@/lib/shopping';
import { prebuiltCatalog } from '@/data/prebuilts-catalog';
import { estimateBuild,optimizeBuild } from '@/lib/build-optimizer';
const parts=[{id:'cpu',category:'cpu',name:'AMD Ryzen 7 7800X3D',price:300},{id:'gpu',category:'gpu',name:'NVIDIA RTX 4060',price:300},{id:'am5',category:'motherboard',name:'ASUS ROG Strix B650-A',price:100},{id:'intel',category:'motherboard',name:'MSI MAG Z790 Tomahawk WiFi',price:50},{id:'ddr5',category:'ram',name:'32GB DDR5-6000',price:100},{id:'ddr4',category:'ram',name:'16GB DDR4-3200',price:40},{id:'psu',category:'psu',name:'Corsair RM750e 750W',price:100}];
describe('shopping rules',()=>{
 it('shares selections only and restores current catalog prices',()=>{const url=cartShareUrl('https://example.com',[{slug:'starter',quantity:1}]);const restored=readSharedCart(new URL(url).searchParams.get('cart'));expect(restored?.[0]).toEqual({slug:'starter',name:prebuiltCatalog[0].name,price:899,quantity:1});expect(atob(new URL(url).searchParams.get('cart')??'')).toBe('[{"s":"starter","q":1}]');});
 it('rejects unknown shared products and invalid quantities',()=>{expect(readSharedCart(btoa('[{"s":"fake","q":1}]'))).toBeNull();expect(readSharedCart(btoa('[{"s":"starter","q":0}]'))).toBeNull();});
 it('does not offer a 64GB upgrade on an already 64GB build',()=>{const pc=prebuiltCatalog.find(p=>/64GB/.test(p.specs.ram));expect(pc).toBeDefined();expect(eligibleUpgrades([pc?.slug??'']).map(p=>p.slug)).not.toContain('upgrade-ram-64gb');});
 it('includes the 20 percent assembly fee',()=>{expect(estimateBuild(parts,{cpu:'cpu',gpu:'gpu'},[])).toBe(720);});
 it('enforces the 75 dollar minimum assembly fee',()=>{expect(estimateBuild(parts,{ram:'ddr4'},[])).toBe(115);});
 it('preserves CPU/GPU and picks known-compatible supporting parts',()=>{const original={cpu:'cpu',gpu:'gpu'};const next=optimizeBuild(parts,original,[],2000);expect(next).toEqual({cpu:'cpu',gpu:'gpu',motherboard:'am5',ram:'ddr5',psu:'psu'});expect(original).toEqual({cpu:'cpu',gpu:'gpu'});});
 it('does not match a missing game or an unattainable FPS target',()=>{expect(matchesGameTarget(prebuiltCatalog[0],'Missing game',0,60)).toBe(false);expect(matchesGameTarget(prebuiltCatalog[0],prebuiltCatalog[0].performance.games[0].name.replace(/\s*\(.*\)/,''),0,9999)).toBe(false);});
});
