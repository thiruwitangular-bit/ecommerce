import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/layout').then(m => m.Layout),
        children: [
            {
                path: '',
                loadComponent: () => import('./layout/landing-page/landing-page').then(m => m.LandingPage)
            },
            {
                path: 'products',
                loadComponent: () => import('./pages/products-grid/products-grid').then(m => m.ProductsGrid)
            },
            {
                path: 'product/:id',
                loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail)
            },
            {
                path: 'cart',
                loadComponent: () => import('./pages/cart/cart').then(m => m.Cart)
            },
            {
                path: 'wishlist',
                loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.Wishlist)
            },
            {
                path: 'checkout',
                loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout)
            },
            {
                path: 'order-success',
                loadComponent: () => import('./pages/order-success/order-success').then(m => m.OrderSuccess)
            },
            {
                path: 'admin',
                loadComponent: () => import('./admin/admin/admin').then(m => m.Admin)
            },
            {
                path: 'page404',
                loadComponent: () => import('./pages/page-404/page-404').then(m => m.Page404),
            },
            {
                path: '**',
                redirectTo: 'page404'
            }
        ]
    }
];
