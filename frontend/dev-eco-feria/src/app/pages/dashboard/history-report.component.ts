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
  `,
  styles: [`
    .dashboard-view {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
    }
    .view-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .view-header p {
      color: rgba(255, 255, 255, 0.6);
    }
    .filters-bar {
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
      align-items: center;
      background-color: var(--color-panel-bg);
      padding: 1rem 1.5rem;
      border-radius: 8px;
      flex-wrap: wrap;
    }
    .filters-main {
      display: flex;
      gap: 1rem;
      flex: 1;
      flex-wrap: wrap;
    }
    .search-box, .date-picker {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 200px;
    }
    .search-icon, .calendar-icon {
      position: absolute;
      left: 12px;
      width: 18px;
      height: 18px;
      color: rgba(255, 255, 255, 0.4);
    }
    .search-box input, .date-picker input {
      background: var(--color-base);
      border: 1px solid var(--color-border);
      color: white;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      width: 100%;
    }
    .search-box input:focus, .date-picker input:focus {
      border-color: var(--color-accent);
    }
    .export-button {
      background: transparent;
      border: 1px solid var(--color-accent);
      color: var(--color-accent);
      padding: 0.6rem 1.25rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .export-button svg {
      width: 18px;
      height: 18px;
    }
    .export-button:hover {
      background: rgba(0, 255, 255, 0.1);
    }
    .table-container {
      background-color: var(--color-panel-bg);
      border-radius: 12px;
      overflow-x: auto;
      border: 1px solid var(--color-border);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      min-width: 600px;
    }
    .data-table th, .data-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }
    .data-table th {
      background: rgba(255, 255, 255, 0.02);
      font-weight: 600;
      color: var(--color-accent);
    }
    .status-tag {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    .status-tag.completado { background: rgba(121, 194, 74, 0.2); color: var(--color-cta); }
    .status-tag.pendiente { background: rgba(255, 255, 0, 0.1); color: #FFFF00; }
    .text-nowrap { white-space: nowrap; }

    @media (max-width: 768px) {
      .dashboard-view { padding: 1.5rem; }
      .filters-bar { padding: 1rem; }
      .export-button { width: 100%; justify-content: center; }
      .search-box, .date-picker { min-width: 100%; }
    }
  `]
})
export class HistoryReportComponent {
  historyData = [
    { id: '1024', date: '2026-05-27 10:24', event: 'Charla Magistral', location: 'Auditorio A', status: 'completado' },
    { id: '1023', date: '2026-05-27 09:45', event: 'Acceso General', location: 'Entrada Norte', status: 'completado' },
    { id: '1022', date: '2026-05-27 09:00', event: 'Sincronización', location: 'Sistemas', status: 'completado' },
    { id: '1021', date: '2026-05-27 11:30', event: 'Taller Solar', location: 'Stand 12', status: 'pendiente' },
  ];
}
