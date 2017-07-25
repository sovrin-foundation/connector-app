package appModules;

import org.openqa.selenium.WebElement;

import io.appium.java_client.AppiumDriver;
import pageObjects.InvitationPage;

public class AppiumUtils {
	public AppiumDriver driver;

	
	public static void nClick(int n,WebElement element) throws Exception
	{
		
		for(int i=0; i < n; i++)
		{
			element.click();
		}
	}
	

}
