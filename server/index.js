import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import connectDB from './src/config/db.js'
connectDB()
const app=express();
app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.send('Event Management System')
});
const PORT=process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});