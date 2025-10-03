import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;

  /**
   * Observable para el estado de loading
   */
  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  /**
   * Muestra el loading
   */
  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Oculta el loading
   */
  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      // Usar setTimeout para asegurar que el estado se actualice correctamente
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, 0);
    }
  }

  /**
   * Resetea el contador de loading
   */
  reset(): void {
    this.loadingCount = 0;
    this.loadingSubject.next(false);
  }
}
