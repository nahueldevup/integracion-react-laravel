import React, { forwardRef } from 'react';

// Interfaces para los datos
interface TicketItem {
    descripcion: string;
    cantidad: number;
    precio: number;
    total: number;
}

export interface TicketData {
    folio: string;
    fecha: string;
    cliente: string;
    cajero: string;
    items: TicketItem[];
    subtotal: number;
    total: number;
    pago: number;
    cambio: number;
    metodo_pago: string;
}

interface Props {
    data: TicketData;
}

// IMPORTANTE: forwardRef es obligatorio para imprimir
export const Ticket = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  // Si no hay datos, no renderizamos nada para evitar errores
  if (!data) return null;

  return (
    <div ref={ref} className="p-4 bg-white text-black font-mono text-xs w-[300px] mx-auto border shadow-sm print:shadow-none print:border-none print:w-full">
      
      {/* CABECERA */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold uppercase">Mi Tienda POS</h2>
        <p>Av. Siempre Viva 123</p>
        <p>Tel: 555-1234</p>
        <div className="border-b-2 border-dashed border-black my-2" />
        <p>Folio: {data.folio}</p>
        <p>Fecha: {data.fecha}</p>
      </div>

      {/* DATOS CLIENTE */}
      <div className="mb-2">
        <p>Cliente: {data.cliente}</p>
        <p>Atendió: {data.cajero}</p>
      </div>

      {/* TABLA PRODUCTOS */}
      <div className="border-b-2 border-dashed border-black mb-2" />
      <table className="w-full text-left mb-2">
        <thead>
          <tr>
            <th className="w-10">Cant.</th>
            <th>Desc.</th>
            <th className="text-right">Importe</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="align-top">{item.cantidad}</td>
              <td className="align-top">{item.descripcion}</td>
              <td className="text-right align-top">${Number(item.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-b-2 border-dashed border-black mb-2" />

      {/* TOTALES */}
      <div className="text-right space-y-1">
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL:</span>
          <span>${Number(data.total).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Pago ({data.metodo_pago}):</span>
          <span>${Number(data.pago).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Cambio:</span>
          <span>${Number(data.cambio).toFixed(2)}</span>
        </div>
      </div>

      {/* PIE */}
      <div className="text-center mt-6">
        <p>¡Gracias por su compra!</p>
        <p className="text-[10px] mt-1">Conserve este ticket</p>
      </div>
    </div>
  );
});

Ticket.displayName = 'Ticket';