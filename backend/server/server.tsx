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
      avg_power_w,
      energy_wh_interval,
      energy_wh_total,
      meter_id,
    } = req.body;

    // 1. Basic validation (keep it cheap)
    if (
      !timestamp ||
      typeof avg_power_w !== "number" ||
      typeof energy_wh_interval !== "number" ||
      typeof energy_wh_total !== "number"
    ) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const meterId = meter_id || "meter_001";

    // 2. Create DB reference
    const ref = db.ref(`meters/${meterId}/readings`).push();

    // 3. Write data
    await ref.set({
      timestamp,
      avg_power_w,
      energy_wh_interval,
      energy_wh_total,
      server_received_at: new Date().toISOString(),
    });

    // 4. Update summary (optional but recommended)
    await db.ref(`meters/${meterId}/summary`).update({
      total_energy_wh: energy_wh_total,
      last_updated: new Date().toISOString(),
    });

    return res.status(201).json({ status: "ok" });
  } catch (err) {
    console.error("DB write failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
