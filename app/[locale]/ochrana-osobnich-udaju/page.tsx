import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/PublicHeader';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy.metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <PublicHeader />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          Účinnost od: 1. 4. 2026 | Verze: 1.0 | Zpracováno v souladu s Nařízením EU 2016/679 (GDPR)
          a zákonem č. 110/2019 Sb.
        </p>

        <div className="prose prose-gray max-w-none space-y-8">

          {/* 1 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">1. Správce osobních údajů</h2>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-1"><strong>Obchodní název:</strong> [DOPLŇTE — název společnosti nebo jméno podnikatele]</p>
              <p className="mb-1"><strong>IČO:</strong> [DOPLŇTE]</p>
              <p className="mb-1"><strong>Sídlo:</strong> [DOPLŇTE — ulice, město, PSČ]</p>
              <p className="mb-1"><strong>E-mail pro GDPR:</strong> gdpr@tvujspecialista.cz</p>
              <p className="mb-1"><strong>Telefon:</strong> [DOPLŇTE]</p>
              <p><strong>Pověřenec pro ochranu osobních údajů (DPO):</strong> [DOPLŇTE — pokud je jmenován, jinak uveďte &quot;nebyl jmenován&quot;]</p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">2. Kategorie zpracovávaných osobních údajů</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Zpracováváme následující kategorie osobních údajů podle typu uživatele:
            </p>

            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">2.1. Zákazníci (spotřebitelé)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-4">
              <li>Identifikační údaje: jméno, příjmení</li>
              <li>Kontaktní údaje: e-mail, telefon</li>
              <li>Údaje o poptávkách: obsah poptávky, vybraný specialista</li>
              <li>Recenze a hodnocení</li>
              <li>Technické údaje: IP adresa, typ prohlížeče, operační systém, cookies</li>
            </ul>

            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">2.2. Specialisté (podnikatelé)</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-4">
              <li>Identifikační údaje: jméno, příjmení, IČO (pokud je uvedeno)</li>
              <li>Kontaktní údaje: e-mail, telefon, adresa</li>
              <li>Profesní údaje: kategorie, certifikace, vzdělání, délka praxe, služby</li>
              <li>Profilové údaje: fotografie, bio, dostupnost, regiony působnosti</li>
              <li>Finanční údaje: údaje o platbách (zpracovává Stripe — viz čl. 5)</li>
              <li>Údaje o aktivitě: přijaté leady, recenze, statistiky profilu</li>
              <li>Technické údaje: IP adresa, přihlašovací historie, typ zařízení</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">3. Účely a právní základy zpracování</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Účel zpracování</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Právní základ (čl. 6 GDPR)</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Doba uchování</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Registrace a správa účtu</td>
                    <td className="p-3">Plnění smlouvy — čl. 6(1)(b)</td>
                    <td className="p-3">Po dobu trvání účtu</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Zprostředkování poptávek (leadů)</td>
                    <td className="p-3">Plnění smlouvy — čl. 6(1)(b)</td>
                    <td className="p-3">Po dobu trvání účtu + 1 rok</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Zpracování plateb a fakturace</td>
                    <td className="p-3">Plnění smlouvy — čl. 6(1)(b)<br/>Právní povinnost — čl. 6(1)(c)</td>
                    <td className="p-3">10 let (zákon o účetnictví, § 31)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Zasílání transakčních e-mailů (potvrzení, notifikace)</td>
                    <td className="p-3">Plnění smlouvy — čl. 6(1)(b)</td>
                    <td className="p-3">Po dobu trvání účtu</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Analytika a zlepšování služeb</td>
                    <td className="p-3">Oprávněný zájem — čl. 6(1)(f)</td>
                    <td className="p-3">26 měsíců (Google Analytics)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Monitoring chyb a bezpečnosti</td>
                    <td className="p-3">Oprávněný zájem — čl. 6(1)(f)</td>
                    <td className="p-3">90 dnů (Sentry)</td>
                  </tr>
                  <tr>
                    <td className="p-3">Prevence podvodů a zneužití</td>
                    <td className="p-3">Oprávněný zájem — čl. 6(1)(f)</td>
                    <td className="p-3">1 rok</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">4. Zdroje osobních údajů</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Osobní údaje získáváme přímo od subjektů údajů (registrace, vyplnění formuláře,
              odeslaní poptávky). Údaje nezískáváme ze zdrojů třetích stran.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">5. Příjemci osobních údajů (zpracovatelé)</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Osobní údaje sdílíme s následujícími třetími stranami, které je zpracovávají
              na základě smluv o zpracování (čl. 28 GDPR):
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Zpracovatel</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Účel</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Sídlo</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Záruky</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Stripe, Inc.</td>
                    <td className="p-3">Zpracování plateb</td>
                    <td className="p-3">USA</td>
                    <td className="p-3">EU-US DPF</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Cloudinary Ltd.</td>
                    <td className="p-3">Ukládání obrázků a médií</td>
                    <td className="p-3">Izrael / USA</td>
                    <td className="p-3">SCC (standardní smluvní doložky)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Resend, Inc.</td>
                    <td className="p-3">Zasílání e-mailů</td>
                    <td className="p-3">USA</td>
                    <td className="p-3">SCC</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Functional Software (Sentry)</td>
                    <td className="p-3">Monitoring chyb</td>
                    <td className="p-3">USA</td>
                    <td className="p-3">SCC + DPA</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Google LLC (Analytics)</td>
                    <td className="p-3">Webová analytika</td>
                    <td className="p-3">USA</td>
                    <td className="p-3">EU-US DPF</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Vercel, Inc.</td>
                    <td className="p-3">Hosting frontendu</td>
                    <td className="p-3">USA</td>
                    <td className="p-3">SCC + DPA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Railway Corp.</td>
                    <td className="p-3">Hosting backendu a databáze</td>
                    <td className="p-3">USA</td>
                    <td className="p-3">SCC</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Dále sdílíme kontaktní údaje Zákazníků (jméno, e-mail, telefon, obsah poptávky)
              s příslušným Specialistou v rámci zprostředkování poptávky — tento přenos je
              nezbytný pro plnění smlouvy.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">6. Předávání údajů do třetích zemí</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              Některé z výše uvedených zpracovatelů sídlí v USA. Předávání osobních údajů
              do USA probíhá na základě:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li><strong>EU-US Data Privacy Framework (DPF)</strong> — pro zpracovatele certifikované v rámci DPF (Stripe, Google)</li>
              <li><strong>Standardní smluvní doložky (SCC)</strong> dle rozhodnutí Komise EU 2021/914 — pro ostatní zpracovatele</li>
            </ul>
            <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              Kopie příslušných záruk jsou k dispozici na vyžádání na adrese gdpr@tvujspecialista.cz.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">7. Doba uchování osobních údajů</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Údaje uživatelského účtu:</strong> po dobu trvání účtu + 30 dnů na zálohách</li>
              <li><strong>Údaje o poptávkách (leadech):</strong> po dobu trvání účtu + 1 rok</li>
              <li><strong>Účetní a fakturační údaje:</strong> 10 let od konce účetního období (zákon č. 563/1991 Sb.)</li>
              <li><strong>Recenze:</strong> po dobu existence profilu Specialisty</li>
              <li><strong>Analytická data (Google Analytics):</strong> 26 měsíců</li>
              <li><strong>Logy chyb (Sentry):</strong> 90 dnů</li>
              <li><strong>Cookies:</strong> viz čl. 9</li>
            </ul>
            <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              Po uplynutí doby uchování jsou údaje bezpečně smazány nebo anonymizovány.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">8. Vaše práva jako subjektu údajů</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              V souladu s GDPR (čl. 15–22) máte následující práva:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Právo na přístup (čl. 15):</strong> získat potvrzení, zda zpracováváme vaše údaje, a kopii těchto údajů</li>
              <li><strong>Právo na opravu (čl. 16):</strong> požádat o opravu nepřesných nebo doplnění neúplných údajů</li>
              <li><strong>Právo na výmaz (čl. 17):</strong> požádat o smazání údajů (&quot;právo být zapomenut&quot;), pokud pro zpracování neexistuje právní důvod</li>
              <li><strong>Právo na omezení zpracování (čl. 18):</strong> požádat o dočasné omezení zpracování v definovaných případech</li>
              <li><strong>Právo na přenositelnost (čl. 20):</strong> získat údaje ve strukturovaném, strojově čitelném formátu (JSON/CSV)</li>
              <li><strong>Právo vznést námitku (čl. 21):</strong> vznést námitku proti zpracování na základě oprávněného zájmu</li>
              <li><strong>Právo odvolat souhlas:</strong> pokud je zpracování založeno na souhlasu, můžete jej kdykoli odvolat bez dopadu na zákonnost dřívějšího zpracování</li>
              <li><strong>Právo nebýt předmětem automatizovaného rozhodování (čl. 22):</strong> viz čl. 10</li>
            </ul>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Pro uplatnění svých práv nás kontaktujte na{' '}
              <a href="mailto:gdpr@tvujspecialista.cz" className="text-blue-600 hover:underline">gdpr@tvujspecialista.cz</a>.
              Na vaši žádost odpovíme bez zbytečného odkladu, nejpozději do 30 dnů.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">9. Cookies a sledovací technologie</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Používáme následující kategorie cookies v souladu se zákonem č. 127/2005 Sb.
              (o elektronických komunikacích) a směrnicí ePrivacy (2002/58/EC):
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Kategorie</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Příklady</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Účel</th>
                    <th className="p-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Expirace</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Nezbytné</td>
                    <td className="p-3">session token, CSRF, cookie_consent</td>
                    <td className="p-3">Přihlášení, bezpečnost, preference cookies</td>
                    <td className="p-3">Relace / 1 rok</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Funkční</td>
                    <td className="p-3">locale, theme</td>
                    <td className="p-3">Jazyk, tmavý/světlý režim</td>
                    <td className="p-3">1 rok</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-medium">Analytické</td>
                    <td className="p-3">_ga, _gid (Google Analytics)</td>
                    <td className="p-3">Statistika návštěvnosti</td>
                    <td className="p-3">26 měsíců / 24 hodin</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Třetích stran</td>
                    <td className="p-3">__stripe_mid, __stripe_sid</td>
                    <td className="p-3">Platební brána Stripe</td>
                    <td className="p-3">1 rok / 30 minut</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Analytické cookies a cookies třetích stran ukládáme pouze s vaším výslovným
              souhlasem. Souhlas můžete kdykoli odvolat prostřednictvím cookie banneru
              na našich stránkách nebo v nastavení prohlížeče.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">10. Automatizované rozhodování a profilování</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Platforma provádí automatizované řazení profilů Specialistů ve výsledcích vyhledávání
              na základě hodnocení, počtu recenzí, úplnosti profilu a typu Předplatného.
              Toto řazení nepředstavuje automatizované rozhodování s právními účinky ve smyslu
              čl. 22 GDPR. Proti řazení profilu můžete podat námitku na gdpr@tvujspecialista.cz.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">11. Zabezpečení osobních údajů</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              Přijali jsme přiměřená technická a organizační opatření k ochraně osobních údajů
              v souladu s čl. 32 GDPR, zejména:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Šifrování přenosu dat (TLS/HTTPS)</li>
              <li>Hashování hesel (bcrypt)</li>
              <li>Přístup k údajům na principu minimálních oprávnění</li>
              <li>JWT autentizace s krátkodobými tokeny (15 min) a refresh tokeny (7 dní)</li>
              <li>Rate limiting API (60 req/min)</li>
              <li>Monitoring bezpečnostních incidentů (Sentry)</li>
              <li>Pravidelné zálohy databáze s šifrováním</li>
              <li>Content Security Policy (CSP) hlavičky</li>
            </ul>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">12. Povinnost poskytnout osobní údaje</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Poskytnutí osobních údajů pro registraci (jméno, e-mail, heslo) je smluvním
              požadavkem nezbytným pro vytvoření účtu. Bez těchto údajů nelze službu poskytnout.
              Poskytnutí dalších údajů (bio, fotografie, certifikace) je dobrovolné a slouží
              ke zlepšení kvality profilu.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">13. Právo podat stížnost</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              Pokud se domníváte, že zpracování vašich osobních údajů je v rozporu s GDPR,
              máte právo podat stížnost u dozorového úřadu:
            </p>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 text-gray-700 dark:text-gray-300">
              <p className="mb-1"><strong>Úřad pro ochranu osobních údajů (ÚOOÚ)</strong></p>
              <p className="mb-1">Pplk. Sochora 27, 170 00 Praha 7</p>
              <p className="mb-1">Tel.: +420 234 665 111</p>
              <p className="mb-1">
                Web:{' '}
                <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.uoou.cz
                </a>
              </p>
              <p>
                E-mail:{' '}
                <a href="mailto:posta@uoou.cz" className="text-blue-600 hover:underline">posta@uoou.cz</a>
              </p>
            </div>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">14. Změny těchto zásad</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Tyto zásady můžeme aktualizovat v reakci na změny legislativy nebo našich služeb.
              O podstatných změnách vás budeme informovat e-mailem nebo oznámením na Platformě
              nejméně 30 dnů předem. Aktuální verze je vždy dostupná na této stránce.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">15. Kontakt</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Pro jakékoli dotazy, žádosti o uplatnění práv nebo stížnosti ohledně zpracování
              osobních údajů nás kontaktujte na:{' '}
              <a href="mailto:gdpr@tvujspecialista.cz" className="text-blue-600 hover:underline">gdpr@tvujspecialista.cz</a>
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
