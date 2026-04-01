const discord_id = localStorage.getItem("discord")

async function load() {

    const res = await fetch(
        "/dashboard/user/" + discord_id
    )

    const data = await res.json()

    document.getElementById("info").innerHTML = `
        Credits: ${data.user.credits}
        <br>
        Servers: ${data.servers.length}
    `
}

async function watchAd() {

    await fetch("/credits/watch-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            discord_id
        })
    })

    load()
}

async function createServer() {

    await fetch("/servers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            discord_id
        })
    })

    load()
}

load()
