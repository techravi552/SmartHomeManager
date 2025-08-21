// backend/utils/routineScheduler.js
import cron from "node-cron";
import Routine from "../models/Routine.js";
import Room from "../models/Room.js";
import Device from "../models/Device.js";

// Keep active jobs by routineId
const jobs = new Map();

/** Convert "HH:MM" -> "M H * * *" (cron in local server time) */
function hhmmToCron(time) {
  const [HH, MM] = time.split(":").map((x) => parseInt(x, 10));
  if (
    Number.isNaN(HH) ||
    Number.isNaN(MM) ||
    HH < 0 ||
    HH > 23 ||
    MM < 0 ||
    MM > 59
  ) {
    throw new Error("Invalid time format, expected HH:MM");
  }
  return `${MM} ${HH} * * *`;
}

/** Execute routine -> find devices in scope (+filter) and update */
async function runRoutine(routine) {
  try {
    const { scope, household, room, deviceTypes, payload } = routine;

    // Get rooms under scope
    let roomIds = [];
    if (scope === "ROOM" && room) {
      roomIds = [room];
    } else if (scope === "HOUSEHOLD" && household) {
      const rooms = await Room.find({ household });
      roomIds = rooms.map((r) => r._id);
    }

    const query = { room: { $in: roomIds } };
    if (deviceTypes && deviceTypes.length > 0) {
      query.type = { $in: deviceTypes.map((t) => t.toLowerCase()) };
    }

    const devices = await Device.find(query);
    if (!devices.length) return;

    // Apply action (only status toggle for now)
    const status = payload?.status === "on" ? "on" : "off";
    await Device.updateMany({ _id: { $in: devices.map((d) => d._id) } }, { $set: { status } });
    // (Optional) You can also create usage logs here.
    console.log(`[Routine] Applied to ${devices.length} devices -> status: ${status}`);
  } catch (err) {
    console.error("Routine execution error:", err.message);
  }
}

export async function scheduleRoutine(routine) {
  // Clear existing job if any
  const existing = jobs.get(String(routine._id));
  if (existing) {
    existing.stop();
    jobs.delete(String(routine._id));
  }

  if (!routine.enabled) return;

  const pattern = hhmmToCron(routine.time);
  const job = cron.schedule(pattern, () => runRoutine(routine), { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  jobs.set(String(routine._id), job);
}

export function unscheduleRoutine(routineId) {
  const job = jobs.get(String(routineId));
  if (job) {
    job.stop();
    jobs.delete(String(routineId));
  }
}

export async function reloadAllRoutines(userId = null) {
  // Load enabled routines (optionally by user)
  const filter = { enabled: true };
  if (userId) filter.user = userId;

  const routines = await Routine.find(filter);
  for (const r of routines) {
    await scheduleRoutine(r);
  }
  console.log(`[Routine] Scheduled ${routines.length} routines`);
}
