const mongoose= require('mongoose');

const blogSchema= mongoose.Schema({
  content: {
    type:String,
    default:""

  },
  like: {
    type: Number,
    default: 0,
  },
  share: {
    type: Number,
    default: 0,
  },
  comment: {
    type: Number,
    default: 0,
  },

  user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required:[true, 'A blog must have an author']
  },

  publishedAt:{
      type: Date,
  },

  published:{
      type:Boolean,
      default:false,
  }
  
});

const Blog= mongoose.model('Blog', blogSchema);

module.exports=Blog;