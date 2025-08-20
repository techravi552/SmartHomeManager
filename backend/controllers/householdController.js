import Household from "../models/Household.js";

// Create Household
export const createHousehold = async (req, res) => {
  try {
    const { name } = req.body;
    const household = await Household.create({ name, user: req.user.id });
    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ message: "Error creating household", error });
  }
};

// Get all households for logged-in user
export const getHouseholds = async (req, res) => {
  try {
    const households = await Household.find({ user: req.user.id });
    res.json(households);
  } catch (error) {
    res.status(500).json({ message: "Error fetching households", error });
  }
};

// Update household
export const updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!household) return res.status(404).json({ message: "Household not found" });
    res.json(household);
  } catch (error) {
    res.status(500).json({ message: "Error updating household", error });
  }
};

// Delete household
export const deleteHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findOneAndDelete({ _id: id, user: req.user.id });
    if (!household) return res.status(404).json({ message: "Household not found" });
    res.json({ message: "Household deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting household", error });
  }
};
