import { verify, JwtPayload, NotBeforeError, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { appSecret } from '../configs';
import { getBySerie } from '../controllers/palmicultorController';

const validateToken = async (token: string) => {
  // Si el token está vacio o no existe
  if (!token || token === '') {
    return {
      status: false,
      statusCode: 401,
      msg: 'Se debe proporcionar un token'
    };
  }

  try {
    // Intentamos verificar el token, con el texto secreto de la aplicación
    const decoded: JwtPayload = <JwtPayload>verify(token, appSecret);
    // Obtenemos los datos del comercio
    const serialNumber = decoded?.serialNumber;
    const merchantId = decoded?.merchantId;

    // Obtenemos los datos del Comercio por el Número de serie del terminal POS
    const merchant = await getBySerie(serialNumber);

    if (merchant) {
      if (merchant.merchantId === merchantId) {
        return {
          status: true,
          statusCode: 200,
          msg: 'El Comercio está autorizado para hacer peticiones'
        };
      } else {
        return {
          status: false,
          statusCode: 401,
          msg: 'El Comercio no tiene autorización para hacer peticiones'
        };
      }
    } else {
      return {
        status: false,
        statusCode: 401,
        msg: 'No se pudo obtener los datos del comercio'
      };
    }
  } catch (error: unknown) {
    // Capturamos los tipos de error en la vericación
    if (error instanceof JsonWebTokenError && error.name === 'JsonWebTokenError') {
      // Mostramos el error en consola
      console.log('Autenticando token Middleware', 'JsonWebTokenError', error.message);
      return {
        status: false,
        statusCode: 401,
        msg: 'El token proporcionado es inválido'
      };
    }
    if (error instanceof TokenExpiredError && error.name === 'TokenExpiredError') {
      // Mostramos el error en consola
      console.log('Autenticando token Middleware', 'TokenExpiredError', error.message, error.expiredAt);
      // Obtenemos la fecha de expiración casteada del token
      return {
        status: false,
        statusCode: 401,
        msg: `El token caduco a las ${error.expiredAt.toString()}`
      };
    }
    if (error instanceof NotBeforeError && error.name === 'NotBeforeError') {
      return {
        status: false,
        statusCode: 401,
        msg: 'El token no está activo'
      };
    }
    return {
      status: false,
      statusCode: 401,
      msg: 'No se pudo verificar el token'
    };
  }
};

export default validateToken;
