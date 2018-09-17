var columns = [
  { prop: 'order-id', label: '客户单号', width: 180 },
  { prop: 'provider-id', label: '服务商单号', width: 120 },
  { prop: 'ship-express', label: '运输方式', width: 120 },
  { prop: 'ship-country', label: '目的国家', width: 150 },

  { prop: 'sender-company', label: '发件人公司名', width: 120 },
  { prop: 'sender-name', label: '发件人姓名', width: 120 },
  { prop: 'sender-state', label: '发件人省/州', width: 120 },
  { prop: 'sender-city', label: '发件人城市', width: 120 },
  { prop: 'sender-address', label: '发件人地址', width: 120 },
  { prop: 'sender-phone-number', label: '发件人电话', width: 120 },
  { prop: 'sender-postal-code', label: '发件人邮编', width: 120 },
  { prop: 'sender-fax', label: '发件人传真', width: 120 },

  { prop: 'recipient-company', label: '收件人公司名', width: 120 },
  { prop: 'recipient-name', label: '收件人姓名', width: 150 },
  { prop: 'ship-state', label: '收件人省/州', width: 120 },
  { prop: 'ship-city', label: '收件人城市', width: 120 },
  { prop: 'ship-address-1', label: '收件人地址', width: 200 },
  { prop: 'recipient-door-number', label: '收件人门牌号', width: 120 },
  { prop: 'recipient-passport-code', label: '收件人护照号码', width: 120 },
  { prop: 'recipient-phone-number', label: '收件人电话', width: 120 },
  { prop: 'recipient-email', label: '收件人邮箱', width: 120 },
  { prop: 'ship-postal-code', label: '收件人邮编', width: 120 },
  { prop: 'ship-fax', label: '收件人传真', width: 120 },

  { prop: 'aaaaaaaa', label: '买家id', width: 120 },
  { prop: 'aaaaaaaa', label: 'vat号码', width: 120 },
  { prop: 'aaaaaaaa', label: '交易id', width: 120 },
  { prop: 'aaaaaaaa', label: '保险类型', width: 120 },
  { prop: 'aaaaaaaa', label: '保险价值', width: 120 },
  { prop: 'aaaaaaaa', label: '投保人', width: 120 },
  { prop: 'aaaaaaaa', label: '投保人身份证', width: 120 },
  { prop: 'aaaaaaaa', label: '货物名称', width: 120 },
  { prop: 'aaaaaaaa', label: '包装与数量', width: 120 },
  { prop: 'aaaaaaaa', label: '订单备注', width: 120 },
  { prop: 'aaaaaaaa', label: '重量', width: 120 },
  { prop: 'aaaaaaaa', label: '是否带电池', width: 120 },
  { prop: 'aaaaaaaa', label: '是否需要签名服务', width: 120 },
  { prop: 'aaaaaaaa', label: '是否退件', width: 120 },
  { prop: 'aaaaaaaa', label: '是否单独报关', width: 120 },
  { prop: 'aaaaaaaa', label: '包裹种类', width: 120 },
  { prop: 'aaaaaaaa', label: 'eori号码', width: 120 },
  { prop: 'declare-name', label: '海关报关品名1', width: 150 }, // 海关报关品名1
  { prop: 'declare-name-cn', label: '海关申报品名（中）1', width: 150 }, // 海关申报品名（中）1
  { prop: 'aaaaaaaa', label: '配货信息1', width: 120 },
  { prop: 'declare-price', label: '申报价值1', width: 120 }, // 申报价值1
  { prop: 'aaaaaaaa', label: '申报品url1', width: 120 },
  { prop: 'declare-count', label: '申报品数量1', width: 120 }, // 申报品数量1
  { prop: 'aaaaaaaa', label: '海关货物编号1', width: 120 },
  { prop: 'aaaaaaaa', label: '配货备注1', width: 120 },
  { prop: 'aaaaaaaa', label: '海关报关品名2', width: 120 },
  { prop: 'aaaaaaaa', label: '海关申报品名（中）2', width: 120 },
  { prop: 'aaaaaaaa', label: '配货信息2', width: 120 },
  { prop: 'aaaaaaaa', label: '申报价值2', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品url2', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品数量2', width: 120 },
  { prop: 'aaaaaaaa', label: '海关货物编号2', width: 120 },
  { prop: 'aaaaaaaa', label: '配货备注2', width: 120 },
  { prop: 'aaaaaaaa', label: '海关报关品名3', width: 120 },
  { prop: 'aaaaaaaa', label: '海关申报品名（中）3', width: 120 },
  { prop: 'aaaaaaaa', label: '配货信息3', width: 120 },
  { prop: 'aaaaaaaa', label: '申报价值3', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品url3', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品数量3', width: 120 },
  { prop: 'aaaaaaaa', label: '海关货物编号3', width: 120 },
  { prop: 'aaaaaaaa', label: '配货备注3', width: 120 },
  { prop: 'aaaaaaaa', label: '海关报关品名4', width: 120 },
  { prop: 'aaaaaaaa', label: '海关申报品名（中）4', width: 120 },
  { prop: 'aaaaaaaa', label: '配货信息4', width: 120 },
  { prop: 'aaaaaaaa', label: '申报价值4', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品url4', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品数量4', width: 120 },
  { prop: 'aaaaaaaa', label: '海关货物编号4', width: 120 },
  { prop: 'aaaaaaaa', label: '配货备注4', width: 120 },
  { prop: 'aaaaaaaa', label: '海关报关品名5', width: 120 },
  { prop: 'aaaaaaaa', label: '海关申报品名（中）5', width: 120 },
  { prop: 'aaaaaaaa', label: '配货信息5', width: 120 },
  { prop: 'aaaaaaaa', label: '申报价值5', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品url5', width: 120 },
  { prop: 'aaaaaaaa', label: '申报品数量5', width: 120 },
  { prop: 'aaaaaaaa', label: '海关货物编号5', width: 120 },
  { prop: 'aaaaaaaa', label: '配货备注5', width: 120 }
];

// 获得行数据
var getRowData = function (data = {}) {
  var row = {
    'order-id': '',                       // 客户单号
    'ship-express': '广州E邮宝',           // 目的国家
    'ship-country': 'UNITED STATES',      // 目的国家

    'recipient-phone-number': '',         // 收件人电话
    'recipient-name': '',                 // 收件人名字
    'ship-address-1': '',                 // 收件人地址
    'ship-city': '',                      // 收件人城市
    'ship-state': '',                     // 收件人省/州
    'ship-postal-code': '',               // 收件人邮编

    'declare-name': 'Clothes Accessories', // 海关报关品名1
    'declare-name-cn': '服装配饰',          // 海关申报品名（中）1
    'declare-price': 3.99,                 // 申报价值1 item-price,shipping-price 
    'declare-count': 1                     // 申报品数量1
  }
  var result = Object.assign({}, row, data)

  // 覆盖字段值
  result['ship-express'] = '广州E邮宝'
  result['ship-country'] = 'UNITED STATES'
  result['recipient-phone-number'] = data['ship-phone-number'] || data['buyer-phone-number']

  result['declare-name'] = 'Clothes Accessories'
  result['declare-name-cn'] = '服装配饰'
  result['declare-price'] = data['item-price'] || 3.99
  result['declare-count'] = data['quantity-purchased'] || 1

  return result
}

// 遍历数据
var get4pxTable = function (data) {
  if (!data || !data.length) return [];

  var result = {
    columns: columns,
    data: []
  }
  var activeItem;

  data.forEach(item => {
    activeItem = getRowData(item);
    result.data.push(activeItem);
  })

  return result
}

export {
  columns
}
export default get4pxTable;