require("dotenv").config();

module.exports = {
    "route": {
        "order": process.env.order_blockId,
        "menu": process.env.menu_blockId,
        "confirm": process.env.confirm_blockId
    }
};
