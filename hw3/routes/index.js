const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const adminController = require("../controllers/admin");
const loginontroller = require("../controllers/login");
const emailController = require("../controllers/email");
const {
	adminRoute,
	homeRoute,
	loginRoute,
	adminSkillsRooute,
	adminUploadRoute,
	emailRoute,
} = require("./routes");

router.get(homeRoute, homeController.get);

router.get(loginRoute, loginontroller.get);
router.post(loginRoute, loginontroller.post);

router.get(adminRoute, adminController.get);
router.post(adminSkillsRooute, adminController.skillsPost);
router.post(adminUploadRoute, adminController.uploadPost);

router.post(emailRoute, emailController.post);

module.exports = router;
