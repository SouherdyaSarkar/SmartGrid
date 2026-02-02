import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import serviceAccount from "../service-secret/serviceAccount.json";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL:
    "https://smartgrid-a2c22-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.database();

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("SmartGrid Backend is running now");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/api/meter-data", async (req, res) => {
  try {
    const {
      timestamp,
      avg_power_w_p, // Prosumer power
      avg_power_w_c, // Consumer power
      energy_wh_interval,
      energy_wh_total,
      meter_id,
      meter_type, // 'prosumer' | 'consumer'
    } = req.body;

    const meterId = meter_id || "meter_001";

    // Future: DB Lookup for meter_type if not provided
    /*
    let type = meter_type;
    if (!type) {
       const snapshot = await db.ref(`meter_registry/${meterId}/type`).once('value');
       type = snapshot.val();
    }
    */

    let finalType = meter_type;
    let powerValue = 0;

    // Validate based on type
    if (meter_type === 'prosumer') {
      if (typeof avg_power_w_p !== 'number') {
        return res.status(400).json({ error: "Missing avg_power_w_p for prosumer" });
      }
      powerValue = avg_power_w_p;
    } else if (meter_type === 'consumer') {
      if (typeof avg_power_w_c !== 'number') {
        return res.status(400).json({ error: "Missing avg_power_w_c for consumer" });
      }
      powerValue = avg_power_w_c;
      finalType = 'consumer';
    } else {
      // Fallback or Error? For now letting generic pass if fields are there, 
      // but strictly based on instructions we want differentiation.
      // If neither is strictly defined, check which field exists
      if (typeof avg_power_w_p === 'number') {
        finalType = 'prosumer';
        powerValue = avg_power_w_p;
      } else if (typeof avg_power_w_c === 'number') {
        finalType = 'consumer';
        powerValue = avg_power_w_c;
      } else {
        return res.status(400).json({ error: "Invalid payload: Unknown meter type or missing power data" });
      }
    }

    if (!timestamp || typeof energy_wh_interval !== "number" || typeof energy_wh_total !== "number") {
      return res.status(400).json({ error: "Invalid payload: missing common fields" });
    }

    // 2. Create DB reference
    const ref = db.ref(`meters/${meterId}/readings`).push();

    // 3. Write data
    const payload: any = {
      timestamp,
      energy_wh_interval,
      energy_wh_total,
      meter_type: finalType,
      server_received_at: new Date().toISOString(),
    };

    if (finalType === 'prosumer') {
      payload.avg_power_w_p = powerValue;
    } else {
      payload.avg_power_w_c = powerValue;
    }

    await ref.set(payload);

    // 4. Update summary
    await db.ref(`meters/${meterId}/summary`).update({
      type: finalType,
      last_power_w: powerValue,
      total_energy_wh: energy_wh_total,
      last_updated: new Date().toISOString(),
    });

    return res.status(201).json({ status: "ok" });
  } catch (err) {
    console.error("DB write failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
