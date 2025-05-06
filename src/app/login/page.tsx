'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type FormState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string; // format: YYYY-MM-DD
  error: string;
  loading: boolean;
};

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    error: '',
    loading: false,
  });

  // Helper za izračun godina
  function getAge(dateString: string) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Ručna registracija
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm(f => ({ ...f, error: '', loading: true }));

    // Validacija
    if (!form.firstName || !form.lastName || !form.birthDate) {
      setForm(f => ({ ...f, error: 'Sva polja su obavezna.', loading: false }));
      return;
    }
    if (getAge(form.birthDate) < 18) {
      setForm(f => ({ ...f, error: 'Morate imati najmanje 18 godina za registraciju.', loading: false }));
      return;
    }

    // Supabase signup s dodatnim podacima
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          birthDate: form.birthDate,
        }
      }
    });

    if (error) {
      setForm(f => ({ ...f, error: error.message, loading: false }));
    } else {
      // Dodaj korisnika u vlastitu tablicu (npr. profiles)
      // await supabase.from('profiles').insert({ ... })
      setForm(f => ({ ...f, error: '', loading: false }));
      alert('Registracija uspješna! Provjerite email za potvrdu.');
    }
  };

  // Google login
  const handleGoogle = async () => {
    setForm(f => ({ ...f, error: '', loading: true }));
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo: window.location.origin + '/complete-profile', // vidi napomenu dolje
      }
    });
    if (error) setForm(f => ({ ...f, error: error.message, loading: false }));
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="mb-6 text-2xl font-bold text-center">Prijava ili registracija</h1>
        <button
          onClick={handleGoogle}
          className="w-full mb-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          disabled={form.loading}
        >
          Prijava putem Googlea
        </button>
        <div className="text-center text-gray-500 mb-4">ili</div>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Ime"
            className="w-full border px-3 py-2 rounded"
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Prezime"
            className="w-full border px-3 py-2 rounded"
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            required
          />
          <label className="block text-sm text-gray-700">Datum rođenja</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={form.birthDate}
            onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Lozinka"
            className="w-full border px-3 py-2 rounded"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={form.loading}
          >
            Registracija
          </button>
        </form>
        {form.error && <div className="mt-4 text-red-600 text-center">{form.error}</div>}
      </div>
    </main>
  );
}
