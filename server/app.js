import express from "express";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken'
import goods from "./data/goods.json";
import menus from './data/menus.json'
import users from './data/users.json'
import multiparty  from "multiparty"; // 文件上传
// 改造写文件方法
const writeFile = promisify(fs.writeFile);

// 创建网站服务器实例对象
const app = express();
// 支持跨域访问
app.use(cors());
// 配置静态资源访问目录
app.use(express.static(path.join(__dirname, "public")));
// 处理格式为application/x-www-form-urlencoded的请求参数
app.use(bodyParser.urlencoded({ extended: false }));
// 处理格式为application/json的请求参数
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 设置允许的源，这里使用通配符允许所有来源
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允许的HTTP方法
    next();
});

  // 所有的api的请求都要求登陆后才能获取到对应的数据(注意：这里放的位置)
//app.use('/goods', (req, res, next) => {
    // 如果请求的是登录的接口地址，不进行判断。
	//console.log('path==',req.path)
 // if(req.path==='/user/login'){
  //  return next();
 // }
  //jwt.verify(req.get('Authorization'),'my_token',function(err,decode){
   // if(err){
     // res.status(401).jsonp({
       // code: 8,
      //  msg: '用户没有登录，不能访问!!'
     // });
    //}else{
   //   next();
  //  }
 // })
//})


//获取商品数据(未分页)
app.get("/products", (req, res) => {
  res.send(goods);
});


// 获取商品列表
app.get("/goods", (req, res) => {
  let { pageNumber, pageSize, search } = req.query;
  if(!pageSize) pageSize=3;
  if(!pageNumber) pageNumber=1;
  let newGoods=[];
   if (search !== undefined && search!=='') {
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].title.indexOf(search) >= 0) {
        newGoods.push(goods[i]);
      }
    }
    //if (pageNumber > newGoods.length) {
      //pageNumber = newGoods.length;
    //}
	if(pageNumber>Math.ceil(newGoods.length/pageSize)){
		pageNumber=Math.ceil(newGoods.length/pageSize)
	}
    if (pageNumber < 1) {
      pageNumber = 1;
    }
	
    let arr = newGoods.slice(pageSize * (pageNumber - 1), pageSize * pageNumber); 
    const result = { "list": arr, "totalCount": newGoods.length, "currentPage": pageNumber };
    res.send(result);
  } else {
	if(pageNumber>Math.ceil(goods.length/pageSize)){
		pageNumber=Math.ceil(goods.length/pageSize)
	}
    newGoods = goods.slice(pageSize * (pageNumber-1), pageSize*pageNumber);
    const result = { "list": newGoods, "totalCount": goods.length, "currentPage": pageNumber };
    res.send(result);
  }
 
});
//添加商品
app.post('/goods/add', async(req, res) => {
  let body = req.body;
  const id = goods[goods.length - 1].id+1;
  //模拟商品的编号
  body.id = id;
  goods.push(body)
  await writeFile("./data/goods.json", JSON.stringify(goods));
  res.send(body)
})
//完成商品的编辑
app.post('/goods/edit', async (req, res) => {
  let body = req.body;
  const goodsProduct = goods.find((item) => item.id == body.goodsId);
  if (!goodsProduct) res.status(400).send({ msg: "商品不存在" });
  goodsProduct.title = body.title;
  goodsProduct.price = body.price;
  goodsProduct.thumbnail = body.thumbnail;
  goodsProduct.goodsDetail = body.goodsDetail;
  await writeFile("./data/goods.json", JSON.stringify(goods));
  res.send(goodsProduct)
})

 //删除商品
 app.delete('/goods/delete', async(req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send({ msg: "商品id不存在" });
  // 查找要删除的购物车中的商品的索引
  const index = goods.findIndex((item) => item.id == id);
  // 删除商品
  let result = goods.splice(index, 1);
  // 如果删除失败
  if (result.length == 0) return res.status(400).send({ msg: "商品删除失败" });
  // 存储结果
  await writeFile("./data/goods.json", JSON.stringify(goods));
  // 响应
  res.send({ msg: "商品删除成功",index:index,code:'ok'});
 })


