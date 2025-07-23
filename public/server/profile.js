let fbtn = document.querySelector(".fbtn")
fbtn.addEventListener("click", async () => {
    try {
        let path = window.location.href
        let response = await fetch(`${path}/follow`,
            {
                method: "POST"
            }
        )
        if (response.ok) {
            let result = await response.json()

            if (result.message === "added") {
                fbtn.innerHTML = "<button class='unfollow'>Unfollow</button>"
            }
            else if (result.message === "removed") {
                fbtn.innerHTML = "<button class='follow2'>Follow</button>"
            }
              let path=window.location.href
                window.location.href=path
        }

    } catch (error) {

    }
})