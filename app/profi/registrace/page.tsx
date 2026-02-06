'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import type { SpecialistCategory } from '@/types/specialist';
import { getErrorMessage } from '@/lib/utils/error';

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    location: '',
    yearsExperience: '',
    bio: '',
    termsAccepted: false,
    gdprAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Hesla se neshodují');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků');
      setIsLoading(false);
      return;
    }

    if (!formData.termsAccepted || !formData.gdprAccepted) {
      setError('Musíte souhlasit s obchodními podmínkami a zpracováním osobních údajů');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        category: formData.category as SpecialistCategory,
        location: formData.location,
        yearsExperience: parseInt(formData.yearsExperience),
        bio: formData.bio,
      });

      // Save tokens to localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // Redirect to dashboard
      router.push('/profi/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-4">
            <a href="/hledat" className="text-sm font-medium hover:text-blue-600">
              Hledat
            </a>
            <a href="/profi/prihlaseni" className="text-sm font-medium text-blue-600">
              Přihlášení
            </a>
          </nav>
        </div>
      </header>

      {/* Registration Form */}
      <div className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Staňte se naším specialistou</h1>
            <p className="text-gray-600">Získejte kvalitní leady a rozšiřte své podnikání</p>
          </div>

          <div className="rounded-lg border bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Personal Info */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Osobní údaje</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jan Novák"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jan@example.cz"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+420 777 123 456"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="border-t pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Profesní informace</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Kategorie *
                      </label>
                      <select
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Vyberte kategorii</option>
                        <option value="Finanční poradce">Finanční poradce</option>
                        <option value="Realitní makléř">Realitní makléř</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Lokalita *
                      </label>
                      <select
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      >
                        <option value="">Vyberte lokalitu</option>
                        <option value="Praha">Praha</option>
                        <option value="Brno">Brno</option>
                        <option value="Ostrava">Ostrava</option>
                        <option value="Plzeň">Plzeň</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Roky praxe *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="např. 5"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.yearsExperience}
                      onChange={(e) =>
                        setFormData({ ...formData, yearsExperience: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Krátký popis vašich služeb *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Popište, čím se zabýváte a jak můžete pomoci klientům..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="border-t pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Nastavení hesla</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Heslo *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimálně 8 znaků"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Potvrzení hesla *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Zadejte heslo znovu"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="border-t pt-6">
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                      checked={formData.termsAccepted}
                      onChange={(e) =>
                        setFormData({ ...formData, termsAccepted: e.target.checked })
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Souhlasím s{' '}
                      <a href="/pravidla" className="text-blue-600 hover:underline">
                        obchodními podmínkami
                      </a>{' '}
                      *
                    </span>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
                      checked={formData.gdprAccepted}
                      onChange={(e) =>
                        setFormData({ ...formData, gdprAccepted: e.target.checked })
                      }
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Souhlasím se{' '}
                      <a href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">
                        zpracováním osobních údajů
                      </a>{' '}
                      *
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Registruji...' : 'Zaregistrovat se zdarma'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Již máte účet?{' '}
                <a href="/profi/prihlaseni" className="font-medium text-blue-600 hover:underline">
                  Přihlaste se
                </a>
              </p>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">✓</div>
              <h3 className="mb-1 font-semibold text-gray-900">Kvalitní leady</h3>
              <p className="text-sm text-gray-600">Kontakty od skutečně zajímavých klientů</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">⭐</div>
              <h3 className="mb-1 font-semibold text-gray-900">Ověřený profil</h3>
              <p className="text-sm text-gray-600">Zvyšte důvěryhodnost vašich služeb</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">📊</div>
              <h3 className="mb-1 font-semibold text-gray-900">14 dní zdarma</h3>
              <p className="text-sm text-gray-600">Vyzkoušejte bez závazků</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
