"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_TYPE = exports.ORDER_STATUS = exports.ORDER_TYPE = exports.BUSINESS_ORDER_TYPE = void 0;
var BUSINESS_ORDER_TYPE;
(function (BUSINESS_ORDER_TYPE) {
    BUSINESS_ORDER_TYPE["deliveryOnly"] = "deliveryOnly";
    BUSINESS_ORDER_TYPE["both"] = "both";
})(BUSINESS_ORDER_TYPE = exports.BUSINESS_ORDER_TYPE || (exports.BUSINESS_ORDER_TYPE = {}));
var ORDER_TYPE;
(function (ORDER_TYPE) {
    ORDER_TYPE["pickup"] = "pickup";
    ORDER_TYPE["delivery"] = "delivery";
})(ORDER_TYPE = exports.ORDER_TYPE || (exports.ORDER_TYPE = {}));
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["delivered"] = "delivered";
    ORDER_STATUS["in_progress"] = "in_progress";
    ORDER_STATUS["new"] = "new";
    ORDER_STATUS["marked_ready_for_delivery"] = "marked_ready_for_delivery";
    ORDER_STATUS["marked_ready_for_pickup"] = "marked_ready_for_pickup";
    ORDER_STATUS["cancelled"] = "cancelled";
    ORDER_STATUS["accepted_by_driver"] = "accepted_by_driver";
    ORDER_STATUS["all"] = "all orders";
    ORDER_STATUS["picked_up_by_driver"] = "picked_up_by_driver";
    ORDER_STATUS["picked_up_by_client"] = "picked_up_by_client";
})(ORDER_STATUS = exports.ORDER_STATUS || (exports.ORDER_STATUS = {}));
var NOTIFICATION_TYPE;
(function (NOTIFICATION_TYPE) {
    NOTIFICATION_TYPE["new_order"] = "new order";
    NOTIFICATION_TYPE["ready_for_delivery"] = "ready_for_delivery";
    NOTIFICATION_TYPE["order_updated"] = "order_updated";
    NOTIFICATION_TYPE["new_delivery"] = "new_delivery";
})(NOTIFICATION_TYPE = exports.NOTIFICATION_TYPE || (exports.NOTIFICATION_TYPE = {}));
//# sourceMappingURL=typing.js.map