let send=document.querySelector(".send img")
let txt= document.querySelector("textarea[name='content']")
let like=document.querySelectorAll(".like")
let dislike=document.querySelectorAll(".dislike")
let comm=document.querySelectorAll(".comment")
let user2=document.querySelectorAll(".username")
let bio= document.querySelector(".biobox textarea")
let bioSend=document.querySelector(".biobox img")

send.addEventListener("click",async()=>{
    const postCont=txt.value.trim()
    console.log(postCont)
    if(postCont){
        
        try{
            const response=await fetch(`${window.location.href}/post`,
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
                txt.value=""//clearing the input after success.
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



like.forEach(element => {
    element.addEventListener("click",async()=>{
        let postid=element.getAttribute("data-postid")
        try{
            let response=await fetch(window.location.href+`/${postid}`,{
                method:'POST',
                headers:{
                        'Content-Type':'application/json'
                    },
                body:
                JSON.stringify({reaction:"like"})
            })
            if(response.ok){
                const data= await response.json()
                console.log(data)
          
                let path=window.location.href
                window.location.href=path

            }
        }
        catch(error){
            console.log(error)
        }
    })
});
dislike.forEach(element => {
    element.addEventListener("click",async()=>{
        let postid=element.getAttribute("data-postid")
        try{
            let response=await fetch(window.location.href+`/${postid}`,{
                method:'POST',
                headers:{
                        'Content-Type':'application/json'
                    },
                body:
                JSON.stringify({reaction:"dislike"})
            })
            if(response.ok){
                const data= await response.json()
                console.log(data)
                let path=window.location.href
                window.location.href=path

            }
        }
        catch(error){
            console.log(error)
        }
    })
});

user2.forEach(element => {
    element.addEventListener("click",()=>{
        let pt=element.innerHTML.split(">")[1].trim()
       let path=window.location.href
       path=path.split("/")
       let me=path[path.length-1]
       console.log(`/${me}/${pt}`)
       
       window.location.href=`/${me}/${pt}`
    })
});

comm.forEach(element => {
    element.addEventListener("click",async()=>{
        let postid=element.getAttribute("data-postid")
        const currSlug=window.location.pathname.split('/')[1]
        window.location.href=`/${currSlug}/comment?postId=${postid}`
        
    })
});
try{
    bioSend.addEventListener("click",async ()=>{
 let bioV=bio.value
 let path=window.location.href
    try{
        let response=await fetch(`${path}/bio`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({bio:bioV})
        })
       
        console.log(response)
        if (response.ok) {
         let result = await response.json()
        console.log(result)
        window.location.href=path
        }
        else{

        }
    }catch(error){

    }
    
})

}catch(error){
    console.log(error)
}



let media= window.matchMedia('(max-width:500px)')
let bun= document.querySelector(".profile")
function handleMedia(e){
    if (e.matches) {
        
        bun.style.left="0px"
        
    }
}

let logo= document.querySelector(".logo")
logo.addEventListener("click",()=>{
            console.log("clicked")
            handleMedia(media)
        })


let arrow=document.querySelector(".arrow")
arrow.addEventListener("click",()=>{
    bun.style.left="-350px"
})