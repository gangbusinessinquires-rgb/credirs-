const axios = require("axios")

const panel = axios.create({
    baseURL: process.env.PTERO_URL,
    headers: {
        Authorization: "Bearer " + process.env.PTERO_API_KEY,
        Accept: "Application/vnd.pterodactyl.v1+json",
        "Content-Type": "application/json"
    }
})

async function createServer(username, password, number) {

    if (process.env.TESTING_MODE === "true") {
        console.log("[TEST] Creating server for", username)
        return { id: "test-server-" + number }
    }

    const res = await panel.post(
        "/api/application/servers",
        {
            name: username + "-" + number,
            user: 1,
            egg: process.env.DEFAULT_EGG,
            docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
            startup: "npm start",
            environment: {},
            limits: {
                memory: process.env.DEFAULT_MEMORY,
                disk: process.env.DEFAULT_DISK,
                cpu: process.env.DEFAULT_CPU
            },
            feature_limits: {
                databases: 0,
                backups: 1,
                allocations: 1
            },
            allocation: {
                default: 1
            }
        }
    )

    return res.data.attributes
}

async function suspendServer(id) {

    if (process.env.TESTING_MODE === "true") {
        console.log("[TEST] Suspend", id)
        return
    }

    await panel.post(
        `/api/application/servers/${id}/suspend`
    )
}

module.exports = {
    createServer,
    suspendServer
}
