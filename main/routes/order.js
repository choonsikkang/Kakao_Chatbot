const { inspect } = require("util");
const { basket } = require("../../models");

exports.postCoffee = async (req, res) => {
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
                attributes: ["name", "amount"],
                where: {}
            })
            .then((res) => {
                console.log("조회 성공: ", res);
                return res.map((m) => {
                    return m.dataValues;
                });
            });

        res.locals.menu = menu;

        /* NOTE 객체 값을 보여주기 위한 로직을 만들어야 된다. */
        let arr = res.locals.menu;
        let obj = {};
        let text = "";
        for (category in arr) {
            // var obj = arr[category];
            obj = Object.assign(arr[category]);
            console.log(obj);
            text += obj.name + " " + ">" + " " + obj.amount + "개" + "\n";
        }

        const responseBody = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": `++장바구니++\n-----------------------------\n${text}`
                        }
                    },
                    {
                        "simpleText": {
                            "text": `합계 - 4500원`
                        }
                    }
                ],
                "quickReplies": [
                    {
                        "action": "block",
                        "label": "주문 끝",
                        "blockId": process.env.confirm_blockId
                    },
                    {
                        "action": "block",
                        "label": "주문 수정하기",
                        "blockId": process.env.modify_blockId
                    }
                ]
            }
        };
        res.status(200).send(responseBody);

        console.log(`Coffee :${inspect(menu)}`);
    } catch (err) {
        // 에러를 발생시킨다고 한다.
        // throw new Error("Some unexpected error, may also be thrown by a library or the runtime.");
        console.error(err);
    }
};
