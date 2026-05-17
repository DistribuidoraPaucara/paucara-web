{{-- Términos y Condiciones de la Venta --}}
<div class="terminos-condiciones">
    <strong class="terminos-titulo">📋 Términos y Condiciones</strong>

    <div class="terminos-contenido">
        {{-- Obtener términos de la empresa o usar por defecto --}}
        @php
            $terminos = $empresa->configuracion_impresion['terminos_condiciones'] ?? null;
        @endphp

        @if($terminos)
            <p>{!! nl2br(e($terminos)) !!}</p>
        @else
            {{-- Términos por defecto --}}
            <ul style="margin: 5px 0; padding-left: 15px;">
                <li>Los productos vendidos no pueden ser devueltos sin autorización previa.</li>
                <li>Se acepta cambio de producto dentro de 30 días con ticket original.</li>
                <li>Las devoluciones por defecto de fabricación deben reportarse dentro de 7 días.</li>
                <li>Los precios no incluyen instalación ni flete (si aplica).</li>
                <li>La garantía de fábrica cubre defectos de fabricación únicamente.</li>
                <li>Gracias por su compra. Le atendemos con gusto.</li>
            </ul>
        @endif
    </div>

    {{-- Contacto y política de satisfacción --}}
    @if($empresa->email || $empresa->telefono)
        <div class="terminos-contacto">
            <strong>Para consultas o reclamaciones:</strong>
            @if($empresa->telefono)
                <p>Tel: {{ $empresa->telefono }}</p>
            @endif
            @if($empresa->email)
                <p>Email: {{ $empresa->email }}</p>
            @endif
        </div>
    @endif
</div>
