import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let model = new Schema({
    webhook_id: {type: String},
    addresses: {type: Array},
    createdAt: {type: Number, default: Date.now}
});

export const HeliusWebhookModel = mongoose.model('helius-webhook', model);