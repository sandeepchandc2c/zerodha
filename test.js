var KiteTicker = require("kiteconnect").KiteTicker;
var ticker = new KiteTicker({
	api_key: "4w75m48lpohhspi1",
	access_token: "n8LTDrB2K7EX60977mUKTHFyeNIAEern"
});

// ticker.autoReconnect(true, 10, 5)
ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);

ticker.on("noreconnect", function() {
	console.log("noreconnect");
});


ticker.on("error", (e)=>{
  console.log("err", e)
})
function onTicks(ticks) {
	console.log("Ticks", JSON.stringify(ticks));
}

function subscribe() {
	var items =  [9162754];
	ticker.subscribe(items);
	ticker.setMode(ticker.ReadFull, items);
}
