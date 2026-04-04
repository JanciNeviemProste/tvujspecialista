import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { PublicHeader } from '@/components/layout/PublicHeader';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms.metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <PublicHeader />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          Účinnost od: 1. 4. 2026 | Verze: 1.0
        </p>

        <div className="prose prose-gray max-w-none space-y-8">

          {/* 1 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">1. Úvodní ustanovení</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              1.1. Tyto obchodní podmínky (dále jen &quot;Podmínky&quot;) upravují vzájemná práva a povinnosti
              mezi provozovatelem platformy tvujspecialista.cz a jejími uživateli.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              1.2. Podmínky jsou vydány v souladu s § 1751 odst. 1 zákona č. 89/2012 Sb., občanský zákoník
              (dále jen &quot;OZ&quot;), a dalšími právními předpisy České republiky a Evropské unie.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              1.3. Registrací na platformě nebo využitím služeb uživatel potvrzuje, že se s těmito
              Podmínkami seznámil a souhlasí s nimi v plném rozsahu.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">2. Identifikace provozovatele</h2>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-1"><strong>Obchodní název:</strong> [DOPLŇTE — název společnosti nebo jméno podnikatele]</p>
              <p className="mb-1"><strong>IČO:</strong> [DOPLŇTE]</p>
              <p className="mb-1"><strong>Sídlo:</strong> [DOPLŇTE — ulice, město, PSČ]</p>
              <p className="mb-1"><strong>Zapsán v:</strong> [DOPLŇTE — obchodní rejstřík / živnostenský rejstřík]</p>
              <p className="mb-1"><strong>E-mail:</strong> info@tvujspecialista.cz</p>
              <p className="mb-1"><strong>Telefon:</strong> [DOPLŇTE]</p>
              <p><strong>Webové stránky:</strong> https://tvujspecialista.cz</p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">3. Vymezení pojmů</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Provozovatel:</strong> subjekt uvedený v čl. 2 provozující platformu tvujspecialista.cz.</li>
              <li><strong>Platforma:</strong> webová aplikace dostupná na adrese tvujspecialista.cz včetně všech podstránek a API.</li>
              <li><strong>Zákazník (spotřebitel):</strong> fyzická osoba hledající specialistu prostřednictvím Platformy za účelem, který nesouvisí s její podnikatelskou činností.</li>
              <li><strong>Specialista (poskytovatel):</strong> fyzická nebo právnická osoba — podnikatel — registrovaná na Platformě za účelem nabídky svých odborných služeb.</li>
              <li><strong>Uživatel:</strong> souhrnné označení pro Zákazníka i Specialistu.</li>
              <li><strong>Lead (poptávka):</strong> kontaktní údaje a požadavek Zákazníka předaný Specialistovi prostřednictvím Platformy.</li>
              <li><strong>Předplatné:</strong> placený tarif Specialisty umožňující přístup k rozšířeným funkcím Platformy.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">4. Předmět smlouvy</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              4.1. Provozovatel poskytuje Platformu jako technologického zprostředkovatele,
              který umožňuje Zákazníkům vyhledávat a kontaktovat Specialisty a Specialistům
              prezentovat své služby a získávat poptávky.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              4.2. Provozovatel není stranou jakéhokoli smluvního vztahu mezi Zákazníkem a Specialistou.
              Odpovědnost za kvalitu, rozsah a řádné poskytnutí odborných služeb nese výhradně Specialista.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              4.3. Provozovatel neposkytuje finanční poradenství, realitní služby ani jiné odborné služby.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">5. Uzavření smlouvy</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              5.1. Smlouva mezi Provozovatelem a Uživatelem je uzavřena okamžikem dokončení registrace
              na Platformě a potvrzení souhlasu s těmito Podmínkami.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              5.2. Smlouva je uzavřena na dobu neurčitou, není-li u placeného Předplatného
              stanoveno jinak.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              5.3. Uživatel je povinen při registraci poskytnout pravdivé, úplné a aktuální údaje
              a tyto průběžně aktualizovat.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">6. Práva a povinnosti Zákazníků</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              6.1. Zákazník má právo bezplatně procházet profily Specialistů, číst recenze
              a odesílat poptávky.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              6.2. Zákazník je povinen: (a) poskytovat pravdivé informace; (b) nepoužívat
              Platformu k rozesílání nevyžádaných obchodních sdělení; (c) respektovat práva
              ostatních Uživatelů.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              6.3. Zákazník nesmí zneužívat systém recenzí, zejména psát fiktivní nebo zavádějící hodnocení.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">7. Práva a povinnosti Specialistů</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              7.1. Specialista má právo prezentovat své služby prostřednictvím profilu,
              přijímat poptávky a využívat CRM nástroje Platformy.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              7.2. Specialista je povinen: (a) udržovat aktuální a pravdivý profil; (b) reagovat
              na poptávky v přiměřené lhůtě (doporučeno do 48 hodin); (c) disponovat příslušným
              oprávněním k podnikání (živnostenské oprávnění, licence ČNB apod.); (d) dodržovat
              platné právní předpisy ČR.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              7.3. Provozovatel si vyhrazuje právo pozastavit nebo zrušit profil Specialisty,
              který opakovaně porušuje tyto Podmínky nebo poškozuje dobré jméno Platformy.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">8. Platební podmínky a Předplatné</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              8.1. Základní profil Specialisty je bezplatný. Rozšířené funkce (prémiové leady,
              pokročilé analytiky, prioritní zobrazení) jsou dostupné v rámci placeného Předplatného.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              8.2. Ceny Předplatného jsou uvedeny na stránce{' '}
              <Link href="/ceny" className="text-blue-600 hover:underline">Ceník</Link>
              {' '}a jsou uvedeny včetně DPH, je-li Provozovatel plátcem DPH.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              8.3. Platba je realizována předem prostřednictvím platební brány Stripe.
              Předplatné se automaticky obnovuje na další období, pokud není zrušeno nejpozději
              24 hodin před koncem aktuálního období.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              8.4. Provozovatel vystaví daňový doklad (fakturu) v elektronické podobě do 15 dnů
              od přijetí platby.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">9. Odstoupení od smlouvy</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              9.1. Zákazník (spotřebitel) má právo odstoupit od smlouvy uzavřené distančním způsobem
              ve lhůtě 14 dnů ode dne uzavření smlouvy, a to bez udání důvodu (§ 1829 OZ).
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              9.2. Právo na odstoupení nelze uplatnit u služeb, které byly s výslovným souhlasem
              spotřebitele plně poskytnuty před uplynutím lhůty pro odstoupení (§ 1837 písm. a) OZ).
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              9.3. Pro odstoupení od smlouvy zašlete e-mail na adresu info@tvujspecialista.cz
              s jednoznačným prohlášením o odstoupení (jméno, e-mail, datum registrace).
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              9.4. V případě oprávněného odstoupení vrátí Provozovatel poměrnou část uhrazeného
              Předplatného do 14 dnů od doručení odstoupení, a to stejným způsobem, jakým byla
              platba přijata.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">10. Reklamace a odpovědnost za vady</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              10.1. Uživatel je oprávněn uplatnit reklamaci služeb Platformy zasláním
              e-mailu na info@tvujspecialista.cz s popisem vady.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              10.2. Provozovatel je povinen reklamaci vyřídit bez zbytečného odkladu, nejpozději
              do 30 dnů od jejího uplatnění, není-li dohodnuta lhůta delší.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              10.3. Provozovatel neodpovídá za kvalitu, dostupnost ani výsledky odborných služeb
              poskytovaných Specialisty. Odpovědnost za vady služeb Specialistů nese výhradně
              příslušný Specialista.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">11. Omezení odpovědnosti</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              11.1. Provozovatel odpovídá pouze za škodu způsobenou úmyslně nebo z hrubé
              nedbalosti. Celková výše náhrady škody je omezena na výši úhrad zaplacených
              Uživatelem Provozovateli za posledních 12 měsíců.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              11.2. Provozovatel neodpovídá za: (a) obsah profilů Specialistů; (b) pravdivost
              informací poskytnutých Uživateli; (c) výpadky služby způsobené vyšší mocí,
              údržbou nebo třetími stranami; (d) ušlý zisk nebo nepřímé škody.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              11.3. Provozovatel vynaloží přiměřené úsilí k zajištění dostupnosti Platformy,
              nezaručuje však nepřetržitý provoz.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">12. Duševní vlastnictví</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              12.1. Veškerý obsah Platformy (grafika, texty, zdrojový kód, databáze, ochranné
              známky) je chráněn autorskými právy Provozovatele a dalšími právy duševního
              vlastnictví dle zákona č. 121/2000 Sb. (autorský zákon).
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              12.2. Uživatel uděluje Provozovateli nevýhradní, bezúplatnou licenci k užití obsahu,
              který na Platformu nahraje (texty profilu, fotografie, recenze), za účelem
              provozování a propagace Platformy.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">13. Zakázané jednání</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Poskytování nepravdivých nebo zavádějících informací</li>
              <li>Rozesílání nevyžádaných obchodních sdělení (spam)</li>
              <li>Pokusy o neoprávněný přístup k systémům Platformy</li>
              <li>Automatizované stahování obsahu (scraping) bez písemného souhlasu</li>
              <li>Zneužívání systému recenzí (falešné recenze, manipulace s hodnocením)</li>
              <li>Obcházení platebních mechanismů Platformy</li>
              <li>Jakékoli jednání v rozporu s právními předpisy ČR a EU</li>
            </ul>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">14. Ukončení smlouvy</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              14.1. Uživatel může smlouvu kdykoli ukončit zrušením svého účtu v nastavení
              profilu nebo zasláním žádosti na info@tvujspecialista.cz.
            </p>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              14.2. Provozovatel může smlouvu ukončit nebo pozastavit účet Uživatele v případě
              závažného nebo opakovaného porušení těchto Podmínek, a to i bez předchozího upozornění.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              14.3. Při zrušení placeného Předplatného v průběhu období nevzniká nárok na vrácení
              poměrné části, pokud Specialista aktivně využíval služby Platformy.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">15. Ochrana osobních údajů</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Zpracování osobních údajů se řídí samostatným dokumentem{' '}
              <Link href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">
                Zásady ochrany osobních údajů
              </Link>
              , který je nedílnou součástí těchto Podmínek.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">16. Mimosoudní řešení sporů</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              16.1. K mimosoudnímu řešení spotřebitelských sporů je příslušná{' '}
              <strong>Česká obchodní inspekce</strong> (ČOI), se sídlem Štěpánská 567/15,
              120 00 Praha 2, IČO: 000 20 869, web:{' '}
              <a href="https://www.coi.cz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                www.coi.cz
              </a>.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              16.2. Pro řešení sporů online je k dispozici platforma ODR Evropské komise:{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">17. Rozhodné právo a jurisdikce</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              17.1. Tyto Podmínky se řídí právním řádem České republiky, zejména zákonem
              č. 89/2012 Sb. (občanský zákoník) a zákonem č. 634/1992 Sb. (o ochraně spotřebitele).
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              17.2. Spory, které nelze vyřešit mimosoudně, budou rozhodovány příslušnými soudy
              České republiky.
            </p>
          </section>

          {/* 18 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">18. Změny Podmínek</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              18.1. Provozovatel si vyhrazuje právo tyto Podmínky kdykoli změnit. O podstatných
              změnách bude Uživatel informován e-mailem nebo oznámením na Platformě nejméně
              30 dnů před nabytím účinnosti změn.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              18.2. Pokud Uživatel se změnami nesouhlasí, má právo smlouvu vypovědět před
              nabytím účinnosti změn.
            </p>
          </section>

          {/* 19 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">19. Oddělitelnost a závěrečná ustanovení</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              19.1. Pokud bude jakékoli ustanovení těchto Podmínek shledáno neplatným nebo
              nevymahatelným, ostatní ustanovení zůstávají v platnosti.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              19.2. Tyto Podmínky nabývají účinnosti dnem 1. 4. 2026 a nahrazují veškeré předchozí verze.
            </p>
          </section>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Poslední aktualizace: 1. 4. 2026 | Verze 1.0
          </p>
        </div>
      </div>
    </div>
  );
}
