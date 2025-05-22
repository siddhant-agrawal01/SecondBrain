import {Schema,Model} from  'mongoose'


const UserSchema = new Schema({
    username:{type:String,unique:true},
    password:{type:String}

})

const userModel =  new Model(UserSchema,'user')