import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';


export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
  isDeleted: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  patients: any[] = [];
  displayedColumns: string[] = [
    'id', 
    'firstName', 
    'lastName', 
    'email', 
    'phoneNumber', 
    'isAdmin', 
    'isDeleted', 
    'createdAt', 
    'actions'
  ];
  
  dataSource = new MatTableDataSource<Patient>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPatients();
    this.getPatients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async fetchPatients(): Promise<void> {
    try {
      const response = await this.http.get<{ result: Patient[] }>(
        'http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/patients/getAllPatients',
      ).toPromise();

      if (response && response.result && response.result.length > 0) {
        console.log('API Response:', response.result);
        this.dataSource.data = response.result;
        this.dataSource.paginator = this.paginator; // Set paginator after data fetch
        this.dataSource.sort = this.sort; // Enable sorting
      } else {
        console.warn('The API returned an empty array.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  getPatients() {
    this.http.get<any[]>('http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/patients/getAllPatients')
      .subscribe(data => {
        this.patients = data;
      });
  }

  deletePatient(patientId: number) {
    if (confirm('Biztosan törölni szeretnéd ezt a pácienst?')) {
      this.http.delete(`http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/patients/deletePatient?patientId=${patientId}`)
        .subscribe(() => {
          alert('Páciens sikeresen törölve!');
          this.getPatients(); // Frissíti a listát
        }, error => {
          alert('Hiba történt a törlés során.');
          console.error(error);
        });
    }
  }

}
