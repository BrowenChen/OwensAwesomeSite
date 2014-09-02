
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('home');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};


exports.bio = function(req, res) { 
	res.render('bio');
}


exports.portfolio = function(req, res){
	res.render('portfolio');
}