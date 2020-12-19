const Park = require('../models/parks');
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}

module.exports.newParkForm = (req, res) => {
    res.render('parks/new');
}

module.exports.postPark = async (req, res, next) => {
    const newPark = new Park(req.body);
    newPark.image = req.files.map(f => ({url: f.path, filename: f.filename}));
    newPark.author = req.user._id; // add user id to park.author before we save
    await newPark.save();
    req.flash('success', 'successfully added a new park!');
    res.redirect(`/parks/${newPark._id}`);
  
}

module.exports.showPark = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // res.send(park.reviews);
    if(!park){
        req.flash('error', 'cannot find that park');
        return res.redirect('/parks');
    }
    res.render('parks/show', {park});
}

module.exports.editParkForm = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    if(!park){
        req.flash('error', 'cannot find that park');
        return res.redirect('/parks');
    }
    res.render('parks/edit', {park});
}
module.exports.editPark = async (req, res) =>{
    const { id } = req.params;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    const park = await Park.findByIdAndUpdate(id, req.body, 
        { runValidators: true, new: true });
    park.image.push(...imgs);
    await park.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await park.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'successfully updated campground');
    res.redirect(`/parks/${park._id}`);
}

module.exports.deletePark = async (req, res) => {
    const { id } = req.params;
    const deleted = await Park.findByIdAndDelete(id);
    req.flash('success', 'park is deleted!')
    res.redirect('/parks');
}