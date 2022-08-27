import mongoose from 'mongoose';
//to deal with database we will create user
//then well create schema of user object i.e how the structure should look like
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
  },
  {
    timestamps: true, //indicate at which time user
  }
);
//define user model
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
