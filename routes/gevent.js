const express = require('express');
const router = express.Router();
const Gevent = require('../models/Gevent');

function result(succ, msg, details) {
  if (details) {
    return {
      success: succ,
      message: msg,
      data: details,
    };
  } else {
    return {
      success: succ,
      message: msg,
    };
  }
}

router.get('/', async (req, res) => {
  try {
    const gevent = await Gevent.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $set: {
          id: '$_id',
          username: { $arrayElemAt: ['$userData.username', 0] },
        },
      },
      {
        $project: {
          userData: 0,
          _id: 0,
        },
      },
    ]);

    if (gevent.length > 0) {
      res.status(200).json(result(1, 'Retrieve Data Success!', gevent));
    } else {
      res.status(404).json(result(0, 'Zero Data!'));
    }
  } catch (error) {
    res.status(500).json(result(0, error.message));
  }
});

router.post('/', async (req, res) => {
    const inputGevent = new Gevent({
      nama_event: req.body.nama_event,
      alamat: req.body.alamat,
      deskripsi: req.body.deskripsi,
      user_id: req.body.user_id,
    });

    try{
    const gevent = await inputGevent.save();
    res.status(200).json(result(1, 'Insert Gevent Success!'));
    } catch (error) {
    res.status(500).json(result(0, error.message));
    }
});

router.put('/', async (req, res) => {
    const data = {
      id: req.body.id,
      nama_event: req.body.nama_event,
      alamat: req.body.alamat,
      deskripsi: req.body.deskripsi,
    }
    try{
    const gevent = await Gevent.updateOne(
      {
        _id: data.id,
      },
      data
    );

    if (gevent.matchedCount > 0) {
      res.status(200).json(result(1, 'Update Gevent Success!'));
    } else {
      res.status(200).json(result(0, 'Update Gevent Failed!'));
    }
  } catch (error) {
    res.status(500).json(result(0, error.message));
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const gevent = await Gevent.deleteOne({
      _id: req.params.id,
    });

    if (gevent.deletedCount > 0) {
      res.status(200).json(result(1, 'Delete Gevent Success!'));
    } else {
      res.status(200).json(result(0, 'Delete Gevent Failed!'));
    }
  } catch (error) {
    res.status(500).json(result(0, error.message));
  }
});

module.exports = router;