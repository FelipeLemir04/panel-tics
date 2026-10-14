import { Head, Link, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';

const temaOscuroGuardado = () => {
    try {
        return localStorage.getItem('theme') === 'dark';
    } catch {
        return false;
    }
};

export default function Edit() {
    const { auth } = usePage().props;

    return (
        <div className={temaOscuroGuardado() ? 'dark' : ''}>
            <Head title="Mi cuenta" />

            <div className="min-h-screen font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <header className="bg-[#002b49] dark:bg-slate-900 dark:border-b dark:border-slate-800">
                    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 sm:px-8 py-4">
                        <img src="/LOGOHU.png" alt="Hospital Universitario" className="h-9 w-auto object-contain filter brightness-0 invert" />
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-100/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Volver al dashboard
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 sm:px-8 py-8 space-y-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400">Mi cuenta</p>
                        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{auth.user.name}</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{auth.user.email}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
                        <UpdatePasswordForm className="max-w-md" />
                    </div>
                </main>
            </div>
        </div>
    );
}
