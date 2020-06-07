const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const adminController = require("../controllers/admin");
const loginontroller = require("../controllers/login");
const {
	adminRoute,
	homeRoute,
	loginRoute,
	adminSkillsRooute,
	adminUploadRoute,
} = require("./routes");

router.get(homeRoute, homeController.get);

router.get(loginRoute, loginontroller.get);
router.post(loginRoute, loginontroller.post);

router.get(adminRoute, adminController.get);
router.post(adminSkillsRooute, adminController.skillsPost);
router.post(adminUploadRoute, adminController.uploadPost);

module.exports = router;
