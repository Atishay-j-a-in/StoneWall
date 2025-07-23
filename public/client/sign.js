
function togglepass() {
    const set = document.querySelector(".hide")
    const toggbtn = document.querySelector(".toggle")

    if (set.type == "password") {
        toggbtn.textContent = "🙈"
        set.type = "text"
    }
    else {
        toggbtn.textContent = "👁️"
        set.type = "password"
    }
}

function togglepass1() {
    const set = document.querySelector(".hide1")
    const toggbtn = document.querySelector(".toggle1")

    if (set.type == "password") {
        toggbtn.textContent = "🙈"
        set.type = "text"
    }
    else {
        toggbtn.textContent = "👁️"
        set.type = "password"
    }
}


signupform.addEventListener("submit", async (e) => {//type submit used in btn signup will help to activate it

    e.preventDefault()// will not let browser reload and js will handle 

    const fd = new FormData(e.target)//FormData is browser api that collects form fields

    const data = {
        username: fd.get('username'),
        email: fd.get('email'),
        pass: fd.get('pass'),
        repass: fd.get('repass'),

    }
    
    try {
        const res = await fetch('/signup', {
            method: 'POST',
            headers: {//tells server we are sending data
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)

        })
        const result = await res.json() //it handles the respponse got from server
       
        if (res.ok) {
            alert("Registration Succcesful")

            //clear the form
            e.target.reset()

        } else {
            alert('Error:' + result.error)
        }
    } catch (error) {
        alert("Network error:" + error.message)
    }
})


loginform.addEventListener("submit",async(e)=>{
    e.preventDefault()

    const fd= new FormData(e.target)
 
    const data= {
        username:fd.get('username1'),
        pass:fd.get('pass1')
        
    }  
    console.log("login",data)
    try{
        
        const response =await fetch('/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },

                body:JSON.stringify( data)
            })

        const result= await response.json()
       
        if(response.ok && result.redirect){
            window.location.href=result.redirect
        }else{
            alert('Login failed:'+result.error)

        }
    }catch(error){
        alert('Network error:'+ error.message)
    }
})
