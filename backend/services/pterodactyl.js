const axios = require("axios")

const panel = axios.create({
    baseURL: process.env.PTERO_URL,
    headers: {
        Authorization: "Bearer " + process.env.PTERO_API_KEY,
        Accept: "Application/vnd.pterodactyl.v1+json",
        "Content-Type": "application/json"
    }
})

async function getOrCreateUser(username, discord_id) {

    if (process.env.TESTING_MODE === "true") {
        return 1
    }

    const users = await panel.get(
        `/api/application/users?filter[email]=${discord_id}@dci.local`
    )

    if (users.data.data.length > 0)
        return users.data.data[0].attributes.id

    const res = await panel.post(
        "/api/application/users",
        {
            username: username,
            email: `${discord_id}@dci.local`,
            first_name: username,
            last_name: "User",
            password: "TempPass123!"
        }
    )

    return res.data.attributes.id
}

async function createServer(username, discord_id, password, number) {

    if (process.env.TESTING_MODE === "true") {
        console.log("[TEST] create server", username)
        return { id: "test-" + number }
    }

    const userId = await getOrCreateUser(
        username,
        discord_id
    )

    const res = await panel.post(
        "/api/application/servers",
        {
            name: `${username}-${number}`,
            user: userId,
            egg: parseInt(process.env.DEFAULT_EGG),
            nest: parseInt(process.env.DEFAULT_NEST),
            docker_image: process.env.DEFAULT_IMAGE,
            startup: process.env.DEFAULT_STARTUP,

            environment: {},

            limits: {
                memory: parseInt(process.env.DEFAULT_MEMORY),
                disk: parseInt(process.env.DEFAULT_DISK),
                cpu: parseInt(process.env.DEFAULT_CPU)
            },

            feature_limits: {
                databases: 0,
                backups: 1,
                allocations: 1
            },

            allocation: {
                default: parseInt(
                    process.env.DEFAULT_ALLOCATION
                )
            }
        }
    )

    return res.data.attributes
}

async function suspendServer(id) {

    if (process.env.TESTING_MODE === "true") {
        console.log("[TEST] suspend", id)
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
