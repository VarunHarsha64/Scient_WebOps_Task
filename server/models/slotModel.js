import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  room: {
    type: String,
    enum: ['Room1', 'Room2', 'Room3'],
    required: true
  },
  slot: {
    type: String,
    enum: ['Slot1', 'Slot2', 'Slot3'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    bookingTime: {
      type: Date,
      default: null
    }
  }
});

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
