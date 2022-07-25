const { Router } = require("express");
const {
  getCat,buyProduct,sendMail,checkUnique,getVerified,getProfile,chooseCat,getFirst
} = require("../controllers/userController");
const router = Router();

router.get('/', getCat, getFirst, chooseCat, getProfile, getVerified);

router.post('/', checkUnique, buyProduct, sendMail);


module.exports = {
  router: router
}