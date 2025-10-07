odoo.define('pos_orderline_selesperson.employees_salesperson', function (require) {
    "use strict";

const models = require('point_of_sale.models');


models.load_models([{
    model:  'hr.employee',
    fields: ['name', 'id', 'user_id'],
    condition: function(self) {
        return Boolean(self.config.allow_orderline_user) && Boolean(self.config.employee_salesperson_ids.length > 0);
    },
    domain: function(self){ return [['company_id', '=', self.config.company_id[0]]]; },
    loaded: function(self, employees) {
        if (self.config.employee_salesperson_ids.length > 0) {
            self.employees_salesperson = employees.filter(function(employee) {
                return self.config.employee_salesperson_ids.includes(employee.id);
            });
            self.employees_salesperson.forEach(function(employee) {
                employee.role = 'salesperson';
            });
        } else {
            self.employees_salesperson = [];
        }
    }
}]);

});
