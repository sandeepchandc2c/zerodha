
import {useState, useEffect} from "react"

import axios from "axios"
import {useParams} from "react-router-dom"
function CreateOrders() {
  const [data, setdata] = useState([])
  const [symbolsdata, setSymbol]  = useState([])
  const param = useParams()
  const [formData, setFormData] = useState({
    symbol: "",
    price: "",
    quantity: "",


  })
  async function getdata()
  { 
    const {id} = param
    const data = await axios.get("http://localhost:3001/position/"+id)
    setdata(data.data.data.data.net)
  }
  async function getSymbol(){
    
    const data = await axios.get("http://localhost:3001/orders")
    setSymbol(data.data.data)
  }
  useEffect(()=>{

    getdata()
    // getSymbol()
    setInterval(()=>{
  
    getdata()
    }, 10000)
  },[])
 
   const onChange = (e) =>{
     
    setFormData({ ...formData, [e.target.name]: e.target.value })
   };
   
  const senddata = async(e)=>{
      console.log(e.target.value)
      
     if(e.target.value!== "1")
     {
      let prev = data.find(item=> item.tradingsymbol == formData.symbol)
      try{
        const {id} = param
        await axios({
          url: "http://localhost:3001/data/"+id,
          method: "post",
          data: {
            formData,
            action: e.target.value,
            other: prev
          }
        })
        alert("done")
        document.getElementById("select1").value = "1"
      }
      catch(e)
      {
        alert(e.response.data.message)
        document.getElementById("select1").value = "1"
      }
     }
     else{
       alert("Invalid action")
       document.getElementById("select1").value = "1"
     }
  }
  
  return (
    <>
    
    <div className="card">
    <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
        
    </h3>
    <div className="card-body">
    <div class="row p-4">
      <div class="col md-4">
      <div class="form-outline">
       <select name="symbol" onChange={onChange} class="browser-default custom-select">
          <option value="1">Select Symbol</option>
          {data.map((item, index)=>
          <option  key={index} value={item.tradingsymbol} data-action={item.lot_size}>{item.tradingsymbol}</option>)}
        </select>
        </div>
      </div>
      <div class="col md-3">
        <div class="form-outline">
          <input name="price" onChange={onChange}  type="number"placeholder="price" id="form8Example3" class="form-control" />
        </div>
      </div>
      <div class="col md-3">
        <div class="form-outline">
          <input type="number" onChange={onChange}  name="quantity" placeholder="Quantity" id="form8Example4" class="form-control" />
        </div>
      </div>
      <div class="col md-3">
        <select onChange={(e)=>senddata(e)} id="select1"  class="browser-default custom-select">
            <option value="1">Action</option>
            <option value={"BUY"}>BUY</option>
            <option value={"SELL"}>SELL</option>
        </select>
      </div>
  
    </div>
    </div>
    
    </div>
    <div className="card">
    <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
        Positions
    </h3>
    <div className="card-body">
        <div id="table" className="table-editable">
        <span className="table-add float-right mb-3 mr-2"
            ></span>
        <table className="table table-bordered table-responsive-md table-striped text-center">
            <thead>
            <tr>
                <th className="text-center">SYMBOL</th>
                <th className="text-center">Exchange</th>
                <th className="text-center">Product</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Net value of the position</th>
                <th className="text-center">LTP</th>
                <th className="text-center">P&L</th>
            </tr>
            </thead>
            <tbody>
            {data.length > 0  && data.map((item, index)=>(
                <tr key={index}>
                <td className="pt-3-half">{item.tradingsymbol}</td>
                <td className="pt-3-half">{item.exchange}</td>
                {/* <td className="pt-3-half" contenteditable="true">
                    <select onChange={(e)=>senddata(e,item, index)} className="browser-default custom-select">
                      <option >Type</option>
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                </td> */}
                <td className="pt-3-half">{item.product}</td>
                <td className="pt-3-half" >{item.quantity}</td>
                <td className="pt-3-half" >{item.value}</td>
                <td className="pt-3-half" >{item.last_price}</td>
                <td className="pt-3-half" >
                {item.pnl}
                </td>
                {/* <td className="pt-3-half" contenteditable="true">
                    <select onChange={(e)=>{
                      data[index]["position_type"] = e.target.value
                    }} className="browser-default custom-select">
                      <option>Type</option>
                      <option value="overnight">Over Night </option>
                      <option value="day">DAY</option>
                    </select>
                </td> */}
            </tr> 
            ))}
            </tbody>
        </table>
        </div>
    </div>
    
    </div>
    



    </>
  );
}

export default CreateOrders;
 