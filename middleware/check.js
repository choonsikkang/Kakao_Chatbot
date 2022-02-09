const { inspect } = require("util");
require("dotenv").config();
// const BOT_ID = [process.env.BOT_ID];

exports.isKakao = (req, res, next) => {
    if (!req.body) {
        console.error(`body 값이 존재하지 않습니다.`);
        return res.status(400).json({
            result: false,
            message: "body 값이 존재하지 않습니다."
        });
    }

    if (!(req.body.intent && req.body.userRequest && req.body.userRequest.user && req.body.userRequest.utterance)) {
        console.error("필수값이 존재하지 않습니다.");
        console.log(req.body);
        return res.status(400).json({
            result: false,
            msg: "필수값이 존재하지 않습니다."
        });
    }

    /* TODO 사용자의 intentId, userId, text가 담긴 데이터를 가공 */
    res.locals.kakao = {
        intentId: req.body.intent.id,
        action: req.body.action.params.coffee_name,
        userId: req.body.userRequest.user.id,
        text: req.body.userRequest.utterance
    };

    /* KAKAO : 가공된 데이터 출력 */
    console.log(`KAKAO : ${inspect(res.locals.kakao)}`);
    next();
};
