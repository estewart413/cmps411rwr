import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { SubmitComponent } from './submit/submit.component';

const routes: Routes = [
  {path: '/', component: HomeComponent},
  {path: '/new', component: NewComponent},
  {path: '/submit', component: SubmitComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
