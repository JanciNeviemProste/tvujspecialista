'use client';

import Link from 'next/link';
import { MobileNav } from '@/components/layout/MobileNav';

export default function HomePageClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <header className="border-b bg-white dark:bg-card sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-primary">tvujspecialista.cz</div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/hledat" className="text-sm font-medium hover:text-blue-600 dark:hover:text-primary transition-colors">Hledat</Link>
            <Link href="/ceny" className="text-sm font-medium hover:text-blue-600 dark:hover:text-primary transition-colors">Ceny</Link>
            <Link href="/profi/registrace" className="rounded bg-blue-600 dark:bg-primary px-4 py-2 text-sm text-white hover:bg-blue-700 dark:hover:bg-primary/90 transition-colors">
              Registrace zdarma
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </header>

      <main id="main-content">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-foreground">
              Najděte ověřeného specialistu<br className="hidden sm:block" />za 2 minuty
            </h1>
            <p className="mb-8 text-lg sm:text-xl text-gray-600 dark:text-muted-foreground">
              Porovnejte specialisty, přečtěte si recenze a kontaktujte ty nejlepší
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl sm:text-3xl font-bold dark:text-foreground">Vyberte kategorii specialisty</h2>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <Link href="/hledat?category=financni-poradce" className="rounded-lg border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-4xl sm:text-5xl" aria-hidden="true">&#x1F4BC;</div>
                <h3 className="mb-3 text-xl sm:text-2xl font-semibold dark:text-foreground">Finanční poradce</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                  Komplexní finanční poradenství - hypotéky, pojištění, investice a úvěry
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-primary">Zobrazit specialisty &rarr;</div>
              </Link>
              <Link href="/hledat?category=realitni-makler" className="rounded-lg border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-4xl sm:text-5xl" aria-hidden="true">&#x1F3E0;</div>
                <h3 className="mb-3 text-xl sm:text-2xl font-semibold dark:text-foreground">Realitní makléř</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                  Prodej, pronájem a správa nemovitostí - byty, domy a komerční prostory
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-primary">Zobrazit specialisty &rarr;</div>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t bg-gray-50 dark:bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">2 500+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">Ověřených specialistů</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">15 000+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">Spokojených zákazníků</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">98%</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">Úspěšnost zprostředkování</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 dark:bg-primary py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold">Jste specialista?</h2>
            <p className="mb-8 text-lg sm:text-xl">Získejte kvalitní leady a rozšiřte své podnikání</p>
            <Link href="/profi/registrace" className="inline-block rounded bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-blue-600 dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors">
              Začít zdarma na 14 dní
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 dark:bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold dark:text-foreground">tvujspecialista.cz</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Marketplace pro hledání ověřených specialistů</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">Pro zákazníky</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/hledat" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Hledat specialistu</Link></li>
                <li><Link href="/o-nas" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">O nás</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">Pro specialisty</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ceny" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Ceny</Link></li>
                <li><Link href="/profi/registrace" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Registrace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">Právní informace</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pravidla" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Pravidla</Link></li>
                <li><Link href="/ochrana-osobnich-udaju" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Ochrana údajů</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t dark:border-border pt-8 text-center text-sm text-gray-600 dark:text-muted-foreground">
            &copy; 2025 tvujspecialista.cz. Všechna práva vyhrazena.
          </div>
        </div>
      </footer>
    </div>
  );
}
