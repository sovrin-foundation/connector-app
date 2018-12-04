package pageObjects;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
  
/**
 * Created by ankurmishra on 6/22/17.
 */
public class GmailPage {

	private static WebElement element = null;

	
	@FindBy(name= "identifierId") 
	public static WebElement userName;
	
	public static WebElement UserNameText(AppiumDriver driver) throws Exception {

		try {
			
			WebDriverWait wait = new WebDriverWait(driver, 120);
			element = driver.findElement(By.id("identifierId"));

			//element = wait.until(ExpectedConditions.elementToBeClickable(By.id("identifierId")));
			System.out.println("UserNameText is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("UserNameText  is not found.");


			throw (e);
		}
	}
	
	public static WebElement FirstEmailLink(AppiumDriver driver) throws Exception {

		try {
			WebDriverWait wait = new WebDriverWait(driver, 90);
			element = driver.findElement(By.xpath("//div[@role='listitem']/div"));

			//element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@role='listitem']/div")));	
			System.out.println("FirstEmail Link is displayed");

			return element;
		} catch (Exception e) {

			System.out.println("FirstEmail Link  is not found.");


			throw (e);
		}

	}
	
	public static WebElement ConnectMeLink(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("//td/a[2]"));
			System.out.println("ConnectMeLink is displayed");

			
			return element;
		} catch (Exception e) {

			System.out.println("ConnectMeLink  is not found.");


			throw (e);
		}

	}

	public static WebElement PasswordText(AppiumDriver driver) throws Exception {
		try {

			element = driver.findElement(By.name("password"));
			System.out.println("Password Text is displayed");
			return element;

		} catch (Exception e) {
			System.out.println("Password is not displayed");

			throw (e);

		}
	}

	public static WebElement UserNameNextButton(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.id("identifierNext"));
			System.out.println("NextButton is displayed");

			return element;
		    } catch (Exception e) {

			System.out.println("NextButton is not displayed");

			throw (e);
		}
	}
	
	public static WebElement PasswordNextButton(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.id("passwordNext"));
			System.out.println("NextButton is displayed");

			return element;
		    } catch (Exception e) {

				System.out.println("NextButton is not displayed");
			throw (e);
		}
	}
	
    public static WebElement MobileGmailSiteLink(AppiumDriver driver) throws Exception {

			try {
				element =driver.findElement(By.xpath("//a[text()='mobile Gmail site']"));
				System.out.println("MobileGmail Site Link is displayed");
				return element;
			    } catch (Exception e) {

				System.out.println("MobileGmailSite Link is not displayed");

				throw (e);
			}

	}
		
	public static WebElement Signin(AppiumDriver driver) throws Exception {

			try {
				element = driver.findElement(By.xpath("//button[@type='submit']"));
				System.out.println("Signin is displayed");

				return element;
			    } catch (Exception e) {

				System.out.println("Signin is not displayed");

				throw (e);
			}

	}

	public static WebElement Email_CheckBox(AppiumDriver driver)  {

		try {
			element = driver.findElement(By.xpath("(//div[@role='checkbox'])[1]"));
			System.out.println("Email checkbox is displayed");

		    } catch (Exception e) {
            element =null;
			System.out.println("Email checkbox is not displayed");

		}
		return element;


}

	public static WebElement Delete_Button(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.xpath("//div[@aria-label='Delete']/div"));
			System.out.println("Delete button is displayed");

			return element;
		    } catch (Exception e) {

			System.out.println("Delete button is not displayed");

			throw (e);
		}

}

}
