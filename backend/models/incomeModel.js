import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    description : {
    type : String,
    required : true,
    trim : true
  },
  amount : {
    type : Number,
    required : true,
    min: 0
  },

  category: {
    type: String,
    required : true,
  },

  date: {
    type: Date,
    required : true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
 // for a particular user
  type: {
    type: String,
    default: "income",  
  },
},{
  timestamp : true 
});

const incomeModel = mongoose.models.income || mongoose.model('income', incomeSchema);

export default incomeModel;