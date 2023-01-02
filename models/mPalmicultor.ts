// Modelo de palmicultor code
interface IDatoPersonal {
  nombre: string;
  direccion: string;
  dni: string;
  fechaNacimiento:string;
  sede:string;
  telefono:string;
  whatsapp:boolean;
}
interface IDatoEmpresarial {
  nombreJuridico: string;
  ruc: string;
  nombreAsociacionIndependiente:string;
  nombreEncargado:string;
  telefono:string;
  whatsapp:boolean;
}
interface IOtroDato {
  cargaFamiliar: string;
  nivelEducativo: string;
  anhiosExperienciaPalmas:string;
  accesoInternet:string;
  vivienda:string;
  otrosNegocios:string;
}

interface IPalmicultor{
  datoPersonal:IDatoPersonal,
  datoEmpresarial:IDatoEmpresarial,
  otroDato:IOtroDato
  status:boolean
  createdAt: string;
  expiredAt: string;
}

export default IPalmicultor;
