import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let model = new Schema({
    chat_id: {type: Number},
    username: {type: String, default: ''},
    firstname: {type: String, default: ''},
    lastname: {type: String, default: ''},
    wallet_private_key: {type: String, default: ''},
    wallet_public_key: {type: String, default: ''},
    is_owner: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now}
});

export const UserModel = mongoose.model('user', model);