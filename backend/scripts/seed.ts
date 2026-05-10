const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seed() {
    const uri = "mongodb://localhost:27017/after_hours";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("after_hours");

        console.log("🧹 Limpiando base de datos...");
        await db.collection("users").deleteMany({});
        await db.collection("branches").deleteMany({});
        await db.collection("sections").deleteMany({});
        await db.collection("tables").deleteMany({});

        const passHash = await bcrypt.hash("admin123", 10);

        console.log("👥 Creando Staff...");
        const usersResult = await db.collection("users").insertMany([
            {
                username: "christian.admin",
                email: "christian@afterhours.com",
                password: passHash,
                tipo: "empleado",
                createdAt: new Date(),
                empleadoInfo: {
                    idSucursal: "GLOBAL",
                    idEmpleado: 500,
                    nombreCompleto: "Christian Admin",
                    tipoRol: "AdminGeneral",
                    estado: "Activo",
                    todasLasSucursales: ['SUC_001', 'SUC_002', 'SUC_003']
                }
            },
            {
                username: "ana.admin",
                email: "ana@afterhours.com",
                password: passHash,
                tipo: "empleado",
                createdAt: new Date(),
                empleadoInfo: {
                    idSucursal: "SUC_001",
                    idEmpleado: 201,
                    nombreCompleto: "Ana Sucursal",
                    tipoRol: "AdminSucursal",
                    estado: "Activo",
                    idSucursalACargo: "SUC_001",
                    presupuestoSucursal: 50000
                }
            },
            {
                username: "marcos.admin",
                email: "marcos@afterhours.com",
                password: passHash,
                tipo: "empleado",
                createdAt: new Date(),
                empleadoInfo: {
                    idSucursal: "SUC_002",
                    idEmpleado: 202,
                    nombreCompleto: "Marcos Gerente",
                    tipoRol: "AdminSucursal",
                    estado: "Activo",
                    idSucursalACargo: "SUC_002",
                    presupuestoSucursal: 40000
                }
            },
            {
                username: "sofia.admin",
                email: "sofia@afterhours.com",
                password: passHash,
                tipo: "empleado",
                createdAt: new Date(),
                empleadoInfo: {
                    idSucursal: "SUC_003",
                    idEmpleado: 203,
                    nombreCompleto: "Sofia Admin",
                    tipoRol: "AdminSucursal",
                    estado: "Activo",
                    idSucursalACargo: "SUC_003",
                    presupuestoSucursal: 60000
                }
            }
        ]);

        const ids = usersResult.insertedIds;

        // --- SUCURSAL 1 (SUC_001) ---
        console.log("🏢 Creando SUC_001...");
        const mesasS1 = [
            { _id: new ObjectId(), numeroMesa: 1, capacidad: 4, estado: 1 },
            { _id: new ObjectId(), numeroMesa: 2, capacidad: 2, estado: 1 }
        ];
        await db.collection("tables").insertMany(mesasS1);

        const sec1Id = new ObjectId();
        const sec1 = {
            _id: sec1Id,
            idSeccion: "TER-01",
            nombre: "Terraza Centro",
            capacidadMax: 20,
            mesasIds: mesasS1.map(m => m._id),
            mesasCompletas: mesasS1
        };
        await db.collection("sections").insertOne(sec1);

        await db.collection("branches").insertOne({
            idSucursal: "SUC_001",
            nombre: "After Hours Centro",
            direccion: "Av. Reforma 100",
            tipoBar: "Premium",
            encargado: ids[1].toString(),
            seccionesIds: [sec1Id],
            secciones: [sec1],
            estado: "Activo",
            updatedAt: new Date()
        });

        // --- SUCURSAL 2 (SUC_002) ---
        console.log("🏢 Creando SUC_002...");
        const mesasS2 = [
            { _id: new ObjectId(), numeroMesa: 10, capacidad: 4, estado: 1 },
            { _id: new ObjectId(), numeroMesa: 11, capacidad: 4, estado: 1 }
        ];
        await db.collection("tables").insertMany(mesasS2);

        const sec2Id = new ObjectId();
        const sec2 = {
            _id: sec2Id,
            idSeccion: "GEN-01",
            nombre: "General Norte",
            capacidadMax: 40,
            mesasIds: mesasS2.map(m => m._id),
            mesasCompletas: mesasS2
        };
        await db.collection("sections").insertOne(sec2);

        await db.collection("branches").insertOne({
            idSucursal: "SUC_002",
            nombre: "After Hours Norte",
            direccion: "Calle Norte 50",
            tipoBar: "Universitario",
            encargado: ids[2].toString(),
            seccionesIds: [sec2Id],
            secciones: [sec2],
            estado: "Activo",
            updatedAt: new Date()
        });

        // --- SUCURSAL 3 (SUC_003) ---
        console.log("🏢 Creando SUC_003...");
        const mesasS3 = [
            { _id: new ObjectId(), numeroMesa: 20, capacidad: 2, estado: 1 },
            { _id: new ObjectId(), numeroMesa: 21, capacidad: 10, estado: 1 }
        ];
        await db.collection("tables").insertMany(mesasS3);

        const sec3Id = new ObjectId();
        const sec3 = {
            _id: sec3Id,
            idSeccion: "VIP-01",
            nombre: "VIP Sur",
            capacidadMax: 30,
            mesasIds: mesasS3.map(m => m._id),
            mesasCompletas: mesasS3
        };
        await db.collection("sections").insertOne(sec3);

        await db.collection("branches").insertOne({
            idSucursal: "SUC_003",
            nombre: "After Hours Sur",
            direccion: "Plaza Sur Lote 5",
            tipoBar: "Ejecutivo",
            encargado: ids[3].toString(),
            seccionesIds: [sec3Id],
            secciones: [sec3],
            estado: "Activo",
            updatedAt: new Date()
        });

        console.log("✅ Base de datos inundada con éxito.");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
    }
}

seed();