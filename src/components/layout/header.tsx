
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpenText, CaseSensitive, Languages, SpellCheck, Volume2, Rocket, ScanSearch } from 'lucide-react';

const navItems = [
  { href: '/alphabet', label: 'Alphabet', icon: SpellCheck },
  { href: '/vocabulary', label: 'Vocabulary', icon: BookOpenText },
  { href: '/sentences', label: 'Sentences', icon: CaseSensitive },
  { href: '/pronunciation', label: 'Pronunciation', icon: Volume2 },
  { href: '/translation', label: 'Translation', icon: Languages },
  { href: '/identify-object', label: 'Identify Object', icon: ScanSearch },
];

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-accent transition-colors mb-2 sm:mb-0">
          <Rocket className="h-8 w-8 text-accent" />
          <span>LearnLink</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center sm:justify-end space-x-1 sm:space-x-1"> {/* Reduced space-x for more items */}
          {navItems.map((item) => (
            <Button 
              key={item.label} 
              variant="ghost" 
              asChild 
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent text-xs px-1 py-1 sm:text-sm sm:px-2 sm:py-2" /* Further reduced padding */
            >
              <Link href={item.href} className="flex items-center gap-1">
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden md:inline">{item.label}</span> {/* Show label on md and up */}
                <span className="md:hidden sr-only">{item.label}</span> {/* ARIA label for smaller screens */}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
