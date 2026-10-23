import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alojamiento } from '../models/alojamiento';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {
  private apiUrl = 'http://localhost:8080/api/v1/alojamientos';

  constructor(private http: HttpClient) { }

  obtenerTodos(): Observable<Alojamiento[]> {
    return this.http.get<Alojamiento[]>(this.apiUrl);
  }

  buscarPorCiudad(ciudad: string): Observable<Alojamiento[]> {
    return this.http.get<Alojamiento[]>(`${this.apiUrl}/buscar?ciudad=${ciudad}`);
  }
}