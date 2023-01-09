<h1>
  sky-vue-element-admin
</h1>

## 简介

* sky-vue-element-admin 计划做成一个多场景通用的管理后台，基于[vue-element-admin](https://panjiachen.github.io/vue-element-admin)
* 配合后端代码 skynode
* 已实现功能有
  * 登录
  * 菜单管理
  * 用户管理
  * 角色管理
  * 商品管理
  * 公告管理
  * 广告管理
  * 其他，持续更新ing

## 功能

```
- 登录 / 注销

- 权限验证
  - 菜单权限
  - 权限配置

- 系统管理
	- 菜单管理
	- 用户管理
	- 角色管理

- 商品管理
	- 商品列表
	- 商品分类
	- 商品型号
	
- 店铺设置
	- 公告管理
	- 广告管理
	
- 多环境发布
  - dev
  - sit
  - stage
  - prod

- 全局功能
  - 国际化多语言
  - 多种动态换肤
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - Svg Sprite 图标
  - 本地/后端 mock 数据
  - Screenfull全屏
  - 自适应收缩侧边栏

- 错误页面
  - 401
  - 404
```

![image-20230109142405171](/Users/chenk/Library/Application Support/typora-user-images/image-20230109142405171.png)

## 前序准备

- node版本 16.17.0+

  

## 开发

```bash
# 克隆项目
git clone https://gitee.com/ckjiang/sky-vue-element-admin.git

# 进入项目目录
cd sky-vue-element-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm config set registry https://registry.npmjs.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## 在线Demo

[在线访问](http://120.24.170.189:9011/)

帐号：admin

密码：12345678

## Donate

如果对你有帮助的话，请你点一个星星 star 鼓励，也可以请我喝杯果汁🍹

或者您有更好的建议和意见，请提出来告知我，可以留言 Issues或加我微信。希望能够帮助到你学习！

谢谢！共勉！

<img width="200" src="https://gitee.com/ckjiang/node-mysql-koa2/raw/main/image/wx.png"/><img width="200" src="https://gitee.com/ckjiang/node-mysql-koa2/raw/main/image/wx-pay.png"/><img width="200" src="https://gitee.com/ckjiang/node-mysql-koa2/raw/main/image/zfb-pay.png"/>

## License

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)