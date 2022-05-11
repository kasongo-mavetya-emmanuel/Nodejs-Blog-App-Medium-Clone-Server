const mongoose= require('mongoose');
const validator= require('validator');
const bcrypt= require('bcryptjs');

const userSchema= mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true, 'A user Must have a name'],
        maxlength: [40, 'A name must have less or equal then 40 characters'],
        minlength: [3, 'A name must have more or equal then 10 characters'],
    },
    email:{
        type:String,
        required:[true, 'A user Must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
    },
    photo:{
       type: String,
    },
    profession:{
       type:String,
       minlength: [3, 'A profession must have have no less than 3 characters'],
    },
    dob:{
      type:String,
      minlength: [3, 'Invalid dob'],
    },
    title:{
      type:String,
      minlength: [3, 'A title must have have no less than 3 characters'],
    },
    about:{
       type: String,
       minlength: [3, 'about must have have no less than 3 characters'],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }

});


userSchema.pre('save',async function(next){
   //Hash the password
   this.password= await bcrypt.hash(this.password, 12);
   //delete confirm password
   this.passwordConfirm= undefined;

   next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});


userSchema.methods.correctPassword= async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter= function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp= parseInt(
      this.passwordChangedAt.getTime()/1000,10
    )
    
    return JWTTimestamp< changedTimestamp;
    
  }

  return false;

}


const User= mongoose.model('User', userSchema);

module.exports= User;