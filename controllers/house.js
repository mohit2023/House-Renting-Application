const House = require('../models/house');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.showAllHouses = async (req,res) =>{
  const houses = await House.find({}).populate('popupText');
  res.render('houses/index',{houses});
};

module.exports.renderNewHouseForm = (req,res) =>{
  res.render('houses/new');
};

module.exports.createHouse = async (req,res) =>{
  const geoData = await geocoder.forwardGeocode({
    query: req.body.house.address,
    limit: 1
  }).send();
  const house = new House(req.body.house);
  house.geometry = geoData.body.features[0].geometry;
  house.images = req.files.map(f => ({url: f.path,filename: f.filename}));
  house.owner = req.user._id;
  await house.save();
  req.flash('success','Successfully created a new House');
  res.redirect(`/houses/${house._id}`);
};

module.exports.showHouse = async (req,res) =>{
  const {id} = req.params;
  const house = await House.findById(id).populate({path:'reviews',populate:{path:'owner'}}).populate('owner');
  if(!house){
    req.flash('error','Cannot find the house');
    return res.redirect('/houses');
  }
  res.render('houses/show',{house});
};

module.exports.renderUpdateHouseForm = async (req,res)=>{
  const {id} = req.params;
  const house = await House.findById(id);
  res.render('houses/edit',{house});
};

module.exports.updateHouse = async (req,res) =>{
  const {id} = req.params;
  const imgs = req.files.map(f => ({url: f.path,filename: f.filename}));
  const geoData = await geocoder.forwardGeocode({
    query: req.body.house.address,
    limit: 1
  }).send();
  const geom = geoData.body.features[0].geometry;
  const house = await House.findByIdAndUpdate(id,{...req.body.house,$push: { "images": { $each: imgs}},geometry:geom},{new:true});
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
    }
    await house.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  req.flash('success','Successfully updated the House');
  res.redirect(`/houses/${id}`);
};

module.exports.deleteHouse = async (req,res) =>{
  const {id} = req.params;
  await House.findByIdAndDelete(id);
  req.flash('success','Successfully deleted the House');
  res.redirect('/houses');
};