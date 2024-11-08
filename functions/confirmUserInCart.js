const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Import and configure CORS

exports.confirmUserInCart = functions.https.onRequest((req, res) => {
  cors(req, res, async () => { // Wrap the logic in cors
    try {
      const { token } = req.query;
      if (!token) return res.status(400).send("Missing confirmation token");

      const [userId, cartId] = Buffer.from(token, "base64").toString("utf-8").split(":");
      const cartRef = admin.database().ref(`/Cart/${cartId}`);
      const userRef = admin.database().ref(`/users/${userId}`);

      const cartSnapshot = await cartRef.once("value");
      const cartData = cartSnapshot.val();

      if (!cartData) return res.status(404).send("Cart not found");

      // Check if the user is already in the cart
      const isUserInCart = Array.isArray(cartData.users) && cartData.users.some((user) => user.id === userId);
      if (isUserInCart) {
        return res.status(200).send("User already confirmed");
      }

      // Retrieve user data to get the displayName
      const userSnapshot = await userRef.once("value");
      const userData = userSnapshot.val();

      if (!userData || !userData.displayName) {
        return res.status(404).send("User not found or displayName is missing");
      }

      // Add user with displayName to the `users` array
      const updatedUsers = [
        ...(cartData.users || []),
        { id: userId, displayName: userData.displayName }
      ];
      await cartRef.update({ users: updatedUsers });

      return res.status(200).send("User successfully added to the cart");
    } catch (error) {
      console.error("Error confirming user:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});
