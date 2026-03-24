// scripts/seed.ts
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seed() {
    const uri = "mongodb://localhost:27017/after_hours"; // Tu URI de Mongo
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("after_hours");
        const users = db.collection("users");

        // 1. Limpiamos si ya existe el admin para no duplicar
        await users.deleteOne({ username: "admin" });

        // 2. Generamos el hash REAL de 'admin123'
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        // 3. Insertamos el AdminGeneral del diagrama
        await users.insertOne({
            username: "admin",
            email: "admin@afterhours.com",
            password: hashedPassword,
            tipo: "empleado",
            createdAt: new Date(),
            empleadoInfo: {
                idEmpleado: 1,
                telefono: "555-0000",
                tipoRol: "AdminGeneral",
                estado: "Activo",
                idSucursal: 0
            }
        });

        console.log("✅ Admin creado con éxito:");
        console.log("User: admin");
        console.log("Pass: admin123");
        
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
    }
}

seed();