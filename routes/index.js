const express = require("express");
const { inspect } = require("util");
const router = express.Router();
const { isKakao } = require("../middleware/check");
const { postCoffee } = require("../middleware/coffee");

/* TODO: 맨 처음 채널을 추가하고 웰컴 블록이 등장 후, 아무 말이나 입력했을 때, 
사용자가 어떤 발화를 사용할 수 있는지 도와주는 폴백블록 */
router.post("/help", (req, res) => {
    console.log(req.body);

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": "아래 단어들을 보고, 원하는 단어를 클릭해주세요🤗"
                    }
                }
            ],
            "quickReplies": [
                {
                    "messageText": "주문방법",
                    "action": "message",
                    "label": "주문방법"
                },
                {
                    "messageText": "메뉴판",
                    "action": "message",
                    "label": "메뉴판"
                },
                {
                    "messageText": "주문할게요",
                    "action": "message",
                    "label": "주문할게요"
                },
                {
                    "messageText": "안녕",
                    "action": "message",
                    "label": "안녕"
                },
                {
                    "messageText": "안녕안녕",
                    "action": "message",
                    "label": "안녕안녕"
                }
            ]
        }
    };
    res.status(200).send(responseBody);
});

/* TODO 원하는 커피를 어떻게 주문할 것인지를 알려주는 가이드 */
router.post("/how", (req, res) => {
    console.log(req.body);

    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    basicCard: {
                        title: "주문할게요",
                        description: "메뉴를 말하면 바로 주문이 시작되어요",
                        thumbnail: {
                            imageUrl: "https://t2.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/1oU7/image/ZttOOUGN88HuP5FXYMBzrWowP_c.png"
                        },
                        buttons: [
                            {
                                action: "message",
                                label: "주문하는 방법",
                                messageText: "주문하는 방법"
                            },
                            {
                                action: "webLink",
                                label: "구경하기",
                                webLinkUrl: "https://e.kakao.com/t/hello-ryan"
                            }
                        ]
                    }
                }
            ]
        }
    };

    res.status(200).send(responseBody);
});

/* TODO 원하는 커피를 주문하고, 장바구니에 담은 것을 보여주는 주문 기능 */
router.post("/order", isKakao, postCoffee, async (req, res) => {
    let arr = res.locals.menu;
    console.log(req.body);
    // console.log(res.locals.kakao);
    // console.log(res.locals.menu);
    // console.log(req.body.action);
    console.log(req.body.action);

    /* for문으로 arr객체에 key-value값을 순차적으로 뽑아봤음 */
    for (let key in arr) {
        let personObj = arr[key];
        console.log(key + ", " + personObj.name + ", " + personObj.amount);
    }

    /* map함수를 리터럴 함수에 사용하지않고, 값을 가져왔음 */
    const map = arr.map((m) => `${m.name} ${m.amount}`);
    console.log(map);

    /* 위에 name, amount의 중복값을 제거하기 위해 Set함수를 사용했다.
    하지만 결과는 '아이스 아메리카노 2'와 '아이스 아메리카노 3'는 다른 값이었다.*/
    let set = Array.from(new Set(map));
    console.log(set);
    /* 위와 마찬가지 중복 값을 제거하기 위해 filter함수를 사용했지만 결과는 같다. */
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
                    "messageText": "이대로 주문하시겠어요?",
                    "action": "message",
                    "label": "주문 끝"
                },
                {
                    "messageText": "아직 개발단계예요😭",
                    "action": "message",
                    "label": "같은 음료 추가"
                }
            ]
        }
    };
    console.log(`++장바구니++\n------------------------------------\n${res.locals.menu.map((m) => `${m.name} > ${m.amount}`).join("\n")}`);
    res.status(200).send(responseBody);
});

/* TODO 카페의 메뉴 카테고리를 볼 수 있는 기능 */
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

/* TODO 카페의 메뉴 카테고리를 클릭하면 나오는 메뉴판 기능 */
router.post("/coffee", (req, res) => {
    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "carousel": {
                        "type": "listCard",
                        "items": [
                            {
                                "header": {
                                    "title": "샌드위치"
                                },
                                "items": [
                                    {
                                        "title": "햄치즈",
                                        "description": "4,500원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_01.jpg"
                                    },
                                    {
                                        "title": "베이컨 아보카도",
                                        "description": "5,500원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_02.jpg"
                                    },
                                    {
                                        "title": "에그 포테이토",
                                        "description": "5,300원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_03.jpg"
                                    },
                                    {
                                        "title": "갈릭 베이컨 토마토",
                                        "description": "5,800원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_04.jpg"
                                    }
                                ],
                                "buttons": [
                                    {
                                        "label": "더보기",
                                        "action": "message",
                                        "messageText": "샌드위치 더보기"
                                    }
                                ]
                            },
                            {
                                "header": {
                                    "title": "커피"
                                },
                                "items": [
                                    {
                                        "title": "아메리카노(ice, hot 가격동일)",
                                        "description": "2,000원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_05.jpg"
                                    },
                                    {
                                        "title": "카페라떼",
                                        "description": "3,000원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_06.jpg"
                                    },
                                    {
                                        "title": "카페모카",
                                        "description": "3,500원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_07.jpg"
                                    },
                                    {
                                        "title": "바닐라 라떼",
                                        "description": "3,500원",
                                        "imageUrl": "https://t1.kakaocdn.net/openbuilder/docs_image/02_img_08.jpg"
                                    }
                                ],
                                "buttons": [
                                    {
                                        "label": "더보기",
                                        "action": "message",
                                        "messageText": "커피 더보기"
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            "quickReplies": [
                {
                    "messageText": "인기 메뉴",
                    "action": "message",
                    "label": "인기 메뉴"
                },
                {
                    "messageText": "최근 주문",
                    "action": "message",
                    "label": "최근 주문"
                },
                {
                    "messageText": "장바구니",
                    "action": "message",
                    "label": "장바구니"
                }
            ]
        }
    };
    res.status(200).send(responseBody);
});

/* TODO 카카오 챗봇 공식문서를 활용한 API(연습) */
router.post("/showHello", (req, res) => {
    console.log(req.body);
    console.log(inspect(req.body, { depth: Infinity, colors: true }));

    // const responseBody = {
    //     version: "2.0",
    //     template: {
    //         outputs: [
    //             {
    //                 simpleImage: {
    //                     imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
    //                     altText: "hello I'm Ryan"
    //                 }
    //             }
    //         ]
    //     }
    // };

    res.status(200).send(responseBody);
});

module.exports = router;
