import {useState} from "react"
import axios from "axios"
import {useNavigate } from "react-router-dom"
const Login = (e)=>{
    const history = useNavigate()
    const [email, setEmail] = useState("")
    const sumbit = async(e)=>{
        e.preventDefault()
        if(email)
        {
           try{
              const user =await axios({
                  method: "post",
                  url: "http://localhost:3001/user",
                  data: {
                      email
                  }
              })
             history("/position/"+user.data.email)
              
           }catch(e)
           {
            alert(e.response.data.message)
           }
        }
        else{
            alert("please enter valid email")
        }
    }
    return <div className="row justify-content-center p-4">
        <div className="col-md-6">
            <form className="text-center border border-light p-5" onSubmit={(e)=>{
                sumbit(e)
            }}>
                <p className="h4 mb-4">Sign in</p>
                <input onChange={(e)=>setEmail(e.target.value)} type="email" id="defaultLoginFormEmail" className="form-control mb-4" placeholder="E-mail"/>
                 <button className="btn btn-info btn-block my-4" type="submit">Sign in</button>
            </form>
        </div>
    </div>
}
export default Login