import InputError from '@/presentation/components/input-error';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { props } = usePage();
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Log cuando el usuario se autentica (el token está disponible en props.auth.sanctumToken)
    useEffect(() => {
        console.log('🔍 [Login Debug] Verificando autenticación...');
        console.log('🔍 [Login Debug] props.auth:', JSON.stringify((props?.auth as any), (key, value) => {
            // No mostrar el token completo en logs (seguridad), solo primeros 20 caracteres
            if (key === 'sanctumToken' && typeof value === 'string') {
                return `${value.substring(0, 20)}...`;
            }
            return value;
        }, 2));

        if (props?.auth?.user) {
            console.log(`✅ Usuario autenticado: ${props?.auth?.user?.name} (ID: ${props?.auth?.user?.id})`);

            const sanctumToken = (props?.auth as any)?.sanctumToken;
            if (sanctumToken) {
                console.log(`✅ ✓ Token SANCTUM disponible en props.auth.sanctumToken`);
                console.log(`✅ Token: ${sanctumToken.substring(0, 20)}...`);
            } else {
                console.error(`❌ ✗ Token SANCTUM NO disponible en props.auth.sanctumToken`);
                console.error(`❌ Esto causará fallback a localStorage (puede reutilizar token viejo)`);
                console.error('❌ Props actuales:', JSON.stringify((props?.auth as any), null, 2));
            }
        } else {
            console.log('⏳ Usuario aún no autenticado...');
        }
    }, [props?.auth?.sanctumToken, props?.auth?.user]);

    return (
        <AuthLayout title="Inicia sesión en tu cuenta" description="Ingresa tu correo o usuario y contraseña para continuar">
            <Head title="Iniciar sesión" />

            <Form
                method="POST"
                action="/login"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="group relative grid gap-6 rounded-2xl border border-border/40 bg-card/95 p-8 shadow-2xl backdrop-blur-md transition-all duration-500 hover:shadow-red-500/5 dark:border-white/5 dark:bg-black/40 dark:shadow-red-500/10">
                            {/* Efecto de brillo superior */}
                            <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            {/* Campo de Email con icono */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Correo o usuario
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-red-500" />
                                    <Input
                                        id="email"
                                        type="text"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="correo@ejemplo.com o usuario"
                                        className="peer h-11 pl-10 transition-all duration-300 focus:ring-2 focus:ring-red-500/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Campo de Contraseña con icono */}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Contraseña
                                    </Label>
                                    {/*{canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}*/}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-red-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="peer h-11 pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-red-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-red-500 peer-focus:text-red-500"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Checkbox con mejor estilo */}
                            <div className="flex items-center gap-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} className="border-border/60 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal text-muted-foreground">
                                    Recordarme
                                </Label>
                            </div>

                            {/* Botón mejorado con gradiente */}
                            <Button
                                type="submit"
                                className="group/btn relative mt-2 h-11 w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/40 focus:ring-4 focus:ring-red-500/30 disabled:opacity-50 dark:from-red-500 dark:to-red-600"
                                tabIndex={4}
                                disabled={processing}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                                <span className="relative flex items-center justify-center">
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Iniciar sesión
                                </span>
                            </Button>
                        </div>

                        {/*<div className="text-center text-sm text-muted-foreground">
                            ¿No tienes una cuenta?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Regístrate
                            </TextLink>
                        </div>*/}
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
