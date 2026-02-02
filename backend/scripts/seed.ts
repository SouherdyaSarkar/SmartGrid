import admin from "firebase-admin";
import serviceAccount from "../service-secret/serviceAccount.json";

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL:
            "https://smartgrid-a2c22-default-rtdb.asia-southeast1.firebasedatabase.app",
    });
}

const db = admin.database();

const generateReading = (type: 'prosumer' | 'consumer', hourOffset: number) => {
    const timestamp = new Date(Date.now() - hourOffset * 3600 * 1000).toISOString();
    const isProsumer = type === 'prosumer';
    const basePower = isProsumer ? 500 : 200; // 500W generation or 200W consumption
    const noise = Math.random() * 50 - 25;
    const power = Math.max(0, Math.round(basePower + noise));

    return {
        timestamp,
        [isProsumer ? 'avg_power_w_p' : 'avg_power_w_c']: power,
        energy_wh_interval: Math.round(power * 1), // 1 hour interval roughly
        energy_wh_total: Math.round(power * hourOffset), // just accumulating for show
        meter_type: type,
    };
};

async function seed() {
    console.log("Starting seed...");

    // Seed Prosumer
    const prosumerId = "meter_001";
    console.log(`Seeding Prosumer: ${prosumerId}`);
    for (let i = 24; i >= 0; i--) {
        const reading = generateReading('prosumer', i);
        await db.ref(`meters/${prosumerId}/readings`).push().set(reading);
    }
    await db.ref(`meters/${prosumerId}/summary`).update({
        type: 'prosumer',
        last_power_w: 480,
        total_energy_wh: 12000,
        last_updated: new Date().toISOString()
    });

    // Seed Consumer
    const consumerId = "meter_002";
    console.log(`Seeding Consumer: ${consumerId}`);
    for (let i = 24; i >= 0; i--) {
        const reading = generateReading('consumer', i);
        await db.ref(`meters/${consumerId}/readings`).push().set(reading);
    }
    await db.ref(`meters/${consumerId}/summary`).update({
        type: 'consumer',
        last_power_w: 210,
        total_energy_wh: 5000,
        last_updated: new Date().toISOString()
    });

    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch(console.error);
