const { inspect } = require("util");
const { basket } = require("../models");

exports.postCoffee = async (req, res, next) => {
    const kakao = res.locals.kakao;

    console.log(kakao.action);
    console.log(req.body);
    console.log(req.body.action.detailParams.coffee_name.value);
    console.log("kakao log==================================");
    try {
        let box = await basket
            .create({
                name: req.body.action.detailParams.coffee_name.value,
                amount: req.body.action.detailParams.CupCount.origin
            })
            .catch((err) => {
                console.error(err);
                // console.log(err.name);
                // console.log(err.message);
                // console.log(err.stack);
                if (err instanceof SequelizeUniqueConstraintError) {
                    console.log(e.name + ", " + e.message);
                }

                if (err instanceof ER_DUP_ENTRY) {
                    console.log(e.name + ", " + e.message);
                }
            });

        if (!box) {
            return res.status(500);
        }

        // if (kakao.name && kakao.amount) {
        //     const result = await basket.count({
        //         where: {
        //             name: kakao.name
        //         }
        //     });
        //     console.log("--------------------Count :", result);
        // }

        let menu = await basket
            .findAll({
                attributes: ["name", "amount"],
                where: {}
                // name: kakao.name,
                // amount: kakao.amount
            })
            .then((res) => {
                console.log("조회 성공: ", res);
                return res.map((m) => {
                    return m.dataValues;
                });
            });

        res.locals.menu = menu;

        console.log(`Coffee :${inspect(menu)}`);
        next();
    } catch (err) {
        /* NOTE ER_DUP_ENTRY (unique key)에 대한 에러핸들링 구현해보기 */

        // 에러를 발생시킨다고 한다.
        throw new Error("Some unexpected error, may also be thrown by a library or the runtime.");
        // console.error(err);
    }
};
