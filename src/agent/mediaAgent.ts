import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "azure-historical-dragon-442.mypinata.cloud",
});

// 📁 Mapa de grupos — sirius-multimedia
const GRUPOS = {
  "fotos/pirolisis":    "31f7f64f-3db1-4766-86ce-8c555849d636",
  "fotos/laboratorio":  "28b34a12-e9c0-49bf-9a62-be823e0373ea",
  "fotos/sg-sst":       "fcb8924d-d005-458b-850b-4ac4d1a2093d",
  "fotos/general":      "bb019a5c-8007-4efa-8ca7-ed8b3a7c5ded",
  "videos/pirolisis":   "1bdc8e0e-3ef4-44e5-92cb-ec4471e5b331",
  "videos/laboratorio": "acc93fb3-5d2d-4d41-a2f9-0f37479536b2",
  "archived":           "3374217b-66ce-4a4d-8d23-bbaaad6e5631",
};

// 📤 SUBIR un archivo al grupo correcto
export async function subirArchivo(
  file: File,
  carpeta: keyof typeof GRUPOS,
  metadata: { autor: string; descripcion: string; fecha?: string }
) {
  const groupId = GRUPOS[carpeta];
  const upload = await pinata.upload.public
    .file(file)
    .group(groupId)
    .name(file.name)
    .keyvalues({
      carpeta,
      autor: metadata.autor,
      descripcion: metadata.descripcion,
      fecha: metadata.fecha ?? new Date().toISOString().split("T")[0],
      empresa: "sirius-regenerative-solutions",
    });
  return upload;
}

// 🔍 BUSCAR archivos por carpeta y/o autor
export async function buscarArchivos(filtros: {
  carpeta?: keyof typeof GRUPOS;
  autor?: string;
  nombre?: string;
}) {
  let query = pinata.files.public.list().keyvalues({
    empresa: "sirius-regenerative-solutions",
  });

  if (filtros.carpeta) {
    const groupId = GRUPOS[filtros.carpeta];
    query = query.group(groupId);
  }
  if (filtros.nombre) {
    query = query.name(filtros.nombre);
  }

  const resultado = await query;
  // filtrar por autor si aplica
  if (filtros.autor) {
    return resultado.files.filter(
      (f) => f.keyvalues?.autor === filtros.autor
    );
  }
  return resultado.files;
}

// 🔗 OBTENER URL pública de un archivo por su CID
export function obtenerUrl(cid: string) {
  return `https://azure-historical-dragon-442.mypinata.cloud/ipfs/${cid}`;
}

// 📦 ARCHIVAR un archivo (moverlo al grupo archived)
export async function archivarArchivo(fileId: string) {
  return await pinata.files.public.update({
    id: fileId,
    group_id: GRUPOS["archived"],
    keyvalues: { archived: new Date().toISOString() },
  });
}

// 🗑️ ELIMINAR un archivo permanentemente
export async function eliminarArchivo(fileId: string) {
  return await pinata.files.public.delete([fileId]);
}

// 📋 LISTAR todos los archivos de una carpeta
export async function listarCarpeta(carpeta: keyof typeof GRUPOS) {
  const groupId = GRUPOS[carpeta];
  const resultado = await pinata.files.public.list().group(groupId);
  return resultado.files;
}
