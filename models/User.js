import mongoose from 'mongoose';
//to deal with database we will create user
//then well create schema of user object i.e how the structure should look like
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true, //indicate at which time user
  }
);
//define user model
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
