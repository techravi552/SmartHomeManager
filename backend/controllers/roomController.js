import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { name, householdId } = req.body;

    if (!name || !householdId) {
      return res.status(400).json({ message: "Name and HouseholdId are required" });
    }

    const room = new Room({
      name,
      household: householdId,
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { householdId } = req.query;

    if (!householdId) {
      return res.status(400).json({ message: "householdId query param required" });
    }

    const rooms = await Room.find({ household: householdId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
