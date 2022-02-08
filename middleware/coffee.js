const { inspect } = require("util");
const { basket, sequelize } = require("../models");

exports.postCoffee = async (req, res, next) => {
    const kakao = res.locals.kakao;

    const box = await basket
        .create({
            name: req.body.action.detailParams.coffee_name.value, // 사용자의 발화를 디비에 저장하는 것이 옳은것인지?
            amount: req.body.action.detailParams.CupCount.origin
        })
        .catch((error) => {
            console.error(error);
        });

    if (!box) {
        return res.status(500);
    }

    if (kakao.name && kakao.amount) {
        const result = await basket.count({
            where: {
                name: kakao.name
            }
        });
        console.log("--------------------Count :", result);
    }

    let menu = await basket
        .findAll({
            where: {},
            attrbutes: [[sequelize.fn("COUNT", sequelize.col("amount"))]],
            name: kakao.name,
            amount: kakao.amount
        })
        .then((res) => {
            console.log(res);
            return res.map((m) => {
                console.log(m.dataValues);
                return m.dataValues;
            });
        });

    res.locals.menu = menu;

    console.log(`Coffee :${inspect(menu)}`);
    next();
};
