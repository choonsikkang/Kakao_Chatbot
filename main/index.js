const express = require("express");
const fs = require("fs");
const router = express.Router();
const { isKakao } = require("../middleware/check");
const { postCoffee } = require("./routes/coffee");
const { updateCoffee } = require("./routes/update");
const { deleteCoffee } = require("./routes/delete");
require("dotenv").config();

/* TODO 앞으로 만들고 싶은 카톡 챗봇의 방향 및 계획
    만들고 싶은 기능 MEMO
*/

/* NOTE 만들기 전에 block_id, intent_id로 들어오면, 어떠한 함수를 호출하려는 객체를 하나 선언해야한다.*/
const BLOCK = fs
    .readdirSync(`${__dirname}/routes`)
    .filter((name) => name !== "index.js")
    .map((name) => [name.split(".")[0], require(`${__dirname}/routes/${name}`)])
    .reduce((obj, [filename, func]) => ({ ...obj, [filename]: func }), {});
// line 19: obj라는 객체와 [filename, func]이라는 배열을 인자로 받고 obj는 구조분해할당으로 값을 펼치고, 배열안에 filename은 key, func은 value로 받고 새로운 객체에 담아 리턴한다.

const { route } = require("../assets/intent");

// (blockId, [title, sub])
// const blockIdMap = Object.entries(route).reduce((blockIdMap, [title, block]) => {
//     return Object.entries(block).reduce((blockIdMap, [sub, blockId]) => blockIdMap.set(blockId, [title, sub]), blockIdMap);
// }, new Map());

/* NOTE 하나의 API로 여러개의 발화들을 라우팅 */
router.post("/", isKakao, postCoffee, deleteCoffee, updateCoffee, async (req, res) => {
    // isKakao, postCoffee, updateCoffee, deleteCoffee,
    // TypeError: Cannot read property 'value' of undefined
    // 그니까 주문하기 기능에서 입력값이 없어서 에러가 나는 것 같고, 문법 오류도 앞에 값이 undefined라서 나는 것이다?

    // console.log(req.body);
    // console.log(BLOCK);
    // console.log(blockIdMap);
    // console.log(route);
    // console.log("Hello world");

    // const intentId = res.locals.kakao.intentId;
    // console.log(blockIdMap.set(intentId));
    // console.log(res.locals.route);
    // let [title, sub] = blockIdMap.get(intentId) || [res.locals.menu.route.title, res.locals.menu.route.sub];
    // console.log(blockIdMap.get(intentId));
    // console.log([title, sub]);

    /* NOTE for문으로 route의 값을 { route[i] : i } 으로 만듬 */
    let object = {};
    let intentId = "";
    for (let i in route) {
        object[route[i]] = i;
        intentId += `${route[i]}: ${i}` + "\n";
    }
    // console.log(intentId);
    console.log(object);

    // object의 key, value 값 가져오기
    let array = [];
    for (let [key, value] of Object.entries(object)) {
        console.log(`${key}, ${value}`);
        array.push(key, value);
    }

    /**
     * NOTE 함수를 가져오는 객체를 하나 더 만들어야 해😭
     * ex) 
     * {
        'postCoffee(실제 함수명)': postCoffee,
        'updateCoffee(실제 함수명)': updateCoffee
        }
     */

    let [title, sub] = array;
    const block = BLOCK && [title] && [sub];
    console.log(block);
    // // BLOCK?.[title]?.[sub];

    // // title, sub를 통해 routes에서 함수 추출(???)
    if (title && sub) {
        console.log(`Title: ${title}, Sub: ${sub}`);
    }

    // // 블록
    // if (block) {
    //     await block(req, res);
    // } else {
    //     const turingMsg = await sendTuringMsg(req.body);
    //     res.json(turingMsg);
    // }
});

/* NOTE 원하는 커피를 주문하고, 장바구니에 담은 것을 보여주는 주문 기능 */
router.post("/order", isKakao, postCoffee, async (req, res) => {});

/* NOTE 주문한 커피를 변경하고, 장바구니에 변경된 물품들을 보여주는 주문 기능 */
router.post("/modify", isKakao, updateCoffee, async (req, res) => {});

/* NOTE 장바구니에 있는 물품들을 전부 삭제 */
router.post("/order_cancel", isKakao, deleteCoffee, async (req, res) => {});

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
