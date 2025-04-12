import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path:'audio',
    loadChildren: () => import('./pages/audio/audio.module').then(m => m.AudioModule)
  },
  {
    path:'gallery',
    loadChildren: () => import('./pages/gallery/gallery.module').then(m => m.GalleryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
