"use strict";

const mongoose = require("mongoose");

let sauceDefinition = {
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: true},
    dislikes: {type: Number, required: true},
    usersLiked: {type: Array, required: true},
    usersDisliked: {type: Array, required: true}
}

let sauceSchema = new mongoose.Schema(sauceDefinition);

module.exports = {
    definition: sauceDefinition,
    schema: sauceSchema,
    model: mongoose.model("Sauce", sauceSchema)
};