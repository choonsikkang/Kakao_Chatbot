const express = require("express");
const router = express.Router();
const { isKakao } = require("../middleware/check");
const { postCoffee } = require("../middleware/coffee");
require("dotenv").config();

/* TODO 앞으로 만들고 싶은 카톡 챗봇의 방향 및 계획
    1. baskets Table에 name값이 하나씩만 들어가고 amount값만 update 되는 형태로 만들고 싶다.
    2. 챗봇이 장바구니 답변을 {key}:{value} 형식으로만 나오게 하여 중복을 없애고 싶다.
    3. amount값을 DB에서 COUNT함수로 이 커피종류를 몇 잔을 시켰는지 연산시켜서 값을 받고 싶다. ex) 아이스 아메리카노 (2개+2개 = SUM, 누적갯수) 
    4. "주문 끝" 바로가기 버튼을 누르면 "이대로 주문하시겠어요?"가 나오고, "네"를 눌렀을 때, "합계 - ???원" 이런식으로 대화의도가 흘러갔으면 좋겠다. 
    5. 하나의 API로 여러개의 발화를 분기하는 법을 알고싶다. ex) "/" => "/order", "/help", "/menu"
*/

/* NOTE 원하는 커피를 주문하고, 장바구니에 담은 것을 보여주는 주문 기능 */
router.post("/order", isKakao, postCoffee, async (req, res) => {
    let arr = res.locals.menu;

    console.log("index log----------------------------------------------");
    console.log(req.body);
    console.log(arr); // DB에 있는 값들

    /* NOTE 객체의 값을 key와 value로 확인하고 싶었다. */
    // for (let i in arr) {
    //     console.log(i); // 0
    //     console.log(arr[i]); // 객체가 나옴
    //     console.log(Object.keys(arr[i]));
    //     for (let j in arr[i]) {
    //         console.log(j); // key 값
    //         console.log(arr[i][j]); // value 값
    // }
    // }

    /* NOTE js의 reduce함수를 사용해서 객체에 key값을 넣어주는 로직이다. (연습) */
    // function groupBy(objectArray, property) {
    //     return objectArray.reduce(function (accumulator, currentObj) {
    //         var key = currentObj[property];
    //         console.log(`key : ${key}`);
    //         if (!accumulator[key]) {
    //             accumulator[key] = [];
    //         }
    //         accumulator[key].push(currentObj);
    //         return accumulator;
    //     }, {});
    // }

    // var groupedPeople = groupBy(arr, "name");
    // console.log(`groupedPeople : ${JSON.stringify(groupedPeople)}`);

    /* NOTE map함수를 리터럴 함수에 사용하지않고, 값을 가져왔음 */
    const map = arr.map((m) => `${m.name} ${m.amount}`);
    console.log(map);

    /* NOTE 위에 name, amount의 중복값을 제거하기 위해 Set함수를 사용했다.
    하지만 결과는 '아이스 아메리카노 2'와 '아이스 아메리카노 3'는 다른 값이었다.*/
    let set = Array.from(new Set(map));
    console.log(set);

    /* NOTE 위와 마찬가지 중복 값을 제거하기 위해 filter함수를 사용했지만 결과는 같다. */
    // let filterArr = map.filter((el, index) => {
    //     return map.indexOf(el) === index;
    // });

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": `++장바구니++\n------------------------------------\n${set.join("\n")}`
                    }
                }
            ],
            "quickReplies": [
                {
                    // "messageText": "이대로 주문하시겠어요?",
                    "action": "block",
                    "label": "주문 끝",
                    "blockId": process.env.confirm_blockId
                },
                {
                    "messageText": "아직 개발단계예요😭",
                    "action": "message",
                    "label": "같은 음료 추가"
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
