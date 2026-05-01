import { NextResponse } from 'next/server';
import clientPromise from '../../../../../../../lib/mongodb';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; // id es "SUC_001"
        const client = await clientPromise;
        const db = client.db("after_hours");

        // Buscamos la sucursal directamente
        const branch = await db.collection("branches").findOne({ idSucursal: id });
        
        if (!branch) {
            return NextResponse.json({ error: "Sucursal no encontrada" }, { status: 404 });
        }

        // Extraemos el campo 'secciones' que es donde tú guardas los datos
        const secciones = branch.secciones || [];

        // Devolvemos los datos tal cual
        return NextResponse.json(secciones);
        
    } catch (error) {
        console.error("Error en GET sections by branch:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}