import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { AlertModule } from '@coreui/angular';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator'; 
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';


export interface User {
  id: number;
  firstName: string;
  email: string;
  isAdmin: boolean;
}

const USERS_DATA: User[] = [
  { id: 1, firstName: 'John', email: 'john@example.com', isAdmin: true },
  { id: 2, firstName: 'Jane', email: 'jane@example.com', isAdmin: false },
  { id: 3, firstName: 'David', email: 'david@example.com', isAdmin: true },
];

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, AlertModule, CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  displayedColumns: string[] = ['id', 'firstName', 'email', 'isAdmin'];
  dataSource = new MatTableDataSource<User>(USERS_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
