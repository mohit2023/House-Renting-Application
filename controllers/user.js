const User = require('../models/user');


module.exports.renderRegisterForm = (req,res)=>{
  res.render('users/register');
};

module.exports.register = async (req,res)=>{
  try{
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        req.flash('success', 'Welcome to house renting application');
        res.redirect(redirectUrl);
    })
  }
  catch(e){
    req.flash('error', e.message);
    res.redirect('register');
  }
};

module.exports.renderLoginForm = (req,res)=>{
  res.render('users/login');
};

module.exports.login = async (req,res)=>{
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', "Bye!! Have a nice day!");
  res.redirect('/');
};