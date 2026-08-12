import axios from "axios";

const GITHUB_USER_DATA_END_POINT = "https://api.github.com/user";
const GITHUB_ACCESS_TOKEN_END_POINT = "https://github.com/login/oauth/access_token";
const GITHUB_CLIENT_ID = "Ov23livQotXvtbyB5IYr";
const GITHUB_CLIENT_SECRET = "c6cb0822a7507a8fc9000ce2483af63d92aa75c0";

export class User {
    private authCode: string;
    private token: string | undefined;
    private gID: number | undefined;
    private initPromise: Promise<void>;

    public constructor(authcode: string) {
        this.authCode = authcode;
        this.initPromise = this.init();
    }

    async init(): Promise<void> {
        await this.accessToken();
        await this.getUserID();
    }

    public async getToken(): Promise<string | void> {
        await this.initPromise;
        if (this.token) {
            return this.token;
        }
        return;
    }

    private async accessToken(): Promise<string | void> {
        //body
        const payload = {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: this.authCode
        };
        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        try {
            const response = await axios.post(GITHUB_ACCESS_TOKEN_END_POINT, payload, config);
            if (response) {
                //returns and sets token
                let token = response.data.access_token;
                this.token = token;
                return token;
            } else {
                return;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Request failed: ", error.response?.status, error.response?.data);
            } else {
                console.error(`Unexpected Error: ${error}. Try again later!`)
            }
            return;
        }
    }

    public async getID(): Promise<number | void> {
        await this.initPromise;
        if (this.gID) {
            return this.gID;
        }
        return;
    }

    private async getUserID(): Promise<number | null> {
        const payload = {
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Accept": "application/json"
            }
        };

        try {
            const response = await axios.get(GITHUB_USER_DATA_END_POINT, payload);
            if (response) {
                //returns and sets github user ID
                console.log("getting 1");
                let id = response.data.id;
                this.gID = id;
                return id;
            } else {
                return null;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Request failed: ", error.response?.status, error.response?.data);
            } else {
                console.error(`Unexpected Error: ${error}. Try again later!`)
            }
            return null;
        }
    }

}