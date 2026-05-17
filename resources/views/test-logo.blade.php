<!DOCTYPE html>
<html>
<head>
    <title>Test Logo</title>
    <style>
        body { font-family: Arial; margin: 20px; }
        .test-box {
            border: 1px solid #ccc;
            padding: 15px;
            margin: 10px 0;
            background: #f9f9f9;
        }
        img { max-width: 200px; border: 1px solid red; }
    </style>
</head>
<body>
    <h1>Test de Logos - Empresa: {{ $empresa->nombre_comercial }}</h1>

    <div class="test-box">
        <h2>Logo Principal (desde BD)</h2>
        <p>Ruta en BD: <code>{{ $empresa->logo_principal }}</code></p>
        <p>¿Está vacío? {{ $empresa->logo_principal ? 'NO' : 'SÍ' }}</p>

        @if($empresa->logo_principal)
            <h3>Intento 1: Ruta relativa directa</h3>
            <img src="{{ $empresa->logo_principal }}" alt="Logo">

            <h3>Intento 2: Con asset()</h3>
            <img src="{{ asset($empresa->logo_principal) }}" alt="Logo">

            <h3>Intento 3: Sin slash inicial</h3>
            <img src="{{ ltrim($empresa->logo_principal, '/') }}" alt="Logo">
        @else
            <p style="color: red;">No hay logo_principal en la BD</p>
        @endif
    </div>

    <div class="test-box">
        <h2>Información de Debug</h2>
        <p>APP_URL: {{ config('app.url') }}</p>
        <p>URL actual: {{ request()->url() }}</p>
        <p>Logo_principal: {{ $empresa->logo_principal }}</p>
        <p>Logo_compacto: {{ $empresa->logo_compacto ?: 'VACÍO' }}</p>
        <p>Logo_footer: {{ $empresa->logo_footer ?: 'VACÍO' }}</p>
    </div>
</body>
</html>
