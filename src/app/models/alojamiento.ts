export interface Alojamiento {
  id?: number;
  titulo: string;
  descripcion?: string;
  ciudad: string;
  direccion?: string;
  precioPorNoche: number;
  capacidadMaxima: number;
  imagenUrl?: string;
  activo?: boolean;
}