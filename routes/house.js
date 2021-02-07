const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, validateHouse, isHouseOwner} = require('../middleware');
const house = require('../controllers/house');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});

router.route('/')
  .get(wrapAsync(house.showAllHouses))
  .post(isLoggedIn,upload.array('image'), validateHouse, wrapAsync(house.createHouse));

router.get('/new',isLoggedIn,house.renderNewHouseForm);

router.get('/:id/edit',isLoggedIn,isHouseOwner, wrapAsync(house.renderUpdateHouseForm));

router.route('/:id')
  .get(wrapAsync(house.showHouse))
  .put(isLoggedIn,isHouseOwner,upload.array('image'), validateHouse, wrapAsync(house.updateHouse))
  .delete(isLoggedIn,isHouseOwner, wrapAsync(house.deleteHouse));


module.exports = router;