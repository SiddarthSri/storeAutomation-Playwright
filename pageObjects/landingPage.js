const { expect } = require("@playwright/test");
//const credentials = JSON.parse(JSON.stringify(require('../data/credentials.json')));

class LandingPage
{
    constructor(page)
    {
        this.page = page;
        this.webSiteurl = "https://www.demoblaze.com/";
        this.loginButton = page.locator("a[data-target='#logInModal']");
        this.usernameBox = page.locator("#loginusername");
        this.passwordBox = page.locator("#loginpassword");
        this.loginSubmit = page.locator("button[onclick='logIn()']");
        this.loggedInuser = page.locator('#nameofuser');
        this.closeButton = page.locator("//h5[@id='logInModalLabel']//parent::div/following-sibling::div[@class='modal-footer'] //button[@data-dismiss='modal']")
    }

    async performLoginaction()
    {
        await this.page.goto(this.webSiteurl)
        await this.loginButton.click();
        await this.usernameBox.fill('testpractice605');
        await this.passwordBox.fill('TestPractice_new55');
        await this.loginSubmit.click();
    }

    async cancelLoginAction()
    {
        await this.page.goto(this.webSiteurl)
        await this.loginButton.click();
        await this.closeButton.click();
    }
}


module.exports = {LandingPage};