const express = require("express")

const app = express()
var KiteConnect = require("kiteconnect").KiteConnect;
const key = "4w75m48lpohhspi1"
const secrete = "2dtakgbw0wfbvo68s8y01bz710iadm0j"
app.use(express.json())
var KiteConnect = require("kiteconnect").KiteConnect;
const axios = require("axios")
var kc = new KiteConnect({
	api_key: key
});

kc.generateSession("cN1IDYteAqyIki4fzxb5lnXj1SNnHCD3", secrete)
	.then(function(response) {
		init();
        console.log(response)
	})
	.catch(function(err) {
		console.log(err);
	});

function init() {
	// Fetch equity margins.
	// You can have other api calls here.
	kc.getMargins()
		.then(function(response) {
			// You got user's margin details.
		}).catch(function(err) {
			// Something went wrong.
		});
}
app.get("/gettoken", (req, res)=>{
    console.log(req.query)
    res.json("done")
})
app.post("/data", async(req, res)=>{
	const body = req.body
	if(body.length > 0)
	{
		for(let i = 0; i < body.length; i++)
		{
			getDetails(body[i])
		}
	}
})

async function  getDetails(market)
{   
   if(market["Order_Type"] == "MARKET")
   {    
		const data = {
			"tradingsymbol": market["Tradingsymbol"],
			"exchange": "NSE",
			"transaction_type": market["Type"],
			"quantity": market["Quantity"],
			"product" : market["Product"],
			"order_type": "MARKET",
			"validity": market["Validity"]
		};
		console.log(data)
		await axios({
			url: "https://api.kite.trade/orders/regular",
			method: "post",
			headers: {
				'X-Kite-Version': 3,
				"Authorization": `token ${key}: ${access}`
			},
			data

		})
		// call api here
   }
   else if(market["Order_Type"] == "LIMIT")
   {
	const data = {
		"tradingsymbol": market["Tradingsymbol"],
		"exchange": "NSE",
		"transaction_type": market["Type"],
		"quantity": market["Quantity"],
		"product" : market["Product"],
		"order_type": "LIMIT",
		"validity": market["Validity"],
		"price": market["Price"]
	};
	console.log(data)
	await axios({
		url: "https://api.kite.trade/orders/regular",
		method: "post",
		headers: {
			'X-Kite-Version': 3,
			"Authorization": `token ${key}: ${access}`
		},
		data

	})
	// call api here
   }
   else if(market["Order_Type"] == "SL"){
	const data = {
		"tradingsymbol": market["Tradingsymbol"],
		"exchange": "NSE",
		"transaction_type": market["Type"],
		"quantity": market["Quantity"],
		"product" : market["Product"],
		"order_type": "SL",
		"validity": market["Validity"],
		"price": market["Price"],
		"trigger_price": market["Trigger_Price"]
	};
	console.log(data)
	await axios({
		url: "https://api.kite.trade/orders/regular",
		method: "post",
		headers: {
			'X-Kite-Version': 3,
			"Authorization": `token ${key}: ${access}`
		},
		data

	})
	// call api here
   }
   else if( market["Order_Type"] == "SL-M"){

   }
}
app.listen(3000, ()=>{
    console.log("Server Started")
})


