import { Component } from '@angular/core';
import { AdminNavigationComponent } from '../admin-navigation/admin-navigation.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminNavigationComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
