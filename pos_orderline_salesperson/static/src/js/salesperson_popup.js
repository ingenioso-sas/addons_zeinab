odoo.define('pos_orderline_salesperson.salesperson_popup', function (require) {
"use strict";

    const gui = require('point_of_sale.gui');
    const PopupWidget = require('point_of_sale.popups');
    const core = require('web.core');
    
   

    const SalesPersonPopupWidget = PopupWidget.extend({
        template: 'SalesPersonPopupWidget',

        show: function(options){
            this._super(options);
            this.$('.salesperson-selected').click(function(){
                const order = options.pos.get_order();
                const self = this;
                //var salesperson = $(this).data('value');
                /* si no se selecciono desde na linea de venta, es para toda la orden */
                if (!options.orderline) {
                    order.get_orderlines().forEach(function (orderline) {
                        orderline.set_salesperson(self.dataset);
                    });
                } else {
                    options.orderline.set_salesperson(self.dataset);
                    options.orderline.trigger('change',options.orderline);
                }
                options.pos.gui.close_popup();
            });
        },

    });
    gui.define_popup({name:'salespersonpopup', widget:SalesPersonPopupWidget});

});
