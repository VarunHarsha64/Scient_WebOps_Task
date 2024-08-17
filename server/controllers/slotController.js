import Slot from "../models/slotModel.js";
import User from "../models/userModel.js";

export const getAllSlots = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setUTCHours(0, 0, 0, 0);

    console.log(startOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    console.log(endOfWeek);

    const slots = await Slot.find({
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });

    console.log(slots.length);
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFreeSlots = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setUTCHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    const slots = await Slot.find({
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
      isBooked: false,
    });

    console.log(slots.length);
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const bookSlotById = async (req, res) => {
  const { slotId } = req.body;
  const userId = req.user._id;

  try {
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.json({success:false, message: "Slot not found" });
    }

    if (slot.isBooked) {
      return res.json({success:false, message: "Slot is already booked" });
    }

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const userBookingsCount = await Slot.countDocuments({
      "bookedBy.user": userId,
      "bookedBy.bookingTime": { $gte: startOfWeek, $lte: endOfWeek },
    });

    if (userBookingsCount >= 3) {
      return res
        .json({success:false, message: "Maximum of 3 slots can be booked per week" });
    }

    slot.isBooked = true;
    slot.bookedBy = {
      user: userId,
      bookingTime: new Date(),
    };

    // Save the updated slot
    await slot.save();

    res.status(200).json({success:true, message: "Slot booked successfully", slot });
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false, message: "Server error"});
  }
};

export const cancelSlotById = async (req, res) => {
  const { slotId } = req.body;
  const userId = req.user._id;

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.json({success:false, message: 'Slot not found' });
    }

    if (!slot.isBooked) {

      return res.json({success:false, message: 'Slot is not booked' });
    }

    if (slot.bookedBy.user.toString() !== userId.toString()) {
      return res.json({success:false, message: 'You do not have permission to cancel this booking' });
    }

    slot.isBooked = false;
    slot.bookedBy = null;
    await slot.save();

    res.status(200).json({success:true, message: 'Slot booking canceled successfully', slot });
  } catch (error) {
    res.json({success:false, message: 'Server error', error });
  }
};

const createSlotsForNextDays = async () => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 5); // Create slots for the next 5 months

  const rooms = ["Room1", "Room2", "Room3"];
  const slots = ["Slot1", "Slot2", "Slot3"];

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    date.setUTCHours(0,0,0,0);
    for (let room of rooms) {
      for (let slot of slots) {
        const existingSlot = await Slot.findOne({
          room,
          slot,
          date: date,
        });

        if (!existingSlot) {
          await Slot.create({
            room,
            slot,
            date: date,
            isBooked: false,
            bookedBy: null,
          });
        }
      }
    }
  }

  console.log("Slots initialized for the next 5 months");
};

export const initializeSlots = async (req, res) => {
  try {
    await createSlotsForNextDays();
  } catch (error) {
    console.log("Server error", error);
  }
};
