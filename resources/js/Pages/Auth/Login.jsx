import { Head, useForm } from '@inertiajs/react';

const temaOscuroGuardado = () => {
    try {
        return localStorage.getItem('theme') === 'dark';
    } catch {
        return false;
    }
};

const claseCampo = 'block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className={temaOscuroGuardado() ? 'dark' : ''}>
            <Head title="Iniciar sesión" />

            <div className="flex min-h-screen font-sans">
                {/* Panel de marca */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#002b49] p-12 text-white">
                    <img
                        src="/LOGOHU.png"
                        alt="Hospital Universitario"
                        className="h-14 w-auto self-start object-contain filter brightness-0 invert"
                    />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200/70">TICS · Informática</p>
                        <h1 className="mt-3 text-4xl font-bold leading-tight">Panel de métricas<br />de tickets</h1>
                        <p className="mt-4 max-w-md text-blue-100/70">
                            Seguimiento de incidencias, carga de trabajo y estado de las solicitudes del departamento.
                        </p>
                    </div>
                    <p className="text-xs text-blue-200/50">Acceso restringido a personal autorizado.</p>
                </div>

                {/* Formulario */}
                <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
                    <div className="w-full max-w-sm">
                        <div className="lg:hidden mb-8 flex justify-center">
                            <div className="rounded-2xl bg-[#002b49] px-6 py-4">
                                <img src="/LOGOHU.png" alt="Hospital Universitario" className="h-10 w-auto object-contain filter brightness-0 invert" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Iniciar sesión</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ingresa con tu correo y contraseña.</p>

                        {status && (
                            <div className="mt-6 rounded-lg bg-green-50 dark:bg-green-500/10 px-4 py-3 text-sm font-medium text-green-700 dark:text-green-400">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Correo electrónico</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={claseCampo}
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contraseña</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={claseCampo}
                                />
                                {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-blue-600 shadow-sm focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Mantener sesión iniciada</span>
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-[#002b49] dark:bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#003b63] dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 disabled:opacity-60 transition-colors"
                            >
                                {processing ? 'Ingresando…' : 'Ingresar'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
                            ¿Olvidaste tu contraseña? Contacta al administrador del panel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
