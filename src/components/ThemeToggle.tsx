import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function ThemeToggle(){const {theme,setTheme}=useTheme();const light=theme==='light';return <Button variant="ghost" size="icon-sm" aria-label={light?'Switch to dark mode':'Switch to light mode'} title={light?'Switch to dark mode':'Switch to light mode'} onClick={()=>setTheme(light?'dark':'light')}>{light?<Moon/>:<Sun/>}</Button>;}
