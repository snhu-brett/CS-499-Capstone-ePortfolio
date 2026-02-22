const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
  try {
    const q = await Model.find({}).exec();
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// GET: /trips/:tripCode - lists a single trip
const tripsFindByCode = async (req, res) => {
  try {
    const q = await Model.find({ code: req.params.tripCode }).exec();
    if (q.length === 0) {
      return res.status(404).json({ message: 'tripCode not found' });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// POST: /trips - Adds a new Trip
const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) {
      return res.status(400).json({ message: 'Unable to create trip' });
    } else {
      return res.status(201).json(q);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

// PUT: /trips/:tripCode - Updates an existing Trip
const tripsUpdateTrip = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body);

    const q = await Model
      .findOneAndUpdate(
        { code: req.params.tripCode },
        {
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        { new: true } // returns updated document
      )
      .exec();

    if (!q) {
      return res.status(400).json({ message: 'Trip not found or not updated' });
    } else {
      return res.status(201).json(q);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
