'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let userDefinition = {
    email: {type: String, required: true, unique: true, uniqueCaseInsensitive: true},
    password: {type: String, required: true}
};

let userSchema = new mongoose.Schema(userDefinition);
userSchema.plugin(uniqueValidator);

module.exports = {
    definition: userDefinition,
    schema: userSchema,
    model: mongoose.model('User', userSchema)
};