//上传图片文件
app.post('/goods/fileUpload',  (req, res) => {
  //进行文件上传。
  var form = new multiparty.Form();
  /* 设置编辑 */
  form.encoding = 'utf-8';
  //设置文件存储路劲
  form.uploadDir = './public/images';
  // console.log("dir", form.uploadDir);
  //设置文件大小限制
  form.maxFilesSize = 2 * 1024 * 1024;
  // 上传后处理
  form.parse(req, function(err, fields, files) {
      //console.log('fields', fields); // 提交过来的表单的信息，包括了了表单元素的name属性的值，请求的方式。
      if (err) {
          console.log('parse error:' + err);
      } else {
          var uploadedPath = files.file[0].path;
          // console.log('uploadedPath===',uploadedPath);
          var newfileName = new Date().getMilliseconds() + path.extname(uploadedPath);
          if (path.extname(uploadedPath) == ".jpg" ||path.extname(uploadedPath) == ".png"|| path.extname(uploadedPath) == ".gif") {
              var dstPath = './public/images/' + newfileName;
              // //重命名为真实文件名
              fs.rename(uploadedPath, dstPath, function(err) {
                  if (err) {
                      res.send({ msg: '文件重命名失败', flag: 'no' });
                  } else {

                     //这里只返回该路径就可以了，因为在app.js文件中已经对静态文件进行了
                          // 配置
                      res.send({ msg: '/images/'+ newfileName, flag: 'ok' });
                  }
              })
          } else {
              //不是图片文件，将其删除掉。
              fs.unlink(uploadedPath, function(err) {
                  if (err) {
                      console.log(err)
                  }
              })
              res.send({ msg: '文件只能上传图片', flag: 'no' });
          }
      }

  })
})

//查询某个具体商品信息
app.get('/goods/get', (req, res) => {
  const { goodsId } = req.query;
  if (!goodsId) return res.status(400).send({ msg: "商品id不存在" });
  const goodsProduct = goods.find((item) => item.id == goodsId);
  if (!goodsProduct) res.status(400).send({ msg: "商品不存在" });
  res.send(goodsProduct)
})
//获取菜单数据
app.get('/menus',(req,res)=>{
	res.send(menus);
})

//用户登录
app.post('/user/login',(req,res)=>{
		const {userName,userPwd}=req.body;
	const userInfo=users.find((item)=>item.userName===userName && item.userPwd===userPwd);
	
	if(userInfo!==undefined){
		const token=jwt.sign({
			name:userInfo.userName,
			date:Date.now()
		},'my_token')
	return res.json({code:0,data:userInfo,msg:"登录成功",myToken:token})		
		
	}
	return res.json({code:1,msg:'登录失败，用户名或密码错误!!'})
	
})

// 获取用户列表
app.get("/users", (req, res) => {
  let { pageNumber, pageSize, search } = req.query;
  if(!pageSize) pageSize=3;
  if(!pageNumber) pageNumber=1;
  let newUsers=[];
   if (search !== undefined && search!=='') {
    for (let i = 0; i < users.length; i++) {
      if (users[i].userName.indexOf(search) >= 0) {
        newUsers.push(users[i]);
      }
    }
    if (pageNumber > newUsers.length) {
      pageNumber = newUsers.length;
    }
    if (pageNumber < 1) {
      pageNumber = 1;
    }
	
    let arr = newUsers.slice(pageSize * (pageNumber - 1), pageSize * pageNumber); 
    const result = { "list": arr, "totalCount": newUsers.length, "currentPage": pageNumber };
    res.send(result);
  } else {
    newUsers = users.slice(pageSize * (pageNumber-1), pageSize*pageNumber);
    const result = { "list": newUsers, "totalCount": users.length, "currentPage": pageNumber };
    res.send(result);
  }
 
});

//添加用户信息
app.post('/users/add',async(req,res)=>{
	let body = req.body;
  const id = users[users.length - 1].id+1;
  //模拟商品的编号
  body.id = id;
  users.push(body)
  await writeFile("./data/users.json", JSON.stringify(users));
  res.send(body)
})
//查询某个具体用户信息
app.get('/users/get', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).send({ msg: "用户id不存在" });
  const userInfo = users.find((item) => item.id == userId);
  if (!userInfo) res.status(400).send({ msg: "用户不存在" });
  res.send(userInfo)
})

//完成用户的编辑
app.post('/users/edit', async (req, res) => {
  let body = req.body;
  const userInfo = users.find((item) => item.id == body.id);
  if (!userInfo) res.status(400).send({ msg: "用户不存在" });
  userInfo.userName = body.userName;
  userInfo.userPwd = body.userPwd;
  userInfo.userMail = body.userMail;
  await writeFile("./data/users.json", JSON.stringify(users));
  res.send(userInfo)
})
// 删除用户信息
app.delete('/user/delete',async(req,res)=>{
	const { id } = req.query;
  if (!id) return res.status(400).send({ msg: "用户id不存在" });
  // 查找要删除的购物车中的商品的索引
  const index = users.findIndex((item) => item.id == id);
  // 删除商品
  let result = users.splice(index, 1);
  // 如果删除失败
  if (result.length == 0) return res.status(400).send({ msg: "用户删除失败" });
  // 存储结果
  await writeFile("./data/users.json", JSON.stringify(users));
  // 响应
  res.send({ msg: "用户删除成功",index:index,code:'ok'});
})

// 监听端口
app.listen(3005);
