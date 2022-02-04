const express = require('express');
const { coffee, basket } = require('../models');
const router = express.Router();


/* TODO: 맨 처음 채널을 추가하고 웰컴 블록이 등장 후, 아무 말이나 입력했을 때, 
사용자가 어떤 발화를 사용할 수 있는지 도와주는 폴백블록을 제공해주려고 만든다.
*/
router.post('/help', (req, res) => {
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
      }
    res.status(200).send(responseBody);
  });
  
  router.post('/how', (req, res) => {
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
                  action:  "webLink",
                  label: "구경하기",
                  webLinkUrl: "https://e.kakao.com/t/hello-ryan"
                }
              ]
            }
          }
          
        ]
      }
    }
  
      res.status(200).send(responseBody);
    });
  
  // TODO Anchors Test
  router.post('/order', async (req, res) => {
    console.log(req.body.name);
    console.log(basket);
    console.log(coffee);
    
    const cart = await basket.create({
        name: req.body.name,  // 커피 종류를 넣어서 장바구니에 추가
        amount: req.body.amount, // 커피를 몇 개 마실지 카운팅
    });
    console.log(cart);

    const responseBody = await basket.findAll({
        name: req.body.name,
        amount: req.body.amount
    })
    console.log(responseBody);
  //   const responseBody = {
  //     version: "2.0",
  //     template: {
  //         outputs: [
  //             {
  //                 simpleText: {
  //                     // text: "아직 주문이 안돼요. 개발중입니다.😭"
  //                     text: '++장바구니++\n------------------------------------\n아이스 아메리카노 > 1개'
  //                 }
  //             }
  //         ]
  //     }
  // }
    res.status(200).send({ message: `++장바구니++\n------------------------------------\n${req.body.name} ${req.body.amount}개` });
  });
  
  // TODO Anchors Test
  router.post('/menu', (req, res) => {
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
      }
    res.status(200).send(responseBody);
  });
  
  router.post('/coffee', (req, res) => {
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
                    "messageText" : "샌드위치 더보기"
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
                    "messageText" : "커피 더보기"
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
  }
    res.status(200).send(responseBody);
  });
  
  
  router.post('/showHello', (req, res) => {
      console.log(req.body);
    
      const responseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              simpleImage: {
                imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
                altText: "hello I'm Ryan"
              }
            }
          ]
        }
      };
    
      res.status(200).send(responseBody);
    });

module.exports = router;