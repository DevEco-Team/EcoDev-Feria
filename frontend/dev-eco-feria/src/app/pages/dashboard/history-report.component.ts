import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-view animate-fade-in">
      <header class="view-header">
        <h2>Historial y Reportes</h2>
        <p>Consulta el registro de actividades y descarga informes detallados.</p>
      </header>

      <div class="filters-bar">
        <div class="filters-main">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar registros...">
          </div>
          <div class="date-picker">
            <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <input type="date">
          </div>
        </div>
        <button class="export-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span class="btn-text">Exportar CSV</span>
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Evento</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of historyData">
              <td>#{{item.id}}</td>
              <td class="text-nowrap">{{item.date}}</td>
              <td>{{item.event}}</td>
              <td>{{item.location}}</td>
              <td><span class="status-tag" [class]="item.status">{{item.status}}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
/**
 * Componente que gestiona la visualización del historial de eventos y la generación de reportes.
 * Permite filtrar datos por fecha y realizar búsquedas, además de exportar la información.
 */
export class HistoryReportComponent {
  /** Lista de datos históricos de eventos para mostrar en la tabla. */
  historyData = [
    { id: '1024', date: '2026-05-27 10:24', event: 'Charla Magistral', location: 'Auditorio A', status: 'completado' },
    { id: '1023', date: '2026-05-27 09:45', event: 'Acceso General', location: 'Entrada Norte', status: 'completado' },
    { id: '1022', date: '2026-05-27 09:00', event: 'Sincronización', location: 'Sistemas', status: 'completado' },
    { id: '1021', date: '2026-05-27 11:30', event: 'Taller Solar', location: 'Stand 12', status: 'pendiente' },
  ];
}
