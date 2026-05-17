@extends('layouts.app')

@section('title', 'Conciliación de Cajas')

@section('content')
<div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-2">Conciliación de Cajas</h1>
    <p class="text-gray-600 mb-6">Comparativa de ventas vs movimientos de caja</p>

    <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
        <input type="date" id="fechaInput" class="px-4 py-2 border border-gray-300 rounded-lg">
    </div>

    <div id="errorAlert" class="hidden mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"></div>
    <div id="loadingMsg" class="text-center py-8 text-gray-600">Cargando datos...</div>
    <div id="contenido" class="hidden">
        <!-- Resumen -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-gray-600 text-sm font-medium mb-2">Total Ventas</p>
                <p class="text-3xl font-bold text-gray-900" id="totalVentas">0.00</p>
                <p class="text-xs text-gray-500 mt-1" id="cantVentas">0 ventas</p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <p class="text-gray-600 text-sm font-medium mb-2">Total Caja</p>
                <p class="text-3xl font-bold text-gray-900" id="totalCaja">0.00</p>
                <p class="text-xs text-gray-500 mt-1" id="cantMovimientos">0 movimientos</p>
            </div>
            <div id="resumenDiferencia" class="rounded-lg shadow p-6 bg-green-50">
                <p class="text-green-700 text-sm font-medium mb-2">Conciliado ✓</p>
                <p class="text-3xl font-bold text-green-900" id="diferencia">0.00</p>
                <p class="text-xs font-medium" id="porcentajeDif">0%</p>
            </div>
        </div>

        <!-- Tabs -->
        <div class="space-y-4">
            <!-- Tipo Pago -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-6 border-b cursor-pointer hover:bg-gray-50" onclick="toggleSection('pagos')">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-semibold">Desglose por Tipo de Pago</h2>
                        <span id="icon-pagos">▶</span>
                    </div>
                </div>
                <div id="section-pagos" class="hidden overflow-x-auto">
                    <table class="w-full" id="tablaPagos">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700">Tipo de Pago</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700">Ventas</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700">Caja</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700">Diferencia</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-pagos"></tbody>
                    </table>
                </div>
            </div>

            <!-- Rango Cliente -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-6 border-b cursor-pointer hover:bg-gray-50" onclick="toggleSection('rangos')">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-semibold">Desglose por Rango de Cliente</h2>
                        <span id="icon-rangos">▶</span>
                    </div>
                </div>
                <div id="section-rangos" class="hidden overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700">Rango</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700">Total</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700">Cantidad</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-700">Promedio</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-rangos"></tbody>
                    </table>
                </div>
            </div>

            <!-- Ventas -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-6 border-b cursor-pointer hover:bg-gray-50" onclick="toggleSection('ventas')">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-semibold" id="titulo-ventas">Detalles de Ventas</h2>
                        <span id="icon-ventas">▶</span>
                    </div>
                </div>
                <div id="section-ventas" class="hidden overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Venta</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Cliente</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Tipo Pago</th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Monto</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-700">Hora</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-ventas"></tbody>
                    </table>
                </div>
            </div>

            <!-- Movimientos -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-6 border-b cursor-pointer hover:bg-gray-50" onclick="toggleSection('movimientos')">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-semibold" id="titulo-movimientos">Detalles de Movimientos</h2>
                        <span id="icon-movimientos">▶</span>
                    </div>
                </div>
                <div id="section-movimientos" class="hidden overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Tipo Operación</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Tipo Pago</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700">Usuario</th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-gray-700">Monto</th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-700">Hora</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-movimientos"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function toggleSection(section) {
    const sectionEl = document.getElementById(`section-${section}`);
    const iconEl = document.getElementById(`icon-${section}`);
    sectionEl.classList.toggle('hidden');
    iconEl.textContent = sectionEl.classList.contains('hidden') ? '▶' : '▼';
}

