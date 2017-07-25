package appModules;

import io.appium.java_client.AppiumDriver;
import pageObjects.ConnectionDetailPage;
import pageObjects.HomePage;
import pageObjects.InvitationPage;

import java.util.HashMap;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

//import AppiumUtils;

public class AppUtlis {
	

	public  void acceptRequest(AppiumDriver driver) throws Exception
	
	{
		AppiumUtils.nClick(4,InvitationPage.Inviation_Text_Container(driver));
		InvitationPage.Allow_Button(driver).click();
		
	}
	
	public String getIdentifier(AppiumDriver driver) throws Exception
	{
		System.out.println("Scroll down");
		JavascriptExecutor js = (JavascriptExecutor) driver;
		HashMap<String, String> scrollObject = new HashMap<String, String>();
		scrollObject.put("direction", "down");
		js.executeScript("mobile: scroll", scrollObject);
		System.out.println("Scroll down sucessfull");
		AppiumUtils.nClick(3,HomePage.avatar_photo(driver));
		System.out.println("tapped three type on avatar photo");
		driver.switchTo().alert();
		System.out.println("Switched to alert");
		String Identifier = HomePage.Alert_Box(driver).getAttribute("name");
		System.out.println("Getting the Identifier");
		Identifier = Identifier.substring(13);
		System.out.println("Identifier"+" "+"for installed app is "+Identifier);
    	driver.switchTo().alert().accept();
		return Identifier;
		
		
	}

	
}
