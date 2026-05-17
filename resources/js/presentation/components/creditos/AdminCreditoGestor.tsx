/**
 * AdminCreditoGestor Component
 * Displays credit management interface for admins
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/presentation/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { AlertCircle, Search, Eye, Edit2, TrendingUp, Users, DollarSign } from 'lucide-react';
import { router } from '@inertiajs/react';
import NotificationService from '@/infrastructure/services/notification.service';

interface ClienteCredito {
  id: number;
  nombre: string;
  email: string;
  limite_credito: number;
  saldo_disponible: number;
  saldo_utilizado: number;
  porcentaje_utilizacion: number;
  estado: string;
  cuentas_pendientes: number;
  cuentas_vencidas: number;
}

interface AdminCreditoGestorProps {
  onClienteSelect?: (cliente: ClienteCredito) => void;
}

export const AdminCreditoGestor: React.FC<AdminCreditoGestorProps> = ({ onClienteSelect }) => {
  const [clientes, setClientes] = useState<ClienteCredito[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState<ClienteCredito[]>([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (Array.isArray(clientes)) {
      const filtered = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClientes(filtered);
    } else {
      setFilteredClientes([]);
    }
  }, [searchTerm, clientes]);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/creditos');
      if (response.ok) {
        const result = await response.json();

        // Handle nested data structure from ApiResponse
        // result.data can be either an array directly or an object with {data: [], pagination: {}}
        let creditoData = [];

        if (Array.isArray(result.data)) {
          // Direct array
          creditoData = result.data;
        } else if (result.data && Array.isArray(result.data.data)) {
          // Nested structure: result.data.data
          creditoData = result.data.data;
        } else if (result.data && result.data.length > 0) {
          // Fallback to result.data if it looks like an array
          creditoData = result.data;
        }

        console.log('Créditos cargados:', creditoData.length, creditoData);
        setClientes(creditoData);
      } else if (response.status === 404) {
        NotificationService.error('Endpoint no encontrado');
        setClientes([]);
      } else if (response.status === 500) {
        const errorData = await response.json();
        NotificationService.error(errorData.message || 'Error interno del servidor');
        setClientes([]);
      } else {
        NotificationService.error('Error al cargar los créditos');
        setClientes([]);
      }
    } catch (error) {
      console.error('Error:', error);
      NotificationService.error('Error al conectar con el servidor');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <Badge className="bg-green-600 text-white">Disponible</Badge>;
      case 'en_uso':
        return <Badge className="bg-blue-600 text-white">En Uso</Badge>;
      case 'critico':
        return <Badge className="bg-orange-600 text-white">Crítico</Badge>;
      case 'excedido':
        return <Badge className="bg-red-600 text-white">Excedido</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-600';
    if (percentage > 80) return 'bg-orange-600';
    if (percentage > 50) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleVerDetalles = (cliente: ClienteCredito) => {
    router.visit(`/clientes/${cliente.id}/credito`);
  };

  const handleEditarLimite = (cliente: ClienteCredito) => {
    if (onClienteSelect) {
      onClienteSelect(cliente);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-20" />
          </Card>
        ))}
      </div>
    );
  }

  // Estadísticas resumen
  const totalClientes = Array.isArray(clientes) ? clientes.length : 0;
  const clientesCriticos = Array.isArray(clientes) ? clientes.filter(c => c.estado === 'critico' || c.estado === 'excedido').length : 0;
  const clientesConVencidas = Array.isArray(clientes) ? clientes.filter(c => c.cuentas_vencidas > 0).length : 0;
  const limiteTotal = Array.isArray(clientes) ? clientes.reduce((sum, c) => sum + (c.limite_credito || 0), 0) : 0;
  const disponibleTotal = Array.isArray(clientes) ? clientes.reduce((sum, c) => sum + (c.saldo_disponible || 0), 0) : 0;
  const utilizadoTotal = Array.isArray(clientes) ? clientes.reduce((sum, c) => sum + (c.saldo_utilizado || 0), 0) : 0;

  return (
    <div className="space-y-6">
      {/* Resumen de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clientes</p>
                <p className="text-2xl font-bold">{totalClientes}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Créditos Críticos</p>
                <p className="text-2xl font-bold text-red-600">{clientesCriticos}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cuentas Vencidas</p>
                <p className="text-2xl font-bold text-orange-600">{clientesConVencidas}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crédito Total</p>
                <p className="text-lg font-bold text-purple-600 truncate">{formatCurrency(limiteTotal)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Créditos</CardTitle>
          <CardDescription>Administra los límites de crédito y monitorea el uso por cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute ml-3 mt-2.5" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Button variant="outline" onClick={cargarClientes}>
              Actualizar
            </Button>
          </div>

          {/* Tabla de Créditos */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Límite</TableHead>
                  <TableHead className="text-right">Utilizado</TableHead>
                  <TableHead className="text-right">Disponible</TableHead>
                  <TableHead>Utilización</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Alertas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                      No hay clientes con crédito
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <TableCell className="font-medium">{cliente.nombre}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(cliente.limite_credito)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(cliente.saldo_utilizado)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(cliente.saldo_disponible)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressBarColor(cliente.porcentaje_utilizacion)}`}
                              style={{ width: `${Math.min(cliente.porcentaje_utilizacion, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold whitespace-nowrap">
                            {cliente.porcentaje_utilizacion.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(cliente.estado)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {cliente.cuentas_vencidas > 0 && (
                            <Badge className="bg-red-600 text-xs">
                              {cliente.cuentas_vencidas} vencida{cliente.cuentas_vencidas > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {cliente.porcentaje_utilizacion > 80 && (
                            <Badge className="bg-orange-600 text-xs">Crítico</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVerDetalles(cliente)}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {/* <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditarLimite(cliente)}
                            title="Editar límite"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Resumen de Crédito Global */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm font-semibold mb-3">Resumen Global de Crédito</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Límite Total</p>
                <p className="text-lg font-bold">{formatCurrency(limiteTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Utilizado Total</p>
                <p className="text-lg font-bold text-orange-600">{formatCurrency(utilizadoTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Disponible Total</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(disponibleTotal)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
