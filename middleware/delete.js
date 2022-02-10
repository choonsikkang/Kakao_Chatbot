const { inspect } = require("util");
const { basket } = require("../models");

exports.deleteCoffee = async (req, res, next) => {
    console.log(req.body);
    const delete_basket = await basket.destroy({
        where: {},
        truncate: true
    });

    res.locals.delete_basket = delete_basket;

    console.log(`delete_basket :${inspect(delete_basket)}`);
    next();
};
