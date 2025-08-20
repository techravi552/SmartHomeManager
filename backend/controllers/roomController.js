import Room from "../models/Room.js";
import Household from "../models/Household.js";

// Create Room
export const createRoom = async (req, res) => {
  try {
    const { name, householdId } = req.body;

    // check household belongs to user
    const household = await Household.findOne({ _id: householdId, user: req.user.id });
    if (!household) return res.status(404).json({ message: "Household not found" });

    const room = await Room.create({ name, household: householdId });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error });
  }
};

// Get Rooms by Household
export const getRooms = async (req, res) => {
  try {
    const { householdId } = req.params;
    const rooms = await Room.find({ household: householdId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};

// Update Room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error });
  }
};

// Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error });
  }
};
