import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';

const toMin = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

export async function POST(req: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("after_hours");
        const body = await req.json();

        // Ahora recibimos 'dias' (array) en lugar de o además de 'fecha'
        const { empleadoId, sucursalId, entrada, salida, dias, rolEnTurno } = body;

        // 1. Validaciones básicas actualizadas
        if (!empleadoId || !entrada || !salida || !dias || !Array.isArray(dias)) {
            return NextResponse.json({ error: "Datos incompletos o días no seleccionados" }, { status: 400 });
        }

        // 2. Verificar traslapes (Conflict Check)
        // Buscamos turnos del mismo empleado que compartan al menos UN DÍA de la semana
        const turnosExistentes = await db.collection("schedules").find({
            empleadoId: new ObjectId(empleadoId),
            dias: { $in: dias } // Busca si hay coincidencia en el array de días
        }).toArray();

        const nuevoInicio = toMin(entrada);
        let nuevoFin = toMin(salida);
        if (nuevoFin <= nuevoInicio) nuevoFin += 1440; 

        for (const turno of turnosExistentes) {
            // Solo comparamos si el turno existente comparte días específicos con el nuevo
            const diasComunes = turno.dias.filter((d: string) => dias.includes(d));
            
            if (diasComunes.length > 0) {
                const exInicio = toMin(turno.entrada);
                let exFin = toMin(turno.salida);
                if (exFin <= exInicio) exFin += 1440;

                // Lógica de traslape
                if (nuevoInicio < exFin && nuevoFin > exInicio) {
                    return NextResponse.json({
                        error: `Conflicto: El empleado ya tiene un turno en (${diasComunes.join(', ')}) de ${turno.entrada} a ${turno.salida}`
                    }, { status: 409 });
                }
            }
        }

        // 3. Insertar el nuevo turno con formato de días
        const nuevoTurno = {
            empleadoId: new ObjectId(empleadoId),
            sucursalId: new ObjectId(sucursalId),
            dias, // Guardamos el array ["mon", "wed", etc.]
            entrada,
            salida,
            rolEnTurno: rolEnTurno || "Personal",
            createdAt: new Date()
        };

        await db.collection("schedules").insertOne(nuevoTurno);
        return NextResponse.json({ success: true, message: "Horario semanal programado" });

    } catch (error) {
        console.error("Error en POST schedules:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sucursalId = searchParams.get('sucursalId');

        const client = await clientPromise;
        const db = client.db("after_hours");

        let query: any = {};
        if (sucursalId) query.sucursalId = new ObjectId(sucursalId);

        // Traemos todos los horarios (puedes filtrar por empleadoId también si quieres)
        const data = await db.collection("schedules").find(query).toArray();
        
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 });
    }
}