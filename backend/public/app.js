const params =
    new URLSearchParams(
        window.location.search
    )

const discord_id =
    params.get("discord")

localStorage.setItem(
    "discord",
    discord_id
)

async function load() {

    const res =
        await fetch(
            "/dashboard/user/" +
            discord_id
        )

    const data =
        await res.json()

    document.getElementById(
        "username"
    ).innerText =
        data.user.username

    document.getElementById(
        "credits"
    ).innerText =
        data.user.credits

    document.getElementById(
        "servers"
    ).innerText =
        data.servers.length

    document.getElementById(
        "lastlogin"
    ).innerText =
        new Date(
            data.user.last_login
        ).toLocaleString()

    let container =
        document.getElementById(
            "serverContainer"
        )

    container.innerHTML = ""

    data.servers.forEach(s => {

        container.innerHTML += `
            <div class="card">
                Server ID: ${s.ptero_server_id}
                <br>
                Password: ${s.password}
            </div>
        `
    })
}

async function watchAd() {

    await fetch("/credits/watch-ad", {

        method: "POST",
        headers: {
            "Content-Type":
                "application/json"
        },
        body: JSON.stringify({
            discord_id
        })
    })

    load()
}

async function createServer() {

    await fetch("/servers/create", {

        method: "POST",
        headers: {
            "Content-Type":
                "application/json"
        },
        body: JSON.stringify({
            discord_id
        })
    })

    load()
}

load()
