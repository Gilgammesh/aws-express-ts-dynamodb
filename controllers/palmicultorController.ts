import { v4 as uuidv4 } from 'uuid'
import IPalmicultor from '../models/mPalmicultor'
import dynamo from '../database/dynamodbRepository'
import AWS from 'aws-sdk'

// Create the DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient()

// funcion que lista los palmicultores
export const getAll = async (req, res) => {
  try {
    const params = {
      TableName: process.env.PALMICULTOR_TABLE as string
    }

    const list = dynamoDb.scan(params).promise()
    return res.json({
      status: true,
      msg: 'Listado de palmicultores',
      list
    })
  } catch (error) {
    // Mostramos el error en consola
    console.log('Palmicultor', 'Obteniendo los palmicultores', error)
    // Retornamos
    return res.status(404).json({
      status: false,
      msg: 'No se pudo obtener los palmicultores'
    })
  }
}
// funcion que lista un palmicultor
export const get = async (req, res) => {}
// funcion que crea un palmicultor
export const create = async (req, res) => {
  // Leemos el cuerpo de la petición
  const { body } = req

  try {
    const newPamlmicultor: IPalmicultor = body
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.PALMICULTOR_TABLE as string,
      Item: {
        id: uuidv4(),
        ...newPamlmicultor
      }
    }
    //TODO VALIDACION DE RUC
    //TODO VALIDACION DE TELEFONO
    // Insertamo la data del usuario
    const savePalmicultor = await dynamo.put(params).promise()
    return res.json({
      msg: 'Se guardó el palmicultor',
      palmicultor: savePalmicultor
    })
  } catch (error) {
    // Mostramos el error en consola
    console.log('Palmicultor', 'Guardando palmicultor', error)
    // Retornamos
    return res.status(404).json({
      status: false,
      msg: 'No se pudo guardar  el palmicultor'
    })
  }
}
// funcion que actualiza o cambia d eestado a un palmicultor
export const update = async (req, res) => {}
// funcion de carga masiva
export const upload = async (req, res) => {}
