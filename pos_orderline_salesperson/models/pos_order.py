# -*- coding: utf-8 -*-

from odoo import api, fields, models


class PosOrder(models.Model):
    _inherit = "pos.order"

    allow_orderline_user = fields.Boolean(related='session_id.config_id.allow_orderline_user')

    @api.depends("lines.agent_ids.amount")	
    def _compute_commission_total(self):
        for record in self:
            record.commission_total = sum(record.mapped("lines.agent_ids.amount"))
        
    commission_total = fields.Float(
        string="Total Commission", compute="_compute_commission_total", store=True,
    )

    def recompute_lines_agents(self):
        self.mapped("lines").recompute_agents()


class PosOrderLine(models.Model):
    _inherit = [
        "pos.order.line",
        "sale.commission.mixin",
    ]

    _name = "pos.order.line"
    agent_ids = fields.One2many(comodel_name="pos.order.line.agent")

    @api.depends("order_id.partner_id")
    def _compute_agent_ids(self):
        self.agent_ids = False  # for resetting previous agents
        for record in self.filtered(lambda x: x.order_id.partner_id):
            if not record.commission_free:
                record.agent_ids = record._prepare_agents_vals_partner(
                    record.order_id.partner_id
                )

    def _order_line_fields(self, line, session_id=None):

        if line and 'salesperson_id' in line[2]:
            employee_id = line[2]["salesperson_id"]
            employee = self.env["hr.employee"].search([("id", "=", employee_id)])
            agent_id_list = employee['agent_ids']
            for agent in agent_id_list:
                agent_id = agent.id
                commission = agent.commission_id.id

                line[2]["agent_ids"] = [
                    (0, 0, {"agent_id": agent_id, "commission_id": commission})
                ]

        return super()._order_line_fields(line, session_id)


class PosOrderLineAgent(models.Model):
    _inherit = "sale.commission.line.mixin"
    _name = "pos.order.line.agent"
    _description = "Agent detail of commission line in order lines"

    object_id = fields.Many2one(comodel_name="pos.order.line")
    currency_id = fields.Many2one(related="object_id.currency_id")

    @api.depends(
        "object_id.price_subtotal", "object_id.product_id", "object_id.qty"
    )
    def _compute_amount(self):
        for line in self:
            order_line = line.object_id
            line.amount = line._get_commission_amount(
                line.commission_id,
                order_line.price_subtotal,
                order_line.product_id,
                order_line.qty,
            )

    @api.depends('agent_id', 'amount')
    def name_get(self):
        result = []
        for record in self:
            if self.env.context.get('agent', False):
                result.append((record.id, "{}".format(record.amount)))
            elif self._context.get('amount', False):
                result.append((record.id, "{}".format(record.agent_id.name)))
            else:
                result.append((record.id, "${} ({})".format(record.amount, record.agent_id.name)))
        return result

