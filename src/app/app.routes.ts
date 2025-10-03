import { Routes } from '@angular/router';
import { TestApi } from './test-api/test-api';

export const routes: Routes = [
  { path: '', component: TestApi },
  { path: 'test-api', component: TestApi },
  { path: '**', redirectTo: '' }
];
