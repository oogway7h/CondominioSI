import axios from "axios";
function Profile(){

    const getUserData = async(e) =>{
        
        try{
            const user=await axios.get("http://127.0.0.1:7000/personas/obtener_datos/");
            console.log (user.data);
        }
        catch(err){
            console.log("error al obtener datos del usuario");
        }
    };
    return <h1>Hola</h1>

}

export default Profile;