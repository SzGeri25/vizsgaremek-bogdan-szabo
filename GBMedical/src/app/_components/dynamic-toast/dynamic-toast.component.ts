import { Component, CUSTOM_ELEMENTS_SCHEMA, viewChild } from '@angular/core';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { ToastModule } from '@coreui/angular';



@Component({
  selector: 'app-dynamic-toast',
  imports: [ToastModule],
  templateUrl: './dynamic-toast.component.html',
  styleUrl: './dynamic-toast.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicToastComponent {
  placement = ToasterPlacement.TopCenter;

  readonly toaster = viewChild(ToasterComponent);

  addToast() {
    const options = {
      title: `Nem vagy bejelentkezve.`,
      delay: 5000,
      placement: this.placement,
      color: 'danger',
      autohide: true
    };
    const componentRef = this.toaster()?.addToast(ToasterComponent, { ...options });
  }
}
