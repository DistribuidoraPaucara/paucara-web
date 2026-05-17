import Api from './Api'
import ProformaController from './ProformaController'
import InventarioController from './InventarioController'
import ModuloSidebarController from './ModuloSidebarController'
import Auth from './Auth'
import PermissionController from './PermissionController'
import ProductoController from './ProductoController'
import ComboController from './ComboController'
import VentaController from './VentaController'
import CompraController from './CompraController'
import PrecioController from './PrecioController'
import ReporteVentasController from './ReporteVentasController'
import AsientoContableController from './AsientoContableController'
import ReporteInventarioApiController from './ReporteInventarioApiController'
import VehiculoController from './VehiculoController'
import ClienteController from './ClienteController'
import DireccionClienteApiController from './DireccionClienteApiController'
import FotoLugarClienteController from './FotoLugarClienteController'
import CreditoImportController from './CreditoImportController'
import CreditoController from './CreditoController'
import LocalidadController from './LocalidadController'
import CategoriaClienteController from './CategoriaClienteController'
import EntregaController from './EntregaController'
import EntregaPdfController from './EntregaPdfController'
import ReporteCargaPdfController from './ReporteCargaPdfController'
import ReporteCargoListController from './ReporteCargoListController'
import ProveedorController from './ProveedorController'
import ImageBackupController from './ImageBackupController'
import AuditoriaCajaController from './AuditoriaCajaController'
import ConciliacionCajaController from './ConciliacionCajaController'
import AlertasController from './AlertasController'
import PrestableController from './PrestableController'
import PrestableStockController from './PrestableStockController'
import PrestamoVendidoController from './PrestamoVendidoController'
import CompraPrestableController from './CompraPrestableController'
import PrestamoClienteController from './PrestamoClienteController'
import PrestamoProveedorController from './PrestamoProveedorController'
import ReportesController from './ReportesController'
import Prestamos from './Prestamos'
import VentaPublicController from './VentaPublicController'
import PublicStockController from './PublicStockController'
import DashboardController from './DashboardController'
import RoleController from './RoleController'
import CategoriaController from './CategoriaController'
import MarcaController from './MarcaController'
import AlmacenController from './AlmacenController'
import SectorController from './SectorController'
import ConfiguracionGlobalController from './ConfiguracionGlobalController'
import EmpresaController from './EmpresaController'
import CodigoBarraController from './CodigoBarraController'
import ReporteCodigosBarraController from './ReporteCodigosBarraController'
import ReporteController from './ReporteController'
import UnidadMedidaController from './UnidadMedidaController'
import TipoPrecioController from './TipoPrecioController'
import PrecioRangoController from './PrecioRangoController'
import MonedaController from './MonedaController'
import TipoPagoController from './TipoPagoController'
import TipoDocumentoController from './TipoDocumentoController'
import ReporteProductoDanadoAdminController from './ReporteProductoDanadoAdminController'
import BannerPublicitarioAdminController from './BannerPublicitarioAdminController'
import UserController from './UserController'
import EmpleadoController from './EmpleadoController'
import CuentaPorPagarController from './CuentaPorPagarController'
import PagoController from './PagoController'
import LoteVencimientoController from './LoteVencimientoController'
import ReporteComprasController from './ReporteComprasController'
import ImpresionComprasController from './ImpresionComprasController'
import DetalleCompraController from './DetalleCompraController'
import DetalleVentaController from './DetalleVentaController'
import CuentaPorCobrarController from './CuentaPorCobrarController'
import DevolucionController from './DevolucionController'
import ServicioController from './ServicioController'
import ImpresionProformasController from './ImpresionProformasController'
import ReservaController from './ReservaController'
import CajaController from './CajaController'
import GastoController from './GastoController'
import CierreDiarioGeneralController from './CierreDiarioGeneralController'
import ImpresionMovimientosController from './ImpresionMovimientosController'
import ImpresionProductosVendidosController from './ImpresionProductosVendidosController'
import TipoAjusteInventarioController from './TipoAjusteInventarioController'
import InventarioInicialController from './InventarioInicialController'
import ReservaStockController from './ReservaStockController'
import Inventario from './Inventario'
import PrestamosInertiaController from './PrestamosInertiaController'
import Web from './Web'
import VendedorController from './VendedorController'
import ChoferController from './ChoferController'
import PreventistController from './PreventistController'
import AdminController from './AdminController'
import RutaController from './RutaController'
import ReportePreciosController from './ReportePreciosController'
import ReporteCreditoController from './ReporteCreditoController'
import ReporteVisitasController from './ReporteVisitasController'
import ReporteInventarioController from './ReporteInventarioController'
import ConteoFisicoController from './ConteoFisicoController'
import AnalisisAbcController from './AnalisisAbcController'
import ImpresionStockController from './ImpresionStockController'
import ImpresionVentasController from './ImpresionVentasController'
import Settings from './Settings'
const Controllers = {
    Api,
ProformaController,
InventarioController,
ModuloSidebarController,
Auth,
PermissionController,
ProductoController,
ComboController,
VentaController,
CompraController,
PrecioController,
ReporteVentasController,
AsientoContableController,
ReporteInventarioApiController,
VehiculoController,
ClienteController,
DireccionClienteApiController,
FotoLugarClienteController,
CreditoImportController,
CreditoController,
LocalidadController,
CategoriaClienteController,
EntregaController,
EntregaPdfController,
ReporteCargaPdfController,
ReporteCargoListController,
ProveedorController,
ImageBackupController,
AuditoriaCajaController,
ConciliacionCajaController,
AlertasController,
PrestableController,
PrestableStockController,
PrestamoVendidoController,
CompraPrestableController,
PrestamoClienteController,
PrestamoProveedorController,
ReportesController,
Prestamos,
VentaPublicController,
PublicStockController,
DashboardController,
RoleController,
CategoriaController,
MarcaController,
AlmacenController,
SectorController,
ConfiguracionGlobalController,
EmpresaController,
CodigoBarraController,
ReporteCodigosBarraController,
ReporteController,
UnidadMedidaController,
TipoPrecioController,
PrecioRangoController,
MonedaController,
TipoPagoController,
TipoDocumentoController,
ReporteProductoDanadoAdminController,
BannerPublicitarioAdminController,
UserController,
EmpleadoController,
CuentaPorPagarController,
PagoController,
LoteVencimientoController,
ReporteComprasController,
ImpresionComprasController,
DetalleCompraController,
DetalleVentaController,
CuentaPorCobrarController,
DevolucionController,
ServicioController,
ImpresionProformasController,
ReservaController,
CajaController,
GastoController,
CierreDiarioGeneralController,
ImpresionMovimientosController,
ImpresionProductosVendidosController,
TipoAjusteInventarioController,
InventarioInicialController,
ReservaStockController,
Inventario,
PrestamosInertiaController,
Web,
VendedorController,
ChoferController,
PreventistController,
AdminController,
RutaController,
ReportePreciosController,
ReporteCreditoController,
ReporteVisitasController,
ReporteInventarioController,
ConteoFisicoController,
AnalisisAbcController,
ImpresionStockController,
ImpresionVentasController,
Settings,
}

export default Controllers