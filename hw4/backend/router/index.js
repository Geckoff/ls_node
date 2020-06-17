const express = require("express");
const router = express.Router();
const { registration, refreshToken, login, profile } = require("./routes");
const registrationController = require("../controllers/Registration");
const refreshTokenController = require("../controllers/RefreshToken");
const loginController = require("../controllers/Login");
const profileController = require("../controllers/Profile");

router.post(registration, registrationController.postRegister);
router.post(refreshToken, refreshTokenController.postRefreshToken);
router.post(login, loginController.postLogin);
router.get(profile, profileController.getProfile);
router.patch(profile, profileController.patchProfile);

module.exports = router;
