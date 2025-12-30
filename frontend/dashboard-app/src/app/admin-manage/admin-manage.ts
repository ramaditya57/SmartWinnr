import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-manage.html',
  styleUrls: ['./admin-manage.css']
})
export class AdminManageComponent implements OnInit {
  
  http = inject(HttpClient);
  router = inject(Router);
  
  dataList: any[] = [];
  
  formModel: any = {
    month: '',
    sales: 0,
    activeUsers: 0
  };

  isEditMode = false;
  currentId = '';

  ngOnInit(): void {
    this.fetchData();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  fetchData() {
    this.http.get<any[]>('http://localhost:3000/api/analytics').subscribe({
      next: (res) => this.dataList = res,
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.http.put(`http://localhost:3000/api/analytics/${this.currentId}`, this.formModel)
        .subscribe(() => {
          this.fetchData();
          this.resetForm();
        });
    } else {
      this.http.post('http://localhost:3000/api/analytics', this.formModel)
        .subscribe(() => {
          this.fetchData();
          this.resetForm();
        });
    }
  }

  onEdit(item: any) {
    this.isEditMode = true;
    this.currentId = item._id;
    this.formModel = { ...item }; 
  }

  onDelete(id: string) {
    if(confirm('Are you sure?')) {
      this.http.delete(`http://localhost:3000/api/analytics/${id}`)
        .subscribe(() => {
          this.fetchData();
        });
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.currentId = '';
    this.formModel = { month: '', sales: 0, activeUsers: 0 };
  }
}