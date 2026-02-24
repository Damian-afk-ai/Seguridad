import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div style="padding:2rem">
      <h1>Angular 20 funcionando</h1>

      <button 
        pButton 
        type="button" 
        label="Botón"
        severity="info" 
        icon="pi pi-check">
      </button>
    </div>
  `
})
export class App { }
