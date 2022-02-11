const express = require("express");
const fs = require("fs");
const router = express.Router();
const { isKakao } = require("../middleware/check");
const { postCoffee } = require("./routes/coffee");
const { updateCoffee } = require("./routes/update");
const { deleteCoffee } = require("./routes/delete");
require("dotenv").config();

/* TODO 앞으로 만들고 싶은 카톡 챗봇의 방향 및 계획
    1. 데이터베이스 관계를 다시 정립, user_id를 얻어오는 방법, coffee.js에 create할 때, product_id를 추가해주는 것
    2. 하나의 API로 분기하기 계획: route폴더로 coffee.js(주문하기 기능(create), 장바구니 기능(find)), update.js(주문한 내용을 변경하는 기능), delete.js(주문한 내용을 싹 삭제하는 기능) 
       등을 route 폴더로 이동, 즉, 어떤 api가 움직이면 실행되는 함수를 route폴더안에 이동
    ```
       const block = {
        "block_id": function a() {}
        "block_id": function b() {}
    }

    const func = block[req.body.userRequest.block.id];
    func() // 이 친구는 블록id에 대한 함수 값들을 출력하게 됨
    ````
*/
const Block = require("../assets/intent");

console.log(Block);

/* NOTE 원하는 커피를 주문하고, 장바구니에 담은 것을 보여주는 주문 기능 */
router.post("/order", isKakao, postCoffee, async (req, res) => {
    let arr = res.locals.menu;

    console.log("index log----------------------------------------------");
    console.log(req.body);
    console.log(arr); // DB에 있는 값들
    // console.log(res.locals.menu.name);

    /* NOTE fs 모듈 연습 => 에러, Error: EISDIR: illegal operation on a directory, read */
    // let BLOCK = fs.readFileSync("/home/kangjuhyeon/Kakao_Chatbot/assets", "utf-8", function (err, data) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         console.log(data);
    //     }
    // });
    // console.log(BLOCK);

    /* NOTE 객체 값을 보여주기 위한 로직을 만들어야 된다. */
    let text = "";
    for (category in arr) {
        var obj = arr[category];
        text += obj.name + " " + ">" + " " + obj.amount + "\n";
    }

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": `++장바구니++\n-----------------------------\n${text}개`
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
});

router.post("/modify", isKakao, updateCoffee, async (req, res) => {
    let arr = res.locals.menu;

    console.log(arr);

    /* NOTE 객체 값을 보여주기 위한 로직을 만들어야 된다. */
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

router.post("/order_cancel", deleteCoffee, async (req, res) => {
    console.log(req.body);

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
});

router.post("/total", async (req, res) => {
    console.log(req.body);

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": `합계 - 4500원`
                    }
                }
            ]
        }
    };
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
