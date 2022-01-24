const express = require("express")

const csv = require('csvtojson')
const app = express()
const key = "4w75m48lpohhspi1"
const secrete = "2dtakgbw0wfbvo68s8y01bz710iadm0j"
app.use(express.json())
const server = require("http").createServer(app)
const axios = require("axios")
const crypto = require("crypto")
const qs = require("qs")
const fs = require("fs")
const mongoose = require("mongoose")
const User = require("./schema/user")
const cors = require("cors")
const moment = require("moment")
const xlsx = require('node-xlsx');
const download = require('download');
moment().format(); 
app.use(cors())
const  user = {
	status: 'success',
	data: {
	  user_type: 'individual',
	  email: 'parit@concepttocode.in',
	  user_name: 'Parit Verma',
	  user_shortname: 'Parit',
	  broker: 'ZERODHA',
	  exchanges: [
		'BFO', 'CDS',
		'MCX', 'BSE',
		'NFO', 'BCD',
		'MF',  'NSE'
	  ],
	  products: [ 'CNC', 'NRML', 'MIS', 'BO', 'CO' ],
	  order_types: [ 'MARKET', 'LIMIT', 'SL', 'SL-M' ],
	  avatar_url: null,
	  user_id: 'CM5442',
	  api_key: '4w75m48lpohhspi1',
	  access_token: 'dhiM2ZJP8NQbavW3iuFyzm2bzveeG3Ob',
	  public_token: 'ey6qQsWd3VWYFLfz02qFWuo81AoYspBA',
	  refresh_token: '',
	  enctoken: 'N3t4gfBFy6v3kJ4N6GLrDKKR+EIGJMDV7y1AIqDGvW9Je7vuPesN+aRZBKpoO8xCQOhfTFHra2vU7Fa6npj5JaPnS8gIDhd0CI84FpgiInECdejapti2xldUr44u5Xg=',
	  login_time: '2022-01-24 12:57:19',
	  meta: { demat_consent: 'consent' }
	}
}
;(async()=>{
	try{
		await mongoose.connect('mongodb://localhost/my_database');
	console.log("connected")
	const resp = await axios({
		url:  "https://api.kite.trade/instruments",
		method: "get",
		headers: {
			'X-Kite-Version': 3,
			"Authorization": `token ${user.data.api_key}:${user.data.access_token}`
		}

	})
	// For lot
	fs.writeFileSync(__dirname+"/abc.csv", Buffer.from(resp.data))
	await download('https://www1.nseindia.com/content/fo/qtyfreeze.xls', __dirname);
	
	}
	catch(e)
	{
		console.log("error",e)
	}
})()



// User.updateOne({}, {token:"n8LTDrB2K7EX60977mUKTHFyeNIAEern" }, {upsert: true})
app.get("/gettoken", async(req, res)=>{
    try{
		console.log(req.query)
		let token = "4w75m48lpohhspi1" + req.query.request_token + secrete 
		const hash = crypto.createHash('sha256').update(token).digest("hex");
		var qs = require('qs');
		var data = qs.stringify({
		'api_key': '4w75m48lpohhspi1',
		'request_token': req.query.request_token,
		'checksum': hash
		});
		const resp  =await axios({
			url: 'https://api.kite.trade/session/token',
			method: "post",
			headers: { 
				'Content-Type': 'application/x-www-form-urlencoded'
			  },
			data
		})
		const {user_name, email,access_token,api_key} = resp.data.data
		await User.findOneAndUpdate({
			email: email
		}, {
			token:  access_token ,
			name: user_name,
			email:email,
			key: api_key
		}, {upsert: true})
		res.json("done")
	}catch(e)
	{
		console.log("Error", e)
	}
})
app.post("/data/:id", async(req, res)=>{
	try{ 
		const {id} = req.params
		const user = await User.findOne({email: id})
		if(user)
		{
			const {action, formData, other} = req.body
			const {symbol, price, quantity} = formData
			const jsonArray = await csv({ noheader: true, output: "csv" }).fromFile(
				__dirname+"/abc.csv"
			  );
			let values = jsonArray.slice(1)
			
			let lot 
			let name
			for(let i =0; i < values.length; i++)
			{
				if(values[i][2] == symbol)
				{
					lot = values[i][8]
					name = values[i][3]
					break;
				}
			}
			const data = xlsx.parse(`${__dirname}/qtyfreeze.xls`);
			let fvalues = data[0].data
			let freeze
			for(let i =0; i < fvalues.length; i++)
			{    
				if(fvalues[i][1].trim() == name )
				{
					freeze = fvalues[i][2]
					break;
				}	
				
			}
			if(+quantity % lot == 0)
				{
					if(+quantity < freeze)
					{   
						
						await getDetails({action,symbol,price,quantity, other}, res, user)
					}
					else{
						let order = quantity / freeze
						let before = order.toString().split(".")[0]
						let after = order.toString().split(".")[1]
						let total = 0
						if(before)
						{
						   for(let i = 0; i < before; i++)
						   {   
							   total += freeze
							   await getDetails({action,symbol,price,quantity:freeze, other}, res, user)
						   }
						}
						if(after)
						{
							let oth = quantity - total
							await getDetails({action,symbol,price,quantity:oth , other}, res, user)
						}
						
					}
				}
	
			else{
					
				throw new Error(`Quantity should be multiple of ${lot}`)
			}
			res.status(200).json("done")
		}
		 else{
			 throw new Error("User not Found")
		 }
	}catch(e)
	{   
		res.status(400).json({message: e.message})
	}
	
})


