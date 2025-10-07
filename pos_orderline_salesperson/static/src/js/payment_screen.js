odoo.define('point_of_sale_screens', function (require) {
    "use strict";

    const screens = require('point_of_sale.screens');
    const core = require('web.core');
    

    const _t = core._t;

    screens.PaymentScreenWidget.include({

        order_is_valid_salesperson: function () {
            const self = this;
            const order = this.pos.get_order();
            const exist_order_without_salesperson = order.get_orderlines().filter((item)=>{
                return !Boolean(item.get_salesperson());
            })

            if (
                Boolean(this.pos.config.mandatory_salesperson) && 
                exist_order_without_salesperson.length > 0
            ) {
                this.gui.show_popup('error', {
                    'title': _t('Empty salesperson'),
                    'body': _t('All orderline must have the salesperson before it can be validated'),
                });
                return false;
            }
            return true;
        },

        validate_order: function (force_validation) {
            if(!this.order_is_valid_salesperson()) {
                return false;
            }
            this._super(force_validation);
        },

    });

});