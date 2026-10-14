import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

const claseCampo = 'block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500';
const claseEtiqueta = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

function Error({ mensaje }) {
    return mensaje ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{mensaje}</p> : null;
}

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put('/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Cambiar contraseña</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Usa una contraseña de al menos 8 caracteres que no utilices en otros sistemas.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="current_password" className={claseEtiqueta}>Contraseña actual</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={claseCampo}
                        autoComplete="current-password"
                    />
                    <Error mensaje={errors.current_password} />
                </div>

                <div>
                    <label htmlFor="password" className={claseEtiqueta}>Nueva contraseña</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={claseCampo}
                        autoComplete="new-password"
                    />
                    <Error mensaje={errors.password} />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className={claseEtiqueta}>Confirmar nueva contraseña</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={claseCampo}
                        autoComplete="new-password"
                    />
                    <Error mensaje={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-[#002b49] dark:bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#003b63] dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 transition-colors"
                    >
                        {processing ? 'Guardando…' : 'Guardar contraseña'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Contraseña actualizada.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
