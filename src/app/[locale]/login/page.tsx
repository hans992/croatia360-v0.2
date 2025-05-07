// src/app/[locale]/login/page.tsx
'use client';
import { useState, FormEvent } from 'react'; // Uklonjen React jer se ne koristi direktno
import { supabase } from '@/lib/supabaseClient'; // Provjerite putanju
import { useTranslation } from 'react-i18next'; // Import za i18n
import { defaultNS } from '@/lib/i18n/settings'; // Za default namespace
import { Button } from '@/components/ui/button';
// Pretpostavljam da ćete htjeti koristiti Link za povratak na početnu ili druge stranice
// import Link from 'next/link'; 
// import { type Locale } from '@/lib/i18n/settings'; // Ako trebate Locale tip

type FormState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string; // format: YYYY-MM-DD
  error: string;
  loading: boolean;
};

// interface LoginPageProps { // Ako stranica prima params, npr. locale
//   params: { locale: Locale };
// }

// export default function LoginPage({ params: { locale } }: LoginPageProps) { // Ako primate locale
export default function LoginPage() {
  const { t } = useTranslation(defaultNS); // Inicijalizacija i18n

  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    error: '',
    loading: false,
  });

  function getAge(dateString: string) {
    if (!dateString) return 0; // Provjera za prazan string
    const today = new Date();
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return 0; // Provjera za neispravan datum

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => { // Tipiziran event
    e.preventDefault();
    setForm(f => ({ ...f, error: '', loading: true }));

    if (!form.firstName || !form.lastName || !form.birthDate || !form.email || !form.password) {
      setForm(f => ({ ...f, error: t('login_error_all_fields_required'), loading: false }));
      return;
    }
    if (getAge(form.birthDate) < 18) {
      setForm(f => ({ ...f, error: t('login_error_age_restriction'), loading: false }));
      return;
    }

    // Supabase signup s dodatnim podacima
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _data, error } = await supabase.auth.signUp({ // data je prefiksiran s _ jer se ne koristi
      email: form.email,
      password: form.password,
      options: {
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          birthDate: form.birthDate,
          // Možete dodati i 'full_name' ako ga vaš Supabase trigger očekuje
          // full_name: `${form.firstName} ${form.lastName}`
        }
      }
    });

    if (error) {
      setForm(f => ({ ...f, error: error.message, loading: false }));
    } else {
      setForm(f => ({ ...f, error: '', loading: false }));
      // Bolje je koristiti neku notifikaciju umjesto alert-a
      alert(t('login_signup_success_check_email'));
      // Ovdje možete preusmjeriti korisnika, npr. router.push(`/${locale}/`)
    }
  };

  const handleGoogle = async () => {
    setForm(f => ({ ...f, error: '', loading: true }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo bi trebao biti apsolutni URL
        // redirectTo: `${window.location.origin}/${locale}/auth/callback`, // Primjer
      }
    });
    if (error) setForm(f => ({ ...f, error: error.message, loading: false }));
    // Uspješan OAuth će preusmjeriti korisnika, pa loading: false možda nije ni potrebno ovdje
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-card text-card-foreground rounded-lg shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-center text-primary">
          {t('login_page_title')}
        </h1>
        <button
          onClick={handleGoogle}
          className="w-full mb-6 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-semibold transition-colors disabled:opacity-70"
          disabled={form.loading}
        >
          {t('login_google_button')}
        </button>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t('login_or_divider')}
            </span>
          </div>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder={t('login_placeholder_firstname')!} // Dodan ! da se izbjegne string | undefined
            className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            required
            disabled={form.loading}
          />
          <input
            type="text"
            placeholder={t('login_placeholder_lastname')!}
            className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            required
            disabled={form.loading}
          />
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-muted-foreground mb-1">
              {t('login_label_birthdate')}
            </label>
            <input
              id="birthDate"
              type="date"
              className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.birthDate}
              onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
              required
              disabled={form.loading}
            />
          </div>
          <input
            type="email"
            placeholder={t('login_placeholder_email')!}
            className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            disabled={form.loading}
          />
          <input
            type="password"
            placeholder={t('login_placeholder_password')!}
            className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            disabled={form.loading}
          />
          <Button // Korištenje shadcn/ui Button komponente
            type="submit"
            className="w-full" // Uklonjene specifične boje, oslanja se na default variant
            disabled={form.loading}
          >
            {form.loading ? t('login_button_registering') : t('login_button_register')}
          </Button>
        </form>
        {form.error && <div className="mt-4 text-sm text-destructive text-center">{form.error}</div>}
        {/* Dodajte link za povratak ako je potrebno */}
        {/* <div className="mt-6 text-center">
          <Link href={`/${locale}/`} className="text-sm text-primary hover:underline">
            {t('login_back_to_home')}
          </Link>
        </div> */}
      </div>
    </main>
  );
}
