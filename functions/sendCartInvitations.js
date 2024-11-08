// functions/sendCartInvitations.js
const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const admin = require("firebase-admin");

sgMail.setApiKey(functions.config().sendgrid.api_key);

// Helper function to generate a verification link
function generateVerificationLink(userId, cartId) {
  const token = Buffer.from(`${userId}:${cartId}`).toString("base64");
  return `https://commoncart-1458a.web.app/#/confirm?token=${token}`;
}

exports.sendCartInvitations = functions.https.onCall(async (data, context) => {
  const { cartId, users, title } = data;

  // Check if the required parameters are present and valid
  if (!cartId || !title || !Array.isArray(users)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with {cartId, title, users} where users is an array."
    );
  }

  const emailPromises = users.map((user) => {
    const verificationLink = generateVerificationLink(user.id, cartId);

    const msg = {
      to: user.email,
      from: "xuhaichen2000@126.com",
      subject: `You've been invited to join the cart: ${title}`,
      text: `You have been invited to join ${title}. Click the link to confirm: ${verificationLink}`,
      html: `<p>You have been invited to join ${title}. Click the link below to confirm:</p>
             <a href="${verificationLink}">Confirm Invitation</a>`,
    };

    return sgMail.send(msg).catch((error) => {
      console.error(`Error sending email to ${user.email}:`, error);
      return null;
    });
  });

  await Promise.all(emailPromises);
  console.log("All invitations processed.");
  return { message: "Invitations sent successfully." };
});
