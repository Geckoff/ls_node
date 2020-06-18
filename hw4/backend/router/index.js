const express = require("express");
const router = express.Router();
const {
	registration,
	refreshToken,
	login,
	profile,
	news,
	newsById,
	users,
	userById,
	userByIdPermission,
} = require("./routes");
const registrationController = require("../controllers/Registration");
const refreshTokenController = require("../controllers/RefreshToken");
const loginController = require("../controllers/Login");
const profileController = require("../controllers/Profile");
const newsController = require("../controllers/News");
const usersController = require("../controllers/Users");

router.post(registration, registrationController.postRegister);

router.post(refreshToken, refreshTokenController.postRefreshToken);

router.post(login, loginController.postLogin);

router.get(profile, profileController.getProfile);
router.patch(profile, profileController.patchProfile);

router.post(news, newsController.postNews);
router.get(news, newsController.getNews);
router.get(newsById, newsController.getNewsById);
router.patch(newsById, newsController.patchNewsById);
router.delete(newsById, newsController.deletehNewsById);

router.get(users, usersController.getUsers);
router.delete(userById, usersController.deleteUser);
router.patch(userByIdPermission, usersController.patchUserPermission);

module.exports = router;
