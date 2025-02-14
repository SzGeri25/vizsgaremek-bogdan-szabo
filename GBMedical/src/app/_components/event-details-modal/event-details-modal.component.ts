import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


export interface EventDetailsData {
  title: string;
  start: string;
  end: string;
  status: string;
  doctorId: number;
  patientId: number;
}

@Component({
  selector: 'app-event-details-modal',
  imports: [MatIconModule],
  templateUrl: './event-details-modal.component.html',
  styleUrl: './event-details-modal.component.css'
})

export class EventDetailsModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventDetailsData,
    private dialogRef: MatDialogRef<EventDetailsModalComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
