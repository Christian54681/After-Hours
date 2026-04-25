// scripts/seed.ts
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seed() {
    const uri = "mongodb://localhost:27017/after_hours";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("after_hours");

        // 1. LIMPIEZA TOTAL (Reset de todas las colecciones involucradas)
        console.log("🧹 Limpiando base de datos...");
        await db.collection("users").deleteMany({});
        await db.collection("branches").deleteMany({});
        await db.collection("sections").deleteMany({});
        await db.collection("tables").deleteMany({});
        await db.collection("orders").deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash("admin123", salt);

        // 2. INSERTAR USUARIOS (Admin y Mesero)
        console.log("👥 Creando usuarios...");
        await db.collection("users").insertMany([
            {
                username: "ana.admin",
                email: "ana@afterhours.com",
                password: passHash,
                tipo: "empleado",
                createdAt: new Date(),
                empleadoInfo: {
                    // Atributos de clase EMPLEADO (Padre)
                    idSucursal: 1,
                    idEmpleado: 201,
                    nombreCompleto: "Ana Sucursal",
                    telefono: "555-9876",
                    tipoRol: "AdminSucursal",
                    estado: "Activo",

                    // Atributos de clase ADMIN SUCURSAL (Hija)
                    idSucursalACargo: 1,
                    presupuestoSucursal: 50000.00
                }
            },
            {
                username: "josue.mesero",
                email: "josue@afterhours.com",
                password: passHash,
                tipo: "empleado",
                createdAt: new Date(),
                empleadoInfo: {
                    // Atributos de clase EMPLEADO (Padre)
                    idSucursal: 1,
                    idEmpleado: 101,
                    nombreCompleto: "Josue Mesero",
                    telefono: "555-1234",
                    tipoRol: "Mesero",
                    estado: "Activo",

                    // Atributos de clase PERSONAL OPERATIVO (Hija intermedia)
                    areaActual: "Terraza",
                    activo: true,

                    // Atributos de clase MESERO (Hija final)
                    zonaAsignada: "VIP",
                    mesasACargo: [1, 2, 3]
                }
            }
        ]);

        // 3. INSERTAR MESAS
        console.log("🪑 Creando mesas...");
        const mesasTerrazaResult = await db.collection("tables").insertMany([
            { numeroMesa: 1, capacidad: 4, estado: 1 },
            { numeroMesa: 2, capacidad: 2, estado: 1 },
            { numeroMesa: 3, capacidad: 6, estado: 1 }
        ]);

        const mesasBarraResult = await db.collection("tables").insertMany([
            { numeroMesa: 10, capacidad: 1, estado: 1 },
            { numeroMesa: 11, capacidad: 1, estado: 1 }
        ]);

        // 4. INSERTAR SECCIONES (Referenciando los IDs de las mesas)
        console.log("📂 Creando secciones...");
        const seccionTerraza = await db.collection("sections").insertOne({
            idSeccion: "TERRAZA-01",
            nombre: "Terraza",
            capacidadMax: 20,
            mesasIds: Object.values(mesasTerrazaResult.insertedIds)
        });

        const seccionBarra = await db.collection("sections").insertOne({
            idSeccion: "BARRA-01",
            nombre: "Barra Alta",
            capacidadMax: 10,
            mesasIds: Object.values(mesasBarraResult.insertedIds)
        });

        // 5. INSERTAR SUCURSAL (Referenciando los IDs de las secciones)
        console.log("🏢 Creando sucursal...");
        await db.collection("branches").insertOne({
            idSucursal: 1,
            nombre: "After Hours Centro",
            direccion: "Calle Principal #123",
            tipoBar: "Premium",
            encargado: "Administrador Sucursal",
            seccionesIds: [seccionTerraza.insertedId, seccionBarra.insertedId]
        });

        console.log("✅ Estructura normalizada con éxito (Mesas -> Secciones -> Sucursal).");
        console.log("👉 Acceso: admin / admin123");

    } catch (error) {
        console.error("❌ Error en el seed:", error);
    } finally {
        await client.close();
    }
}

seed();