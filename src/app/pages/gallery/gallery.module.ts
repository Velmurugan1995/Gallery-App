import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery.component';

const routes: Routes = [
  {
    path:'',
    component: GalleryComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class GalleryModule { }
