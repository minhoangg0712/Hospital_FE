import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Log để debug
    console.log('Token:', token);
    
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    // Log để debug
    console.log('Request headers:', cloned.headers.get('Authorization'));
    
    return next(cloned);
  }
  
  return next(req);
}; 