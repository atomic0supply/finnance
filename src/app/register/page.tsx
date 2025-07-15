'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/ToastProvider';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      addToast('Cuenta creada con éxito');
      setForm({ name: '', email: '' });
    } catch {
      addToast('Error al crear la cuenta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Crear Cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-2" aria-label="Crear cuenta">
        <label className="block">
          <span className="sr-only">Nombre</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="border p-2 w-full"
            required
          />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Spinner className="h-4 w-4" /> : 'Crear'}
        </button>
      </form>
    </div>
  );
}
