const express = require("express");
const router = express.Router();
const { inspect } = require("util");
const { route } = require("../assets/intent");
const { postCoffee } = require("./routes/order");
const { updateCoffee } = require("./routes/order_change");
const { deleteCoffee } = require("./routes/order_cancel");
require("dotenv").config();

/* NOTE 하나의 API로 여러개의 발화들을 라우팅 */
router.post("/", async (req, res) => {
    console.log(inspect(req.body, { depth: Infinity }));

    const intent = route[req.body.userRequest.block.id];
    console.log(intent);

    const functions = {
        /* NOTE 원하는 커피를 주문하고, 장바구니에 담은 것을 보여주는 주문 기능 */
        "postCoffee": (req, res) => {
            postCoffee(req, res);
            console.log("hello world");
        },
        /* NOTE 주문한 커피를 변경하고, 장바구니에 변경된 물품들을 보여주는 주문 기능 */
        "updateCoffee": (req, res) => {
            updateCoffee(req, res);
            console.log("hello world");
        },
        /* NOTE 장바구니에 있는 물품들을 전부 삭제 */
        "deleteCoffee": (req, res) => {
            deleteCoffee(req, res);
            console.log("hello world");
        }
    };

    functions[intent](req, res);
});

/* NOTE 주문하기 기능이 끝나고 주문을 더 이상 하지 않으면 주문 끝이라고 확인시키는 버튼 */
router.post("/confirm", async (req, res) => {
    console.log(req.body);

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": "이대로 주문하시겠어요?"
                    }
                }
            ],
            "quickReplies": [
                {
                    "messageText": "아직 개발단계예요😭",
                    "action": "block",
                    "label": "네",
                    "blockId": "620378a6898c0b33ba3f3233"
                },
                {
                    "messageText": "아직 개발단계예요😭",
                    "action": "message",
                    "label": "아니요"
                }
            ]
        }
    };
    res.status(200).send(responseBody);
});

/* NOTE 카페의 메뉴 카테고리를 볼 수 있는 기능 
quickReplies 응답 기능이 시나리오에 없는 것 같아서 스킬서버 응답을 사용 중 */
router.post("/menu", (req, res) => {
    console.log(req.body);

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": "안녕 난 애기 메뉴판!😁"
                    }
                }
            ],
            "quickReplies": [
                {
                    "messageText": "커피",
                    "action": "message",
                    "label": "커피"
                },
                {
                    "messageText": "음료",
                    "action": "message",
                    "label": "음료"
                },
                {
                    "messageText": "스페셜",
                    "action": "message",
                    "label": "스페셜"
                },
                {
                    "messageText": "차",
                    "action": "message",
                    "label": "차"
                }
            ]
        }
    };
    res.status(200).send(responseBody);
});

module.exports = router;
