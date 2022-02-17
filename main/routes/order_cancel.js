const { inspect } = require("util");
const { basket } = require("../../models");

exports.deleteCoffee = async (req, res) => {
    const delete_basket = await basket
        .destroy({
            where: {},
            truncate: true
        })
        .then(() => {
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
        })
        .catch((err) => {
            console.log("삭제 Error: ", err);
        });

    console.log(`delete_basket : ${inspect(delete_basket)}`);
};
