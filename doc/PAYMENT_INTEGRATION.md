# 支付渠道接入指南

本文档说明如何接入各种支付渠道到 Mini Mall 项目中。

## 📋 支持的支付方式

当前项目已预留以下支付方式的接口：

1. **支付宝（Alipay）**
2. **微信支付（WeChat Pay）**
3. **Stripe（信用卡）**

## 🔧 接入步骤

### 1. 支付宝接入

#### 步骤 1: 注册支付宝开放平台账号

1. 访问 [支付宝开放平台](https://open.alipay.com/)
2. 注册并完成企业认证
3. 创建应用，获取 `APPID` 和密钥

#### 步骤 2: 配置支付参数

在 `src/scripts/payment.js` 中的 `processAlipay` 方法中配置：

```javascript
async processAlipay(order) {
  // 配置你的支付宝参数
  const alipayConfig = {
    appId: 'YOUR_APP_ID',
    privateKey: 'YOUR_PRIVATE_KEY',
    alipayPublicKey: 'YOUR_ALIPAY_PUBLIC_KEY',
    gateway: 'https://openapi.alipay.com/gateway.do'
  };

  // 调用后端 API 创建支付订单
  const response = await fetch('/api/payment/alipay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...order,
      config: alipayConfig
    })
  });
  
  const data = await response.json();
  return data;
}
```

#### 步骤 3: 后端实现

需要创建后端 API 处理支付宝支付：

```javascript
// 后端示例（Node.js + Express）
app.post('/api/payment/alipay', async (req, res) => {
  const AlipaySdk = require('alipay-sdk').default;
  const AlipayFormData = require('alipay-sdk/lib/form').default;
  
  const alipaySdk = new AlipaySdk({
    appId: req.body.config.appId,
    privateKey: req.body.config.privateKey,
    alipayPublicKey: req.body.config.alipayPublicKey,
    gateway: req.body.config.gateway
  });

  const formData = new AlipayFormData();
  formData.setMethod('get');
  formData.addField('bizContent', {
    outTradeNo: `order_${Date.now()}`,
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: req.body.total,
    subject: 'Mini Mall 订单'
  });
  formData.addField('returnUrl', 'https://your-domain.com/payment/success');
  formData.addField('notifyUrl', 'https://your-domain.com/api/payment/alipay/notify');

  const result = await alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData }
  );

  res.json({ success: true, paymentUrl: result });
});
```

#### 参考文档

- [支付宝开放平台文档](https://opendocs.alipay.com/)
- [支付宝 SDK](https://github.com/alipay/alipay-sdk-nodejs-all)

---

### 2. 微信支付接入

#### 步骤 1: 注册微信支付商户号

1. 访问 [微信支付商户平台](https://pay.weixin.qq.com/)
2. 注册并完成企业认证
3. 获取 `商户号`、`AppID`、`API密钥`

#### 步骤 2: 配置支付参数

在 `src/scripts/payment.js` 中的 `processWechatPay` 方法中配置：

```javascript
async processWechatPay(order) {
  // 配置你的微信支付参数
  const wechatConfig = {
    appId: 'YOUR_APP_ID',
    mchId: 'YOUR_MCH_ID',
    apiKey: 'YOUR_API_KEY',
    notifyUrl: 'https://your-domain.com/api/payment/wechat/notify'
  };

  // 调用后端 API 创建支付订单
  const response = await fetch('/api/payment/wechat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...order,
      config: wechatConfig
    })
  });
  
  const data = await response.json();
  return data;
}
```

#### 步骤 3: 后端实现

需要创建后端 API 处理微信支付：

```javascript
// 后端示例（Node.js + Express）
const crypto = require('crypto');
const axios = require('axios');

app.post('/api/payment/wechat', async (req, res) => {
  const { order, config } = req.body;
  
  // 生成随机字符串
  const nonceStr = Math.random().toString(36).substr(2, 15);
  const outTradeNo = `order_${Date.now()}`;
  
  // 构建统一下单参数
  const params = {
    appid: config.appId,
    mch_id: config.mchId,
    nonce_str: nonceStr,
    body: 'Mini Mall 订单',
    out_trade_no: outTradeNo,
    total_fee: Math.round(order.total * 100), // 转换为分
    spbill_create_ip: req.ip,
    notify_url: config.notifyUrl,
    trade_type: 'JSAPI',
    openid: req.body.openid // 需要从用户授权获取
  };

  // 生成签名
  const sign = generateSign(params, config.apiKey);
  params.sign = sign;

  // 调用微信支付统一下单接口
  const response = await axios.post(
    'https://api.mch.weixin.qq.com/pay/unifiedorder',
    buildXml(params)
  );

  // 解析返回结果
  const result = parseXml(response.data);
  
  if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
    // 生成前端调起支付的参数
    const payParams = {
      appId: config.appId,
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: nonceStr,
      package: `prepay_id=${result.prepay_id}`,
      signType: 'MD5'
    };
    
    payParams.paySign = generateSign(payParams, config.apiKey);
    
    res.json({ success: true, payParams });
  } else {
    res.json({ success: false, message: result.err_code_des });
  }
});

function generateSign(params, key) {
  const stringA = Object.keys(params)
    .filter(k => params[k] && k !== 'sign')
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  const stringSignTemp = `${stringA}&key=${key}`;
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
}
```

#### 参考文档

- [微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)
- [微信支付 JSAPI 支付](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)

---

### 3. Stripe 接入

#### 步骤 1: 注册 Stripe 账号

1. 访问 [Stripe 官网](https://stripe.com/)
2. 注册账号并完成验证
3. 获取 `Publishable Key` 和 `Secret Key`

#### 步骤 2: 引入 Stripe.js

在 `checkout.html` 的 `<head>` 中添加：

```html
<script src="https://js.stripe.com/v3/"></script>
```

#### 步骤 3: 配置支付参数

在 `src/scripts/payment.js` 中的 `processStripe` 方法中配置：

```javascript
async processStripe(order) {
  // 初始化 Stripe
  const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
  
  // 创建支付方式（需要在前端收集卡信息）
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement, // 需要在前端创建 cardElement
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // 调用后端 API 创建支付意图
  const response = await fetch('/api/payment/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...order,
      paymentMethodId: paymentMethod.id
    })
  });
  
  const data = await response.json();
  
  if (data.requiresAction) {
    // 需要 3D Secure 验证
    const { error: confirmError } = await stripe.confirmCardPayment(
      data.clientSecret
    );
    
    if (confirmError) {
      return { success: false, message: confirmError.message };
    }
  }
  
  return data;
}
```

#### 步骤 4: 后端实现

需要创建后端 API 处理 Stripe 支付：

```javascript
// 后端示例（Node.js + Express）
const stripe = require('stripe')('YOUR_SECRET_KEY');

app.post('/api/payment/stripe', async (req, res) => {
  try {
    const { order, paymentMethodId } = req.body;
    
    // 创建支付意图
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // 转换为分
      currency: 'cny',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://your-domain.com/payment/success'
    });

    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        paymentId: paymentIntent.id,
        orderId: `order_${Date.now()}`
      });
    } else if (paymentIntent.status === 'requires_action') {
      res.json({
        success: false,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret
      });
    } else {
      res.json({
        success: false,
        message: '支付失败'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});
```

#### 参考文档

- [Stripe 文档](https://stripe.com/docs)
- [Stripe 支付集成指南](https://stripe.com/docs/payments/accept-a-payment)

---

## 🔒 安全注意事项

1. **永远不要在前端存储密钥**：所有密钥（API Key、Secret Key）都应该在后端处理
2. **使用 HTTPS**：所有支付相关请求必须使用 HTTPS
3. **验证支付结果**：后端必须验证支付回调的真实性
4. **处理支付回调**：实现支付成功/失败的回调处理
5. **订单状态管理**：确保订单状态正确更新

## 📝 支付流程

```
用户点击"提交订单"
  ↓
前端收集订单信息
  ↓
调用支付服务 processPayment()
  ↓
根据支付方式调用相应接口
  ↓
后端创建支付订单
  ↓
返回支付链接/参数
  ↓
前端调起支付（或跳转支付页面）
  ↓
用户完成支付
  ↓
支付平台回调后端
  ↓
后端验证并更新订单状态
  ↓
前端显示支付结果
```

## 🧪 测试

### 测试环境

- **支付宝**：使用沙箱环境进行测试
- **微信支付**：使用沙箱环境进行测试
- **Stripe**：使用测试模式（Test Mode）

### 测试卡号（Stripe）

- 成功：`4242 4242 4242 4242`
- 需要验证：`4000 0025 0000 3155`
- 失败：`4000 0000 0000 0002`

## 📞 获取帮助

- 支付宝技术支持：https://open.alipay.com/
- 微信支付技术支持：https://pay.weixin.qq.com/
- Stripe 技术支持：https://support.stripe.com/

---

**注意**：当前代码中的支付功能为模拟实现，实际接入时需要替换为真实的支付接口调用。
