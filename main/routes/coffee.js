const { inspect } = require("util");
const { basket, coffee } = require("../../models");

exports.postCoffee = async (req, res, next) => {
    const kakao = res.locals.kakao;

    console.log(kakao.action);
    console.log(req.body);
    console.log("kakao log==================================");
    try {
        let box = await basket.findOrCreate({
            where: { name: req.body.action.detailParams.coffee_name.value },
            defaults: {
                name: req.body.action.detailParams.coffee_name.value,
                amount: req.body.action.detailParams.CupCount.origin
            }
        });

        if (!box) {
            return res.status(500);
        }

        let menu = await basket
            .findAll({
                // include: [
                //     {
                //         model: coffee,
                //         attributes: ["product_id"],
                //         where: { price: res.locals.price }
                //     }
                // ],
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
        // throw new Error("Some unexpected error, may also be thrown by a library or the runtime.");
        console.error(err);
    }
};
