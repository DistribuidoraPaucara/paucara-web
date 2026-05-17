import HeadingSmall from '@/presentation/components/heading-small';
import InputError from '@/presentation/components/input-error';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <HeadingSmall title="Eliminar cuenta" description="Elimina tu cuenta y todos sus recursos" />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Advertencia</p>
                    <p className="text-sm">Proceda con precaución, esto no se puede deshacer.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Eliminar Cuenta</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>¿Estás segura de que quieres eliminar tu cuenta?</DialogTitle>
                        <DialogDescription>
                            Una vez eliminada su cuenta, todos sus recursos y datos también se eliminarán permanentemente. Ingrese su contraseña para confirmar que desea eliminar su cuenta permanentemente.
                        </DialogDescription>

                        <Form
                            method="DELETE"
                            action="/profile"
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="sr-only">
                                            Contraseña
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary" onClick={() => resetAndClearErrors()}>
                                                Cancelar
                                            </Button>
                                        </DialogClose>

                                        <Button variant="destructive" disabled={processing} asChild>
                                            <button type="submit">Eliminar cuenta</button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
