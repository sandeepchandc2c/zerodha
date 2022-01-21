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
moment().format(); 
app.use(cors())

;(async()=>{
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
	fs.writeFileSync(__dirname+"/abc.csv", Buffer.from(resp.data))
})()



User.updateOne({}, {token:"n8LTDrB2K7EX60977mUKTHFyeNIAEern" }, {upsert: true})
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
		console.log("data", resp)
		res.json("done")
	}catch(e)
	{
		console.log("Error", e)
	}
})
app.post("/data", async(req, res)=>{
	try{
		const {action, formData, other} = req.body
		const {symbol, price, quantity} = formData
		const jsonArray = await csv({ noheader: true, output: "csv" }).fromFile(
			__dirname+"/abc.csv"
		  );
		let values = jsonArray.slice(1)
		let lot 
		for(let i =0; i < values.length; i++)
		{
			if(values[i][2] == symbol)
			{
                lot = values[i][8]
				break;
			}
		}
		console.log(lot)
		if(+quantity % lot == 0)
			{
				await getDetails({action,symbol,price,quantity, other}, res)
			}
		else{
				
			throw new Error(`Quantity should be multiple of ${lot}`)
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

let user = {
    status: 'success',
    data: {
      user_type: 'individual',
      email: 'parit@concepttocode.in',
      user_name: 'Parit Verma',
      user_shortname: 'Parit',
      broker: 'ZERODHA',
      exchanges: [Array],
      products: [Array],
      order_types: [Array],
      avatar_url: null,
      user_id: 'CM5442',
      api_key: '4w75m48lpohhspi1',
      access_token: '3jkcUBmZ1pp34GShJsq1C8GpgnHCOb5p',
      public_token: 'U2bLEr4Mhw9IepiHLCwpiu7Jn3mycOQ4',
      refresh_token: '',
      enctoken: '3LgYdkXPSv/u9Avl5LZIdDxTUZYNdBPU2QZ2livgTht3OoQS9OW/EvEP13J1Zu6VeuZAoRibyBd/8eJc/7Z4ObIPFuMz/IxtVZPBLVFZi9xtE3pkyOO6ke6MqC6NBV8=',
      login_time: '2022-01-21 17:43:43',
      meta: [Object]
    }
  
  }



async function  getDetails(market, res)
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
					 "Authorization": `token ${key}:${user.data.access_token}`,
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
						 "Authorization": `token ${key}:${user.data.access_token}`,
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





app.get("/position", async(req, res)=>{
	try{
     	const data = await axios("https://api.kite.trade/portfolio/positions", {
			method: "get",
			headers: {
				'X-Kite-Version': 3,
				"Authorization": `token ${user.data.api_key}:${user.data.access_token}`
			}
		})
        return res.json({data: data.data})
	}catch(e)
	{
		console.log(e)
	}
})
server.listen(3001, ()=>{
    console.log("Server Started")
})


