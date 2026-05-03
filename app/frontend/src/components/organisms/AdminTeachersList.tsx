import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

type TeacherRow = {
  id: string;
  name_ar: string;
  name_de: string;
  subjects: string[];
  price_per_hour: number;
  years_of_experience: number;
  image_url: string;
  created_at: string;
};

type NewTeacherForm = {
  name_ar: string;
  name_de: string;
  subjects: string;
  price_per_hour: string;
  years_of_experience: string;
  image_url: string;
};

const defaultFormState: NewTeacherForm = {
  name_ar: '',
  name_de: '',
  subjects: '',
  price_per_hour: '',
  years_of_experience: '',
  image_url: '',
};

export default function AdminTeachersList() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [form, setForm] = useState<NewTeacherForm>(defaultFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from<TeacherRow>('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setTeachers([]);
    } else {
      setTeachers(data ?? []);
    }

    setLoading(false);
  }

  async function handleAddTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const subjectsArray = form.subjects
      .split(',')
      .map((subject) => subject.trim())
      .filter(Boolean);

    const newTeacher = {
      name_ar: form.name_ar,
      name_de: form.name_de,
      subjects: subjectsArray,
      price_per_hour: Number(form.price_per_hour),
      years_of_experience: Number(form.years_of_experience),
      image_url: form.image_url,
    };

    const { error } = await supabase.from('teachers').insert([newTeacher]);

    if (error) {
      setError(error.message);
    } else {
      setForm(defaultFormState);
      await fetchTeachers();
    }

    setLoading(false);
  }

  async function handleDeleteTeacher(id: string) {
    setError(null);
    setLoading(true);

    const { error } = await supabase.from('teachers').delete().eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      await fetchTeachers();
    }

    setLoading(false);
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Admin Teachers</h2>
          <p className="mt-2 text-sm text-slate-600">Add new teachers and remove existing ones from Supabase.</p>
        </div>

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleAddTeacher}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name (Arabic)</span>
            <input
              value={form.name_ar}
              onChange={(event) => setForm({ ...form, name_ar: event.target.value })}
              placeholder="مثال: الأستاذة فاطمة علي"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name (German)</span>
            <input
              value={form.name_de}
              onChange={(event) => setForm({ ...form, name_de: event.target.value })}
              placeholder="Example: Fatima Ali"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Subjects</span>
            <input
              value={form.subjects}
              onChange={(event) => setForm({ ...form, subjects: event.target.value })}
              placeholder="Quran, Tajweed, Arabic Grammar"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">Separate subjects with commas.</p>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Price per hour</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.price_per_hour}
              onChange={(event) => setForm({ ...form, price_per_hour: event.target.value })}
              placeholder="25"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Years of experience</span>
            <input
              type="number"
              min="0"
              value={form.years_of_experience}
              onChange={(event) => setForm({ ...form, years_of_experience: event.target.value })}
              placeholder="10"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Image URL</span>
            <input
              value={form.image_url}
              onChange={(event) => setForm({ ...form, image_url: event.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1 block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
            />
          </label>

          <div className="sm:col-span-2 flex items-center justify-between gap-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Add Teacher'}
            </button>
            <p className="text-sm text-slate-500">You can remove any teacher using the delete action below.</p>
          </div>
        </form>

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Teacher records</h3>
          <span className="text-sm text-slate-500">{teachers.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Name (AR)</th>
                <th className="px-4 py-3 font-medium">Name (DE)</th>
                <th className="px-4 py-3 font-medium">Subjects</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Experience</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading && teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">Loading teacher records...</td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">No teachers found yet.</td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 align-top text-slate-800">{teacher.name_ar}</td>
                    <td className="px-4 py-4 align-top text-slate-800">{teacher.name_de}</td>
                    <td className="px-4 py-4 align-top text-slate-600">{teacher.subjects.join(', ')}</td>
                    <td className="px-4 py-4 align-top text-slate-800">${teacher.price_per_hour.toFixed(2)}</td>
                    <td className="px-4 py-4 align-top text-slate-800">{teacher.years_of_experience} yrs</td>
                    <td className="px-4 py-4 align-top">
                      <button
                        type="button"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
