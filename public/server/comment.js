let comma=document.querySelector(".comma textarea")
let send1=document.querySelector(".send1 img")
send1.addEventListener("click",async()=>{
    const postCont=comma.value.trim()
    console.log(postCont)
    if(postCont){
        
        try{
            const response=await fetch(`${window.location.href}/comment`,
                {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:
                    JSON.stringify({content:postCont})
                }
            )
            
            if (response.ok) {
                
                const result=await response.json()
                console.log(result)
                comma.value=""//clearing the input after success.
                let path=window.location.href
                window.location.href=path
            }
            else{
                console.log('error:',response.statusText)
            }
        }
        catch(error){
            console.error("error:",error)
        }
    }
})