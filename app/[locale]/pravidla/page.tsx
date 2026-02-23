import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obchodní podmínky | TvůjSpecialista.cz',
  description: 'Obchodní podmínky platformy TvůjSpecialista.cz. Práva a povinnosti zákazníků, poskytovatelů a provozovatele služby.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Obchodní podmínky</h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Úvodní ustanovení</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Tyto obchodní podmínky upravují vztahy mezi provozovatelem platformy
              tvujspecialista.cz a uživateli služby.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Vymezení pojmů</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Provozovatel:</strong> společnost provozující platformu tvujspecialista.cz
              </li>
              <li>
                <strong>Zákazník:</strong> osoba hledající specialistu prostřednictvím platformy
              </li>
              <li>
                <strong>Poskytovatel:</strong> ověřený specialista registrovaný na platformě
              </li>
              <li>
                <strong>Lead:</strong> poptávka od zákazníka směřovaná k poskytovateli
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. Práva a povinnosti zákazníků
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Zákazník má právo bezplatně procházet profily specialistů a odesílat poptávky.
              Zákazník je povinen poskytovat pravdivé a aktuální informace.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. Práva a povinnosti poskytovatelů
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Poskytovatel má právo prezentovat své služby a získávat leady od zákazníků.
              Poskytovatel je povinen udržovat aktuální a pravdivý profil a reagovat na
              poptávky v přiměřené době.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Platební podmínky</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Poskytovatelé platí měsíční poplatek podle zvoleného tarifu. Platba je splatná
              předem. Zkušební doba je 14 dní zdarma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Ochrana osobních údajů</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Zpracování osobních údajů se řídí samostatným dokumentem{' '}
              <Link href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">
                Ochrana osobních údajů
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Závěrečná ustanovení</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Provozovatel si vyhrazuje právo tyto podmínky kdykoli změnit. Změny nabývají
              účinnosti okamžikem zveřejnění na webových stránkách.
            </p>
          </section>

          <p className="mt-8 text-sm text-gray-500">
            Poslední aktualizace: {new Date().toLocaleDateString('cs-CZ')}
          </p>
        </div>
      </div>
    </div>
  )
}
