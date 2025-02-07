import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-services',
  imports: [FormsModule, CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  services$!: Observable<any[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.services$ = this.http.get<any[]>('http://127.0.0.1:8080/GBMedicalBackend-1.0-SNAPSHOT/webresources/services');
  }
}
