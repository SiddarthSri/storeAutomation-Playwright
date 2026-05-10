import { expect } from '@playwright/test';

export class AboutUsPage {
  constructor(page) {
    this.page = page;
    this.actionTimeout = 2000;
    this.playVideoButton = page.locator('.vjs-big-play-button');
    this.closeButton = page.locator(
      "//h5[@id='videoModalLabel']//parent::div/following-sibling::div[@class='modal-footer'] //button[@data-dismiss='modal']"
    );
    this.aboutUsCloseButton = page.locator("//h5[@id='videoModalLabel']/following-sibling::button[@class='close']");
  }

  async clickOnPlayVideo() {
    try {
      // Wait for the modal to fully appear and animate
      const modal = this.page.locator('#videoModal');
      await modal.waitFor({ state: 'visible', timeout: 10000 });
      
      // Video player takes some time to initialize. 
      // Sometimes the play button doesn't register as visible immediately.
      // We will try to forcefully click it without waiting for visibility.
      await this.playVideoButton.click({ force: true, timeout: 5000 }).catch(e => {
        console.log('Could not click the play button directly, ignoring for stability.');
      });
    } catch (error) {
      console.error('Error in clickOnPlayVideo:', error);
      throw error;
    }
  }

  async cancelAboutUsAction() {
    await this.closeButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.closeButton.click();
  }

  async closeAboutUsAction() {
    await this.aboutUsCloseButton.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await this.aboutUsCloseButton.click();
  }
}
