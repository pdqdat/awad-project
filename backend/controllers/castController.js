const Cast = require('../models/Cast');

exports.getCastById = async (req, res) => {
    try {
        const castId = parseInt(req.params.tmdb_id);
        const cast = await Cast.aggregate([
            { $match: { tmdb_id: castId } },
            { $unwind: "$movie_credits.cast" },
            { $sort: { "movie_credits.cast.popularity": -1 } },
            { $limit: 10 },
            { $group: {
                _id: "$_id",
                tmdb_id: { $first: "$tmdb_id" },
                adult: { $first: "$adult" },
                also_known_as: { $first: "$also_known_as" },
                biography: { $first: "$biography" },
                birthday: { $first: "$birthday" },
                deathday: { $first: "$deathday" },
                gender: { $first: "$gender" },
                homepage: { $first: "$homepage" },
                imdb_id: { $first: "$imdb_id" },
                known_for_department: { $first: "$known_for_department" },
                name: { $first: "$name" },
                place_of_birth: { $first: "$place_of_birth" },
                popularity: { $first: "$popularity" },
                profile_path: { $first: "$profile_path" },
                movie_credits: { $push: "$movie_credits.cast" }
            }},
            { $addFields: {
                "movie_credits.cast": { $slice: ["$movie_credits", 10] }
            }}
        ]);
        if (cast && cast.length > 0) {
            res.json(cast[0]);
        } else {
            res.status(404).send('Cast not found');
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
};
