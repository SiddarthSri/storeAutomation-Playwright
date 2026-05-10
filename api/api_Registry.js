class ApiRegistry {
    constructor() {
        this.baseUrl = 'https://api.demoblaze.com';
        
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
