const { inspect } = require("util");
const { basket } = require("../../models");

exports.deleteCoffee = async (req, res, next) => {
    console.log(req.body);

    const delete_basket = await basket.destroy({
        where: {},
        truncate: true
    });
    // res.locals.delete_basket = delete_basket;

    // if (!delete_basket) {
    //     return res.status(500);
    // }

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": `++장바구니++\n-----------------------------\n 주문내역이 없습니다. \n`
                    }
                }
            ]
        }
    };
    res.status(200).send(responseBody);

    console.log(`delete_basket :${inspect(delete_basket)}`);
    // next();
};
