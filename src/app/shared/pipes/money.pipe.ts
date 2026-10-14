import { Pipe, PipeTransform } from '@angular/core';

// Cambiar moneda aquí cuando se decida (PEN, USD...).
const fmt = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 });

export const formatMoney = (v: number): string => fmt.format(v);

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number): string {
    return formatMoney(value);
  }
}