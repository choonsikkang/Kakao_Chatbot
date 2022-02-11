const { inspect } = require("util");
const { basket } = require("../../models");

exports.updateCoffee = async (req, res, next) => {
    console.log(req.body);

    const update_basket = await basket
        .update(
            {
                name: req.body.action.detailParams.coffee_name.value,
                amount: req.body.action.detailParams.CupCount.origin
            },
            {
                where: {
                    name: req.body.action.detailParams.coffee_name.value
                }
            }
        )
        .catch((err) => {
            console.log(err);
        });

    let menu = await basket
        .findAll({
            attributes: ["name", "amount"],
            where: {}
        })
        .then((res) => {
            console.log("조회 성공: ", res);
            return res.map((m) => {
                return m.dataValues;
            });
        })
        .catch((err) => {
            console.log(err);
        });

    res.locals.menu = menu;

    console.log(`update_basket : ${inspect(update_basket)}`);
    next();
};
