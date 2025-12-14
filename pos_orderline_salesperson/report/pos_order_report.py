# -*- coding: utf-8 -*-

from functools import partial

from odoo import models, fields


class PosOrderReport(models.Model):
    _inherit = "report.pos.order"
    agent_id = fields.Many2one(
                'res.partner', string='Salesperson', readonly=True)
    commission_total = fields.Float(string='Total Commission', readonly=True)

    def _select(self):
        query = super(PosOrderReport, self)._select() + """,
            pole.agent_id AS agent_id,
            SUM(pole.amount / CASE COALESCE(s.currency_rate, 0)
                WHEN 0 THEN 1.0 ELSE s.currency_rate END)  AS commission_total
        """
        return query

    def _from(self):
        query = super(PosOrderReport, self)._from() + """
            LEFT JOIN pos_order_line_agent pole ON (pole.object_id=l.id)
        """
        return query

    def _group_by(self):
        query = super(PosOrderReport, self)._group_by() + ',pole.agent_id'
        return query
