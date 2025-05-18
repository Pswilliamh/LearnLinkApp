
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookOpenText, CaseSensitive, Languages, SpellCheck, Volume2, Rocket, ScanSearch, GraduationCap, Puzzle, BookCopy } from 'lucide-react';

const navItems = [
  { href: '/alphabet', label: 'Alphabet', icon: SpellCheck },
  { href: '/vocabulary', label: 'Vocabulary', icon: BookOpenText },
  { href: '/sentences', label: 'Sentences', icon: CaseSensitive },
  { href: '/pronunciation', label: 'Pronunciation', icon: Volume2 },
  { href: '/translation', label: 'Translation', icon: Languages },
  { href: '/identify-object', label: 'Identify Object', icon: ScanSearch },
  { href: '/match-game', label: 'Word Match', icon: Puzzle },
  { href: '/flipbook', label: 'Flipbook', icon: BookCopy },
  { href: '/advanced-learner', label: 'Advanced', icon: GraduationCap },
];

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-row justify-between items-center">
        {/* Left side: Eagle Logo */}
        <Link href="/" className="flex items-center" aria-label="Homepage">
          <Image
            src="/images/eagle-header-logo.png"
            alt="LearnLink Eagle Logo"
            width={40}
            height={40}
            className="h-10 w-auto" // Controls displayed size, h-10 keeps height, w-auto maintains aspect ratio
          />
        </Link>

        {/* Right side: Grouping LearnLink title and Nav */}
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-right">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:text-accent transition-colors mb-2 sm:mb-0 sm:mr-4">
            <Rocket className="h-8 w-8 text-accent" />
            <span>LearnLink</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center sm:justify-end space-x-1 sm:space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                asChild
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent text-xs px-1 py-1 sm:text-sm sm:px-2 sm:py-2"
              >
                <Link href={item.href} className="flex items-center gap-1">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden sr-only">{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
