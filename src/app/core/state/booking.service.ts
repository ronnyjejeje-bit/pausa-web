import { Injectable, signal } from '@angular/core';

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  createdAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

const STORAGE_KEY = 'pausa_bookings';

@Injectable({ providedIn: 'root' })
export class BookingService {
  readonly bookings = signal<Booking[]>(this.loadFromStorage());

  addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): void {
    const newBooking: Booking = {
      ...booking,
      id: 'bk-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };
    const updated = [newBooking, ...this.bookings()];
    this.bookings.set(updated);
    this.saveToStorage(updated);
  }

  cancelBooking(id: string): void {
    const updated = this.bookings().map((b) =>
      b.id === id ? { ...b, status: 'CANCELLED' as const } : b
    );
    this.bookings.set(updated);
    this.saveToStorage(updated);
  }

  private loadFromStorage(): Booking[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: Booking[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}