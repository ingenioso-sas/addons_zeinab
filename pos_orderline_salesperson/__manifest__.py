# -*- coding: utf-8 -*-
{
    'name': 'POS Orderline Salesperson',
    'version': '13.0.1.2.1',
    'summary': 'POS Orderline Salesperson',
    'category': 'Sales/Point Of Sale',
    'author': 'Zeinab Abdelmonem, Ingenioso CO',
    'email': 'zeinababdelmonem9@gmail.com, info@ingenioso.co',
    'depends': ['point_of_sale', "hr", "sale_commission", "hr_commission"],
    'data': [
        'security/ir.model.access.csv',
        'views/pos_config_views.xml',
        'views/pos_template.xml',
        'views/pos_order_views.xml',
    ],
    'qweb': [
        'static/src/xml/salesperson_popup.xml',
        'static/src/xml/salesperson.xml',
    ],
    'images': [
        'static/description/click_button_to_open_wizard.png',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False,
}
