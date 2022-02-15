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

    if (!update_basket) {
        return res.status(500);
    }

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

    /* NOTE 객체 값을 보여주기 위한 로직을 만들어야 된다. */
    let arr = res.locals.menu;
    let text = "";
    for (category in arr) {
        var obj = arr[category];
        console.log(obj);
        text += obj.name + " " + ">" + " " + obj.amount + "\n";
    }

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": `++장바구니++\n-----------------------------\n${text}`
                    }
                }
            ]
        }
    };
    res.status(200).send(responseBody);

    console.log(`update_basket : ${inspect(update_basket)}`);
    // next();
};
