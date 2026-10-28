import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  likes: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Product', productSchema);
