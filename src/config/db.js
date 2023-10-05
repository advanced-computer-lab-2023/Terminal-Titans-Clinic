import mongoose  from "mongoose";

mongoose.set('strictQuery', false);

const MongoURI = process.env.MONGO_URI ;

const connectDB = async () => {
  try{
      const conn = await mongoose.connect(process.env.MONGO_URI,{
          dbName: 'mernapp'
      });

      console.log(`mongodb connected ${conn.connection.host}`)
  }
  catch(err){
      console.log(err)
      process.exit(1)
  }
}

export default connectDB;