const axios = require('axios')

export class HealthcheckUtils {
    constructor() {}

    public async checkService() {
        try {
            const response = await axios.get("http://localhost:5000/healthcheck")
            return response
        } catch (error: any) {
            throw new Error(`Healthcheck Utils Check Service error: ${error.message}`)
        }
    }
}