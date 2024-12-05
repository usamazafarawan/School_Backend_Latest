import { Schema, model } from 'mongoose';
import { ISignUp } from './signUp.interface';


let signUpSchema: Schema<ISignUp> = new Schema({

        userName: { type: String, required: true },
        password: { type: String, required: true},
        isSchoolAuthority: { type: Boolean, required: true},

    
});

//@ts-ignore
export = model<ISignUp, ISignUpModel>('signupForBGS', signUpSchema);
