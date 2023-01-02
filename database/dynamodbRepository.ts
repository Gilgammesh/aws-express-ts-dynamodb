import  AWS from "aws-sdk";

// Instanciamos el servicio de dynamo para documentos
const dynamo = new AWS.DynamoDB.DocumentClient();

export default dynamo;

