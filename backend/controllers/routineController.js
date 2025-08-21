// backend/controllers/routineController.js
import Routine from "../models/Routine.js";
import Household from "../models/Household.js";
import Room from "../models/Room.js";
import { scheduleRoutine, unscheduleRoutine } from "../utils/routineScheduler.js";

export const createRoutine = async (req, res) => {
  try {
    const user = req.user._id;
    const {
      householdId,
      roomId,
      scope, // 'HOUSEHOLD' | 'ROOM'
      time,  // 'HH:MM'
      deviceTypes = [],
      payload, // { status: 'on'|'off' }
      enabled = true,
    } = req.body;

    // Validate scope/refs
    if (!scope || !time || !householdId || !payload?.status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const household = await Household.findOne({ _id: householdId, user });
    if (!household) return res.status(404).json({ message: "Household not found" });

    let room = null;
    if (scope === "ROOM") {
      if (!roomId) return res.status(400).json({ message: "roomId required for ROOM scope" });
      room = await Room.findOne({ _id: roomId, household: householdId });
      if (!room) return res.status(404).json({ message: "Room not found" });
    }

    const routine = await Routine.create({
      user,
      household: householdId,
      room: roomId || undefined,
      scope,
      time,
      action: "SET_STATUS",
      payload: { status: payload.status === "on" ? "on" : "off" },
      deviceTypes: (deviceTypes || []).map((t) => String(t).toLowerCase()),
      enabled,
    });

    await scheduleRoutine(routine);

    res.status(201).json(routine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listRoutines = async (req, res) => {
  try {
    const user = req.user._id;
    const { householdId } = req.query;
    const filter = { user };
    if (householdId) filter.household = householdId;

    const routines = await Routine.find(filter).sort({ createdAt: -1 });
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRoutine = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    // Normalize deviceTypes/payload if provided
    if (updates.deviceTypes) {
      updates.deviceTypes = updates.deviceTypes.map((t) => String(t).toLowerCase());
    }
    if (updates.payload?.status) {
      updates.payload.status = updates.payload.status === "on" ? "on" : "off";
    }

    const routine = await Routine.findOneAndUpdate(
      { _id: id, user },
      updates,
      { new: true }
    );
    if (!routine) return res.status(404).json({ message: "Routine not found" });

    // Reschedule
    await scheduleRoutine(routine);
    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteRoutine = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;

    const deleted = await Routine.findOneAndDelete({ _id: id, user });
    if (!deleted) return res.status(404).json({ message: "Routine not found" });

    unscheduleRoutine(id);
    res.json({ message: "Routine deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