async function cargarConciliacion() {
    const fecha = document.getElementById('fechaInput').value;
    const loading = document.getElementById('loadingMsg');
    const contenido = document.getElementById('contenido');
    const errorAlert = document.getElementById('errorAlert');

    try {
        const response = await fetch(`/api/conciliacion/dia?fecha=${fecha}`);
        if (!response.ok) throw new Error('Error al cargar conciliación');

        const data = await response.json();
        const { resumen, desglose_tipo_pago, detalles_ventas, detalles_movimientos, desglose_rango_cliente } = data.data;

        // Resumen
        document.getElementById('totalVentas').textContent = resumen.total_ventas.toFixed(2) + ' Bs.';
        document.getElementById('cantVentas').textContent = resumen.cantidad_ventas + ' ventas';
        document.getElementById('totalCaja').textContent = resumen.total_ingresos_caja.toFixed(2) + ' Bs.';
        document.getElementById('cantMovimientos').textContent = resumen.cantidad_movimientos + ' movimientos';
        document.getElementById('diferencia').textContent = (resumen.diferencia > 0 ? '+' : '') + resumen.diferencia.toFixed(2) + ' Bs.';

        const pct = resumen.total_ventas > 0 ? (Math.abs(resumen.diferencia) / resumen.total_ventas) * 100 : 0;
        document.getElementById('porcentajeDif').textContent = pct.toFixed(2) + '% de las ventas';

        const div = document.getElementById('resumenDiferencia');
        if (resumen.hay_discrepancia) {
            div.className = 'rounded-lg shadow p-6 bg-red-50 border-2 border-red-200';
            div.querySelector('p').className = 'text-red-700 text-sm font-medium mb-2';
            div.querySelector('p').textContent = 'Diferencia';
            div.querySelector('.text-3xl').className = 'text-3xl font-bold text-red-900';
        }

        // Pagos
        const tbodyPagos = document.getElementById('tbody-pagos');
        tbodyPagos.innerHTML = desglose_tipo_pago.map(item => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-6 py-3 font-medium">${item.tipo_pago}</td>
                <td class="px-6 py-3 text-right">${item.total_ventas.toFixed(2)} Bs.</td>
                <td class="px-6 py-3 text-right">${item.total_movimientos.toFixed(2)} Bs.</td>
                <td class="px-6 py-3 text-right font-medium ${item.diferencia > 0 ? 'text-red-600' : 'text-green-600'}">
                    ${item.diferencia > 0 ? '+' : ''}${item.diferencia.toFixed(2)} Bs.
                </td>
            </tr>
        `).join('');
        document.getElementById('titulo-ventas').textContent = `Detalles de Ventas (${detalles_ventas.length})`;
        document.getElementById('titulo-movimientos').textContent = `Detalles de Movimientos (${detalles_movimientos.length})`;

        // Rangos
        const tbodyRangos = document.getElementById('tbody-rangos');
        tbodyRangos.innerHTML = desglose_rango_cliente.map(item => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-6 py-3 font-medium">${item.rango_cliente}</td>
                <td class="px-6 py-3 text-right">${item.total.toFixed(2)} Bs.</td>
                <td class="px-6 py-3 text-right">${item.cantidad_ventas}</td>
                <td class="px-6 py-3 text-right">${item.promedio.toFixed(2)} Bs.</td>
            </tr>
        `).join('');

        // Ventas
        const tbodyVentas = document.getElementById('tbody-ventas');
        tbodyVentas.innerHTML = detalles_ventas.map(v => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 font-medium">#${v.numero_venta}</td>
                <td class="px-4 py-3">${v.cliente}</td>
                <td class="px-4 py-3">${v.tipo_pago}</td>
                <td class="px-4 py-3 text-right font-medium">${v.monto_total.toFixed(2)} Bs.</td>
                <td class="px-4 py-3 text-center text-xs">${v.fecha}</td>
            </tr>
        `).join('');

        // Movimientos
        const tbodyMov = document.getElementById('tbody-movimientos');
        tbodyMov.innerHTML = detalles_movimientos.map(m => `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-3">${m.tipo_operacion}</td>
                <td class="px-4 py-3">${m.tipo_pago}</td>
                <td class="px-4 py-3">${m.usuario}</td>
                <td class="px-4 py-3 text-right font-medium">${m.monto.toFixed(2)} Bs.</td>
                <td class="px-4 py-3 text-center text-xs">${m.fecha}</td>
            </tr>
        `).join('');

        loading.classList.add('hidden');
        contenido.classList.remove('hidden');
        errorAlert.classList.add('hidden');
    } catch (err) {
        errorAlert.textContent = err.message;
        errorAlert.classList.remove('hidden');
        loading.classList.add('hidden');
    }
}

// Configurar fecha inicial y listeners
document.getElementById('fechaInput').valueAsDate = new Date();
document.getElementById('fechaInput').addEventListener('change', cargarConciliacion);

// Cargar al inicio
cargarConciliacion();
</script>
@endsection
