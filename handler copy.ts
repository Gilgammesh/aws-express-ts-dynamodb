import AWS from "aws-sdk";
import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import generateOtp from "./helpers/generateOtp";
import { getBySerie } from "./controllers/palmicultorController";
import {
  save as saveTemporalCode,
  validateOTP,
} from "./controllers/temporalCodeController";
import { save as saveUser } from "./controllers/userController";

import { Logger } from "@aws-lambda-powertools/logger";
import { generateTokenWithTime } from "./helpers/jwtoken";
import { JwtPayload } from "jsonwebtoken";
import { appTokenExpire } from "./configs";
import validateToken from "./middleware/validateToken";

const logger = new Logger();

// Función para procesar la petición del POS al encenderse por primera vez
export const initializeRequest = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Mensaje para ver si llegamos al handler - initializeRequest
  logger.info("Inicio desde initializeRequest");

  // Si existe una cabecera
  if (event.headers) {
    // Si existe el parámetro Authorization
    if (event.headers.Authorization) {
      try {
        // Obtenemos el número de serie del POS de la cabecera
        const serialNumber = event.headers.Authorization as string;

        // Mostramos el valor de SerialNumber
        logger.info("Valor de serialNumber ", serialNumber);

        // Obtenemos los datos del Comercio por el Número de serie del terminal POS
        const merchant = await getBySerie(serialNumber);

        // Mostramos el valor de merchant
        logger.info("Valor de merchant ", { merchant });

        // Obtenemos el correo y número de teléfono del comercio
        const email = merchant.email;
        const phone = merchant.phone;
        const merchantId = merchant.merchantId;

        // Definimos el payload del token
        const payload: JwtPayload = {
          serialNumber,
          merchantId,
        };
        // Generamos el token del merchant con tiempo de expiración
        const token: string | null = await generateTokenWithTime(
          payload,
          appTokenExpire
        );
        // Generamos el OTP de 06 dígitos
        const otp = generateOtp(6);

        logger.info("Valor del OTP ", { otp });

        // TODO: Integrar las funciones o métodos para enviar correo y sms
        // const message = `El código de validación del POS es: ${otp}`
        // await sendEmail(email, message);
        // await sendSms(phoneNumber, message);

        // Guardamos el user
        await saveUser(serialNumber, merchant);
        // Guardamos el temporal code
        await saveTemporalCode(serialNumber, otp);

        logger.info("Se obtuvo los datos del comercio correctamente");

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            email,
            phoneNumber: phone,
            message: "Se obtuvo los datos del comercio correctamente",
            token,
          }),
        };
      } catch (error) {
        // Mostramos mensaje de error
        logger.error("Mostramos mensaje de error: ", error);

        console.log(error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: error,
          }),
        };
      }
    } else {
      logger.info(
        "No se ha proporcionado el número de serie del terminal POS en la cabecera"
      );

      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message:
            "No se ha proporcionado el número de serie del terminal POS en la cabecera",
        }),
      };
    }
  } else {
    // Mensaje de que no se ha enviado parametro de serialNumber
    logger.info("No se ha proporcionado una cabecera a la petición");

    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "No se ha proporcionado una cabecera a la petición",
      }),
    };
  }
};

// Función para procesar la validación del OTP enviado por el Terminal POS
export const initializeSuperpos = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Mensaje para ver si llegamos al handler - initializeSuperpos
  logger.info("Inicio desde initializeSuperpos");

  // Si existe una cabecera
  if (event.headers) {
    // Si existe el token de autorización en la cabecera
    if (event.headers.token) {
      const { status, statusCode, msg } = await validateToken(
        event.headers.token as string
      );
      if (status) {
        // Si existe el parámetro otp en la cabecera
        if (event.headers.otp) {
          // Si existe un cuerpo
          if (event.body) {
            try {
              // Obtenemos el código de validación OTP de la cabecera
              const otp = event.headers.otp as string;

              // Mostramos el valor de otp
              logger.info("Valor de otp ", otp);

              // Obtenemos el cuerpo de la petición
              const body = JSON.parse(event.body);
              // Obtenemos el número de serie del dispositivo enviado en el cuerpo
              const serialNumber = body.device.serialNumber;

              // Mostramos el número de serie del dispositivo enviado en el cuerpo
              logger.info("Valor de serialNumber ", serialNumber);

              // Obtenemos los datos del Comercio por el Número de serie del terminal POS
              const result = await validateOTP(serialNumber, otp);

              // Mostramos datos del result
              logger.info("Datos del result: ", { result });

              if (result.status) {
                return {
                  statusCode: 200,
                  body: JSON.stringify({
                    success: true,
                    message: result.message,
                    merchant: result.merchant,
                  }),
                };
              } else {
                return {
                  statusCode: 500,
                  body: JSON.stringify({
                    success: true,
                    message: result.message,
                  }),
                };
              }
            } catch (error) {
              // Mostramos mensaje de error
              logger.error("Mostramos mensaje de error: ", error);
              console.log(error);

              return {
                statusCode: 500,
                body: JSON.stringify({
                  success: false,
                  message: error,
                }),
              };
            }
          } else {
            logger.info("No se ha proporcionado un cuerpo en la petición");

            return {
              statusCode: 400,
              body: JSON.stringify({
                success: false,
                message: "No se ha proporcionado un cuerpo en la petición",
              }),
            };
          }
        } else {
          // Mensaje de que no se ha enviado código de validación OTP en la cabecera
          logger.info(
            "No se ha proporcionado el código de validación OTP en la cabecera"
          );

          return {
            statusCode: 400,
            body: JSON.stringify({
              success: false,
              message:
                "No se ha proporcionado el código de validación OTP en la cabecera",
            }),
          };
        }
      } else {
        return {
          statusCode,
          body: JSON.stringify({
            success: false,
            message: msg,
          }),
        };
      }
    } else {
      // Mensaje de que no se ha enviado el token de aturoización en la cabecera
      logger.info("No se ha proporcionado el token de autorización");

      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "No se ha proporcionado token de autorización",
        }),
      };
    }
  } else {
    // Mensaje de No se ha proporcionado una cabecera a la petición
    logger.info("No se ha proporcionado una cabecera a la petición");

    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "No se ha proporcionado una cabecera a la petición",
      }),
    };
  }
};
