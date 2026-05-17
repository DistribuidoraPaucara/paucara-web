<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=auto, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    {{-- Application Configuration (Runtime) --}}
    <script>
        window.__APP_CONFIG__ = {
            websocketUrl: "{{ env('VITE_WEBSOCKET_URL', 'http://localhost:3001') }}",
            apiUrl: "{{ env('VITE_API_URL', '/api') }}"
        };
        window.__APP_NAME__ = "{{ config('app.name', 'Laravel') }}";
        console.log('🔧 App Config Loaded:', window.__APP_CONFIG__);
        console.log('📱 App Name:', window.__APP_NAME__);
    </script>

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();

    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }

    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="{{ env('FAVICON_ICO', '/favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ env('FAVICON_SVG', '/favicon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ env('APPLE_TOUCH_ICON', '/apple-touch-icon.png') }}">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
