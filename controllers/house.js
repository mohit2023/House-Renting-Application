const House = require('../models/house');


module.exports.showAllHouses = async (req,res) =>{
  const houses = await House.find({});
  res.render('houses/index',{houses});
};

module.exports.renderNewHouseForm = (req,res) =>{
  res.render('houses/new');
};

module.exports.createHouse = async (req,res) =>{
  const house = new House(req.body.house);
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
  await House.findByIdAndUpdate(id,{...req.body.house});
  req.flash('success','Successfully updated the House');
  res.redirect(`/houses/${id}`);
};

module.exports.deleteHouse = async (req,res) =>{
  const {id} = req.params;
  await House.findByIdAndDelete(id);
  req.flash('success','Successfully deleted the House');
  res.redirect('/houses');
};