app.get("/orders", async(req, res)=>{
	try{
		const jsonArray = await csv({ noheader: true, output: "csv" }).fromFile(
			__dirname+"/abc.csv"
		  );
		let values = jsonArray.slice(1)
		
		let result = []
		let start  = 0
		let end = values.length-1
		let date = moment().add(1, 'weeks').endOf('isoWeek').format("yyyy-MM-DD")
		while(start < end)
		{  
           if((values[start][3] == "NIFTY" || values[start][3] == "BANKNIFTY") && moment(values[start][5]).format("yyyy-MM-DD") <= date)
		   {
			let obj = mapdata(values[start])
			 result.push(obj)
		   }
		   else if((values[end][3] == "NIFTY" || values[end][3] == "BANKNIFTY") && moment(values[start][5]).format("yyyy-MM-DD") <= date)
			{
			 let obj  = mapdata(values[end])
			 result.push(obj)
			}
			start++
			end--
		}
		return res.status(200).json({data: result})
		   
		
	}catch(e)
	{
		throw e
	}
})

app.post("/user", async(req, res)=>{
	try{
          const {email}= req.body
		  let user = await User.findOne({email: email})
		  if(user)
		  {
			  return res.status(200).json(user)
		  }
		  else{
			  throw new Error("Invalid User")
		  }
	}catch(e)
	{
		res.status(400).json({message: e.message})
	}
})
function mapdata(obj){
	return {
		'instrument_token': obj[0],
		'exchange_token': obj[1],
		'tradingsymbol': obj[2],
		'name': obj[3],
		'last_price': obj[4],
		'expiry': obj[5],
		'strike': obj[6],
		'tick_size': obj[7],
		'lot_size': obj[8],
		'instrument_type': obj[9],
		'segment': obj[10],
		'exchange': obj[11]
	 }
}





async function  getDetails(market, res, user)
{   
  try{
	    
	  	  let url = "https://api.kite.trade/orders/amo"
		  if(market["price"] !=""){
			const data = qs.stringify({
				"tradingsymbol": market["symbol"],
				"exchange": market["other"]["exchange"],
				"transaction_type": market["action"],
				"quantity": market["quantity"],
				"product" : market["other"]["product"],
				"order_type": "LIMIT",
				"validity": "DAY",
				"price": market["price"]
			})
			 const resp = await axios({
				 url:  url,
				 method: "post",
				 headers: {
					 'X-Kite-Version': 3,
					 "Authorization": `token ${user.key}:${user.token}`,
					 'Content-Type': 'application/x-www-form-urlencoded'
				 },
				 data
		 
			 })
			 
			 console.log(resp)
			}
			else {
				console.log("error")
					const data = qs.stringify({
						"tradingsymbol": market["symbol"],
						"exchange": market["other"]["exchange"],
						"transaction_type": market["action"],
						"quantity": market["quantity"],
						"product" : market["other"]["product"],
						"order_type": "MARKET",
						"validity": "DAY",
					})
				 const resp = await axios({
					 url:  url,
					 method: "post",
					 headers: {
						 'X-Kite-Version': 3,
						 "Authorization": `token ${user.key}:${user.token}`,
						 'Content-Type': 'application/x-www-form-urlencoded'
					 },
					 data
		 
				 })
				 console.log(resp)
				 // call api here
			
			}
		  
  }
  catch(e)
  {   
    
	 res.status(400).json({message:e.response.data.message })
  }
}





app.get("/position/:id", async(req, res)=>{
	try{
		const {id} = req.params
		const user = await User.findOne({email: id})
     	if(user)
		 {
			const data = await axios("https://api.kite.trade/portfolio/positions", {
				method: "get",
				headers: {
					'X-Kite-Version': 3,
					"Authorization": `token ${user.key}:${user.token}`
				}
			})
			return res.json({data: data.data}) 
		 }
		 else{
			throw new Error("User Not Found")
		 }
	}catch(e)
	{
		console.log(e)
	}
})
server.listen(3001, ()=>{
    console.log("Server Started")
})


