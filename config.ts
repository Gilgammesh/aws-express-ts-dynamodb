import { CorsOptions } from 'cors'
/*******************************************************************************************************/
// Opciones de CORS //
/*******************************************************************************************************/
export const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Authorization',
    'Content-Type',
    'Source',
    'Origin',
    'Ip',
    'Device',
    'Browser',
    'Platform'
  ]
}

