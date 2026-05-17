import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { ImageBackupPanel } from '@/presentation/components/image-backup/ImageBackupPanel';

export default function ImageBackupPage() {
    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">🖼️ Backup de Imágenes</h1>
                    <p className="text-gray-600 mt-2">
                        Gestiona backups de todas las imágenes del sistema (clientes, proveedores, productos, etc.)
                    </p>
                </div>

                <ImageBackupPanel />
            </div>
        </AppLayout>
    );
}
