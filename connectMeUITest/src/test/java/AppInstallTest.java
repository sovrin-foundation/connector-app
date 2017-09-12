
package test.java;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MultiTouchAction;
import io.appium.java_client.TouchAction;

import java.util.HashMap;
import org.apache.log4j.xml.DOMConfigurator;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.*;

import appModules.AppUtlis;
import appModules.RestApi;
import pageObjects.GmailPage;
import pageObjects.HockeyAppPage;
import pageObjects.HomePage;
import utility.Setup;
import utility.*;
@Test
public class AppInstallTest {

	public AppiumDriver driver;

	static int Retry=0;
	static boolean Success=false;
	@BeforeMethod //testng 

	public void beforeMethod() throws Exception {

		driver = Setup.ConfigureDriver("Safari");
	}


    @Test
	public void AppInstall() throws Exception {
		
		driver.get("https://gmail.com");
		GmailPage.UserNameText(driver).sendKeys("evernym.number@gmail.com");
		GmailPage.UserNameNextButton(driver).click();
		GmailPage.PasswordText(driver).sendKeys("evernym123");
		GmailPage.PasswordNextButton(driver).click();
    	Thread.sleep(20000);//used sleep which is not recommended as we have issue with synch of gmail opening 
    	GmailPage.MobileGmailSiteLink(driver).click();
    	if(GmailPage.Email_CheckBox(driver)!=null)
    	{
    	GmailPage.Email_CheckBox(driver).click();
    	GmailPage.Delete_Button(driver).click();
		}
    	AppUtlis AppUtlisObj=new AppUtlis();
		AppUtlisObj.sendSmsRestApi();
		Thread.sleep(5000);
		driver.navigate().refresh();
	   	GmailPage.FirstEmailLink(driver).click();
    	String ConnectMeLink =GmailPage.ConnectMeLink(driver).getAttribute("href");
		System.out.println(ConnectMeLink);
		driver.get(ConnectMeLink);
		HockeyAppPage.UserNameText(driver).sendKeys("ankur.mishra@evernym.com");
		HockeyAppPage.PasswordText(driver).sendKeys("Password12$");
		HockeyAppPage.SigninButton(driver).click();    	
     	HockeyAppPage.QAConnectIcon(driver).click();  	
    	String InstallConnectMeLink =HockeyAppPage.InstallButton(driver).getAttribute("href");
		System.out.println();
    	driver.get(InstallConnectMeLink);
    	Thread.sleep(5000);//used sleep which is not recommended as we have issue with synch of alert box
    	driver.switchTo().alert().accept();
        AppUtlis.Success=true;
    }

	@AfterMethod
	public void afterMethod() {

		driver.quit();
		System.out.println("Cleaning up Completed");

	}
}