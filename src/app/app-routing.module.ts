import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanComponent } from './kanban/kanban.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
 
  // { path: 'login', component: LoginComponent },
  // {path:'kanban',component:KanbanComponent},
  // { path: '', redirectTo: '/login', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
  
  
 }
