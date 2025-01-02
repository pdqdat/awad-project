const Cast = require('../models/Cast');

exports.getCastById = async (req, res) => {
    try {
        const cast = await Cast.findOne({ tmdb_id: req.params.tmdb_id });
        if (cast) {
            res.json(cast);
        } else {
            res.status(404).send('Cast not found');
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
};
