/**
 * Servicio de búsqueda inteligente para resolver referencias
 * Busca por ID, código, nombre (case-insensitive)
 */

export interface OpcionCatalogo {
  id: number;
  nombre?: string;
  codigo?: string;
  sigla?: string;
}

export const busquedaInteligente = {
  /**
   * Normalizar texto para búsqueda (minúsculas, sin espacios extras)
   */
  normalizarTexto(texto: string): string {
    if (!texto) return '';
    return texto.toLowerCase().trim();
  },

  /**
   * Buscar por ID, código o nombre (case-insensitive)
   */
  buscar<T extends OpcionCatalogo>(
    valor: string | number,
    opciones: T[]
  ): T | undefined {
    if (!valor || !opciones.length) return undefined;

    const valorStr = String(valor).trim();
    const valorNorm = this.normalizarTexto(valorStr);

    // 1. Buscar por ID si es numérico
    if (/^\d+$/.test(valorStr)) {
      const id = parseInt(valorStr, 10);
      const porId = opciones.find((op) => op.id === id);
      if (porId) return porId;
    }

    // 2. Buscar por nombre (case-insensitive)
    const porNombre = opciones.find(
      (op) => op.nombre && this.normalizarTexto(op.nombre) === valorNorm
    );
    if (porNombre) return porNombre;

    // 3. Buscar por código (case-insensitive)
    const porCodigo = opciones.find(
      (op) => op.codigo && this.normalizarTexto(op.codigo) === valorNorm
    );
    if (porCodigo) return porCodigo;

    // 4. Buscar por sigla (case-insensitive)
    const porSigla = opciones.find(
      (op) => op.sigla && this.normalizarTexto(op.sigla) === valorNorm
    );
    if (porSigla) return porSigla;

    // 5. Búsqueda parcial por nombre (contiene)
    const porNombreParcial = opciones.find(
      (op) => op.nombre && this.normalizarTexto(op.nombre).includes(valorNorm)
    );
    if (porNombreParcial) return porNombreParcial;

    return undefined;
  },

  /**
   * Resolver un valor a su opción correspondiente
   * Retorna el ID y nombre de la opción encontrada, o undefined
   */
  resolver<T extends OpcionCatalogo>(
    valor: string | number | undefined,
    opciones: T[]
  ): { id: number; nombre: string } | undefined {
    if (!valor) return undefined;

    const encontrado = this.buscar(valor, opciones);
    if (encontrado) {
      return {
        id: encontrado.id,
        nombre: encontrado.nombre || String(valor),
      };
    }

    return undefined;
  },

  /**
   * Obtener el nombre mostrable de una opción
   */
  getNombre(opcion: OpcionCatalogo): string {
    return opcion.nombre || `(ID: ${opcion.id})`;
  },

  /**
   * Buscar múltiples valores y retornar array de resultados
   */
  buscarMultiples<T extends OpcionCatalogo>(
    valores: (string | number | undefined)[],
    opciones: T[]
  ): (T | undefined)[] {
    return valores.map((valor) => this.buscar(valor, opciones));
  },
};
