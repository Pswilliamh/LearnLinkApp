
import type { PropsWithChildren } from 'react';
import { Header } from './header';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground py-6 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear() + 1} Kingdom Of Heaven Embassy Inc. All rights reserved.</p>
          <p>LearnLink. Empowering students through language.</p>
        </div>
      </footer>
    </div>
  );
}
