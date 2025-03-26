// src/app/api/authorizedUsers/route.ts
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Función para debugging
const logEnvironmentVariables = () => {
  console.log('API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
  console.log('BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);
  console.log('USERS_TABLE exists:', !!process.env.AIRTABLE_USERS_TABLE);
  console.log('USERS_TABLE value:', process.env.AIRTABLE_USERS_TABLE || 'Contactos'); // Usamos 'Contactos' como valor por defecto
};

// Configura Airtable
const getAirtableBase = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    throw new Error('Airtable API_KEY or BASE_ID is missing');
  }
  
  return new Airtable({ apiKey }).base(baseId);
};

export async function GET() {
  try {
    logEnvironmentVariables();
    const base = getAirtableBase();
    const tableName = process.env.AIRTABLE_USERS_TABLE || 'Contactos'; // Usamos el nombre de tu tabla según la imagen

    console.log(`Querying Airtable table: ${tableName}`);
    
    // Obtener registros de la tabla de usuarios autorizados
    const records = await base(tableName)
      .select({
        // Campos ajustados según tu Airtable (basado en la imagen)
        fields: ['Email', 'Nombre', 'Rol'],
        // Ajustamos la fórmula para buscar registros con "autorizado" en lugar de valor numérico
        filterByFormula: '{Autorizado} = "autorizado"',
      })
      .all();

    console.log(`Found ${records.length} authorized records`);
    
    // Transformar los registros a un formato más amigable
    const users = records.map(record => {
      console.log('Record ID:', record.id);
      return {
        id: record.id,
        email: record.get('Email') as string,
        name: record.get('Nombre') as string || undefined,
        role: record.get('Rol') as string || undefined
      };
    });

    // Enviar la lista de usuarios autorizados
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error al obtener usuarios de Airtable:', error);
    return NextResponse.json(
      { success: false, error: `Error al consultar la base de datos: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    logEnvironmentVariables();
    
    // Obtener el email del cuerpo de la solicitud
    const body = await request.json();
    const { email } = body;
    
    console.log('Checking authorization for email:', email);

    if (!email) {
      return NextResponse.json(
        { authorized: false, message: 'Email no proporcionado' },
        { status: 400 }
      );
    }

    const base = getAirtableBase();
    const tableName = process.env.AIRTABLE_USERS_TABLE || 'Contactos';
    
    // Buscar el email en la tabla de usuarios autorizados
    // Ajustamos la fórmula según tu estructura de Airtable
    const records = await base(tableName)
      .select({
        maxRecords: 1,
        filterByFormula: `AND({Email} = '${email.replace(/'/g, "\\'")}', {Autorizado} = 'autorizado')`
      })
      .all();

    console.log(`Found ${records.length} matching records for ${email}`);
    
    // Si encontramos al menos un registro, el usuario está autorizado
    if (records.length > 0) {
      return NextResponse.json({ authorized: true, message: 'Usuario autorizado' });
    } else {
      return NextResponse.json({ authorized: false, message: 'Usuario no autorizado' });
    }
  } catch (error) {
    console.error('Error al verificar autorización en Airtable:', error);
    return NextResponse.json(
      { authorized: false, message: `Error al consultar la base de datos: ${error}` },
      { status: 500 }
    );
  }
}