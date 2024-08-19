odoo.define('pos_orderline_salesperson.salesperson', function (require) {
"use strict";

    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t   = core._t;

    var _super_orderline = models.Orderline.prototype;

    models.Orderline = models.Orderline.extend({
        initialize: function(attr, options) {
            _super_orderline.initialize.call(this,attr,options);
            this.salesperson = this.salesperson || undefined;
            this.salesperson_id = this.salesperson_id || false;
        },
        set_salesperson: function(salesperson){
            this.salesperson = salesperson.value;
            this.salesperson_id = salesperson.id;            
            this.trigger('change',this);
        },
        remove_salesperson: function(){
            this.salesperson = undefined;
            this.salesperson_id = false;            
            this.trigger('change',this);
        },
        get_salesperson: function(salesperson){
            return this.salesperson;
        },
        can_be_merged_with: function(orderline) {
            if (orderline.get_salesperson() !== this.get_salesperson()) {
                return false;
            } else {
                return _super_orderline.can_be_merged_with.apply(this,arguments);
            }
        },
        clone: function(){
            var orderline = _super_orderline.clone.call(this);
            orderline.salesperson = this.salesperson;
            orderline.salesperson_id = this.salesperson_id;
            return orderline;
        },
        export_as_JSON: function(){
            var json = _super_orderline.export_as_JSON.call(this);
            json.salesperson = this.salesperson;
            json.salesperson_id = this.salesperson_id;
            return json;
        },
        init_from_JSON: function(json){
            _super_orderline.init_from_JSON.apply(this,arguments);
            this.salesperson = json.salesperson;
            this.salesperson_id = json.salesperson_id;
        },
    });

    screens.OrderWidget.include({
        render_orderline: function(orderline) {
            var node = this._super(orderline);
            var salesperson_icon = node.querySelector('.line-salesperson-icon');
            if(salesperson_icon){
                salesperson_icon.addEventListener('click', (function() {
                    this.show_salesperson_popup(orderline);
                }.bind(this)));
            }
            var remove_salesperson = node.querySelector('.line-remove-salesperson');
            if(remove_salesperson){
                remove_salesperson.addEventListener('click', (function() {
                    orderline.remove_salesperson();
                }.bind(this)));
            }
            return node;
        },
        show_salesperson_popup: function(orderline){
            var self = this;
            this.pos.gui.show_popup('salespersonpopup',{
                title: _t('Select Salesperson'),
                salespersons: self.pos.employees_salesperson,
                pos: self.pos,
                orderline: orderline,
            });
        },
    });

    var OrderlineSalespersonButton = screens.ActionButtonWidget.extend({
        template: 'OrderlineSalespersonButton',
        button_click: function(){
            var self = this;
            this.pos.gui.show_popup('salespersonpopup',{
                title: _t('Select Salesperson'),
                salespersons: self.pos.employees_salesperson,
                pos: self.pos,
            });
        },
    });

    screens.define_action_button({
        'name': 'orderline_salesperson',
        'widget': OrderlineSalespersonButton,
        'condition': function(){
            return this.pos.config.allow_orderline_user;
        },
    });
    return {
        OrderlineSalespersonButton: OrderlineSalespersonButton,
    }
});
