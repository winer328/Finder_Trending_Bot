import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let model = new Schema({
    chat_id: {type: Number},
    username: {type: String, default: ''},
    firstname: {type: String, default: ''},
    lastname: {type: String, default: ''},
    token_address: {type: String, default: ''},
    initial_price: {type: String, default: '0'},
    from_time: {type: Number, default: 0},
    to_time: {type: Number, default: 0},
    duration: {type: Number, default: 0},
    is_owner: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now}
});

export const TrendModel = mongoose.model('trend-list', model);