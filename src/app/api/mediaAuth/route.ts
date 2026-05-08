// src/app/api/mediaAuth/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cedula, password } = body as { cedula?: string; password?: string };

    if (!cedula || !password) {
      return NextResponse.json(
        { success: false, error: 'Cédula y contraseña son requeridas' },
        { status: 400 }
      );
    }

    const token   = process.env.AIRTABLE_API_KEY_SIRIUS_NOMINA_CORE_TOKEN;
    const baseId  = process.env.AIRTABLE_BASE_ID_SIRIUS_NOMINA_CORE;
    const tableId = process.env.AIRTABLE_PERSONAL_TABLE_ID;

    // Field IDs de la tabla Personal
    const fDocumento = process.env.AIRTABLE_PF_NUMERO_DOCUMENTO;
    const fPassword  = process.env.AIRTABLE_PF_PASSWORD;
    const fNombre    = process.env.AIRTABLE_PF_NOMBRE_COMPLETO;

    if (!token || !baseId || !tableId || !fDocumento || !fPassword || !fNombre) {
      console.error('Variables de entorno faltantes para mediaAuth');
      return NextResponse.json(
        { success: false, error: 'Configuración incompleta del servidor' },
        { status: 500 }
      );
    }

    // Filtrar por número de documento usando field ID
    const safeCode = cedula.replace(/['"\\]/g, '');
    const filter = encodeURIComponent(`{${fDocumento}} = "${safeCode}"`);
    const fieldParams = [fDocumento, fPassword, fNombre]
      .map(f => `fields%5B%5D=${encodeURIComponent(f)}`)
      .join('&');

    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filter}&${fieldParams}&maxRecords=1&returnFieldsByFieldId=true`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Airtable error ${res.status}:`, errBody);
      return NextResponse.json(
        { success: false, error: 'Error al consultar directorio de personal' },
        { status: 500 }
      );
    }

    const data = await res.json() as { records: { fields: Record<string, string> }[] };

    if (!data.records || data.records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cédula o contraseña incorrecta' },
        { status: 401 }
      );
    }

    const fields_data = data.records[0].fields;
    const storedPassword = fields_data[fPassword];

    if (!storedPassword || !(await bcrypt.compare(password, storedPassword))) {
      return NextResponse.json(
        { success: false, error: 'Cédula o contraseña incorrecta' },
        { status: 401 }
      );
    }

    const nombre = fields_data[fNombre] || cedula;

    return NextResponse.json({ success: true, nombre });
  } catch (error) {
    console.error('Error en autenticación de Sirius Media:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
