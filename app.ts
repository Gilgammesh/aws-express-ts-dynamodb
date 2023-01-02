import serverless from 'serverless-http'
import routes from './routes'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
import logger from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import { corsOptions } from './config'
/***************************************************************************************************************/
// Inicializamos la variable de aplicación express //
/***************************************************************************************************************/
const app = express()

/***************************************************************************************************************/
// Middlewares de la aplicación //
/***************************************************************************************************************/
// Asegura nuestra app configurando varios encabezados HTTP, que mitigan los vectores de ataques comunes
app.use(helmet())
// Permite acceder a recursos del servidor desde otros dominios
app.use(cors(corsOptions))
// Realiza un parse de los formatos aplication/json
app.use(json())
// Decodifica los datos enviados desde un formulario
app.use(urlencoded({ extended: false }))
// Realiza un parse de la cookies en las peticiones http al servidor
app.use(cookieParser())
// Habilita compresión en todas las responses del servidor
app.use(compression())
// Logger para ver las peticiones http al servidor
app.use(logger('combined'))
app.use(`/`, routes)

export const handler = serverless(app)
