import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements AfterViewInit {
  
  http = inject(HttpClient);
  router = inject(Router); 
  platformId = inject(PLATFORM_ID);
  chart: any;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchDataAndRender();
    }
  }

  goToManage() {
    this.router.navigate(['/admin/manage']);
  }

  logout() {
    localStorage.removeItem('adminUser');
    this.router.navigate(['/login']);
  }

  fetchDataAndRender() {
    this.http.get<any[]>('http://localhost:3000/api/analytics').subscribe({
      next: (data) => {
        const months = data.map(item => item.month);
        const sales = data.map(item => item.sales);
        this.renderChart(months, sales);
      },
      error: (err) => {
        console.error("Failed to fetch data", err);
      }
    });
  }

  renderChart(labels: string[], dataPoints: number[]) {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales ($)',
          data: dataPoints,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}