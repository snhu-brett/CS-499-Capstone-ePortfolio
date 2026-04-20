const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

const buildTripPayload = (body = {}) => ({
  code: body.code?.trim(),
  name: body.name?.trim(),
  length: body.length?.trim(),
  start: body.start,
  resort: body.resort?.trim(),
  perPerson: Number(body.perPerson),
  image: body.image?.trim(),
  description: body.description?.trim()
});

const validateTripPayload = (trip) => {
  const missingFields = [];

  if (!trip.code) missingFields.push('code');
  if (!trip.name) missingFields.push('name');
  if (!trip.length) missingFields.push('length');
  if (!trip.start) missingFields.push('start');
  if (!trip.resort) missingFields.push('resort');
  if (!trip.image) missingFields.push('image');
  if (!trip.description) missingFields.push('description');

  if (trip.perPerson === undefined || trip.perPerson === null || Number.isNaN(trip.perPerson)) {
    missingFields.push('perPerson');
  }

  if (missingFields.length > 0) {
    return `Missing or invalid fields: ${missingFields.join(', ')}`;
  }

  return '';
};

const tripsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const search = req.query.search ? req.query.search.trim() : '';
    const sort = req.query.sort || 'nameAsc';

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { resort: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { name: 1 };

    if (sort === 'nameDesc') {
      sortOption = { name: -1 };
    } else if (sort === 'resortAsc') {
      sortOption = { resort: 1 };
    } else if (sort === 'resortDesc') {
      sortOption = { resort: -1 };
    }

    const skip = (page - 1) * limit;

    const trips = await Model.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await Model.countDocuments(query);

    return res.status(200).json({
      trips,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to retrieve trips', error: err.message });
  }
};

const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Model.findOne({ code: req.params.tripCode }).lean().exec();

    if (!trip) {
      return res.status(404).json({ message: 'Trip code not found' });
    }

    return res.status(200).json(trip);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to retrieve trip', error: err.message });
  }
};

const tripsAddTrip = async (req, res) => {
  try {
    const newTripData = buildTripPayload(req.body);
    const validationMessage = validateTripPayload(newTripData);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const existingTrip = await Model.findOne({ code: newTripData.code }).exec();
    if (existingTrip) {
      return res.status(409).json({ message: 'A trip with that code already exists' });
    }

    const newTrip = new Trip(newTripData);
    const savedTrip = await newTrip.save();

    return res.status(201).json(savedTrip);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to create trip', error: err.message });
  }
};

const tripsUpdateTrip = async (req, res) => {
  try {
    const updatedTripData = buildTripPayload(req.body);
    const validationMessage = validateTripPayload(updatedTripData);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const updatedTrip = await Model.findOneAndUpdate(
      { code: req.params.tripCode },
      updatedTripData,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(updatedTrip);
  } catch (err) {
    return res.status(500).json({ message: 'Unable to update trip', error: err.message });
  }
};

const tripsDeleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Model.findOneAndDelete({
      code: req.params.tripCode
    }).exec();

    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to delete trip', error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};