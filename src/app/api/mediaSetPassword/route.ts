// src/app/api/mediaSetPassword/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cedula, newPassword } = body as { cedula?: string; newPassword?: string };

    if (!cedula || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Cédula y nueva contraseña son requeridas' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    const token      = process.env.AIRTABLE_API_KEY_SIRIUS_NOMINA_CORE_TOKEN;
    const baseId     = process.env.AIRTABLE_BASE_ID_SIRIUS_NOMINA_CORE;
    const tableId    = process.env.AIRTABLE_PERSONAL_TABLE_ID;
    const fDocumento = process.env.AIRTABLE_PF_NUMERO_DOCUMENTO;
    const fPassword  = process.env.AIRTABLE_PF_PASSWORD;
    const fEstado    = process.env.AIRTABLE_PF_ESTADO_ACTIVIDAD;

    if (!token || !baseId || !tableId || !fDocumento || !fPassword || !fEstado) {
      console.error('Variables de entorno faltantes para mediaSetPassword');
      return NextResponse.json(
        { success: false, error: 'Configuración incompleta del servidor' },
        { status: 500 }
      );
    }

    // Buscar el registro por cédula
    const safeCode = cedula.replace(/['"\\]/g, '');
    const filter = encodeURIComponent(`{${fDocumento}} = "${safeCode}"`);
    const fieldParams = [fDocumento, fPassword, fEstado]
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

    const data = await res.json() as { records: { id: string; fields: Record<string, string> }[] };

    if (!data.records || data.records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const record     = data.records[0];
    const recordId   = record.id;
    const fieldsData = record.fields;

    // Verificar que el usuario esté activo
    const estadoValue = (fieldsData[fEstado] ?? '').toLowerCase();
    if (estadoValue === 'inactivo') {
      return NextResponse.json(
        { success: false, error: 'Tu cuenta está inactiva. Contacta al área de Recursos Humanos.' },
        { status: 403 }
      );
    }

    // Verificar que no tenga contraseña (solo se permite en primer acceso o reset)
    if (fieldsData[fPassword]) {
      return NextResponse.json(
        { success: false, error: 'Esta cuenta ya tiene contraseña configurada. Contacta a RRHH para restablecerla.' },
        { status: 409 }
      );
    }

    // Hashear y guardar la nueva contraseña
    const hash = await bcrypt.hash(newPassword, 12);

    const patchUrl = `https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`;
    const patchRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: { [fPassword]: hash },
        returnFieldsByFieldId: true,
      }),
    });

    if (!patchRes.ok) {
      const errBody = await patchRes.text();
      console.error(`Airtable PATCH error ${patchRes.status}:`, errBody);
      return NextResponse.json(
        { success: false, error: 'Error al guardar la contraseña' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en mediaSetPassword:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
