import { Fragment } from 'react';

interface Props {
    show: boolean;
    message?: string;
}

export default function ModalLoading({ show, message = 'Procesando...' }: Props) {
    if (!show) return null;

    return (
        <Fragment>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 transition-opacity" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                        <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <svg
                                    className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="opacity-25"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        className="opacity-75"
                                    />
                                </svg>
                            </div>

                            <div className="mt-3 text-center">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                    {message}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Por favor espere...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
