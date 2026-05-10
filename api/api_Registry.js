class ApiRegistry {
    constructor() {
        if (!process.env.API_BASE_URL) throw new Error('API_BASE_URL is not set. Check your .env.prod or GitHub secrets.');
        this.baseUrl = process.env.API_BASE_URL;
        
        this.endpoints = {
            signup: `${this.baseUrl}/signup`,
            login: `${this.baseUrl}/login`,
            entries: `${this.baseUrl}/entries`,
            addToCart: `${this.baseUrl}/addtocart`,
            viewCart: `${this.baseUrl}/viewcart`,
            deleteItem: `${this.baseUrl}/deleteitem`
        };
    }

    getEndpoint(name) {
        if (!this.endpoints[name]) {
            throw new Error(`API endpoint '${name}' not found in registry.`);
        }
        return this.endpoints[name];
    }
}

export default new ApiRegistry();
