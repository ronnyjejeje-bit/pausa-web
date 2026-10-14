import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Pausa · Encuentra tu pausa',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'buscar',
    title: 'Explorar alojamientos · Pausa',
    loadComponent: () => import('./features/search/search.page').then((m) => m.SearchPage),
  },
  {
    path: 'alojamiento/:id',
    title: 'Alojamiento · Pausa',
    loadComponent: () => import('./features/property-detail/property-detail.page').then((m) => m.PropertyDetailPage),
  },
  {
    path: 'favoritos',
    title: 'Mis favoritos · Pausa',
    loadComponent: () => import('./features/favorites/favorites.page').then((m) => m.FavoritesPage),
  },
  { path: '**', redirectTo: '' },
];