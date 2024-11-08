/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// functions/index.js
const admin = require("firebase-admin");
admin.initializeApp();

const {sendCartInvitations} = require("./sendCartInvitations");
const {confirmUserInCart} = require("./confirmUserInCart");

exports.sendCartInvitations = sendCartInvitations;
exports.confirmUserInCart = confirmUserInCart;

