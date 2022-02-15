require("dotenv").config();

module.exports = {
    "route": {
        "order": process.env.order_blockId,
        "modify": process.env.modify_blockId,
        "order_cancel": process.env.ordercancel_blockId,
        "menu": process.env.menu_blockId,
        "confirm": process.env.confirm_blockId
    }
};
