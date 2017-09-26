package pageObjects;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Created by ankurmishra on 6/22/17.
 */
public class HockeyAppPage {

	private static WebElement element = null;
	
	public static WebElement UserNameText(AppiumDriver driver) throws Exception {

		try {
			WebDriverWait wait = new WebDriverWait(driver, 90);
			element = wait.until(ExpectedConditions.elementToBeClickable(By.id("user_email")));				
			System.out.println("UserNameText is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("UserNameText is not displayed");
			throw (e);
		}
	}
	
    public static WebElement PasswordText(AppiumDriver driver) throws Exception {

		try {
			element = driver.findElement(By.id("user_password"));
			
			System.out.println("PasswordText is displayed");
			return element;
		} catch (Exception e) {

			System.out.println("PasswordText not is displayed");
			throw (e);
		}
	}
	
	public static WebElement SigninButton(AppiumDriver driver) throws Exception {

			try {
				element = driver.findElement(By.xpath("//button[@type='submit']"));
				System.out.println("Signin Button is displayed");

				return element;
			    } catch (Exception e) {

				System.out.println("Signin Button is not displayed");
				throw (e);
			}

	}
	
	public static WebElement QAConnectIcon(AppiumDriver driver) throws Exception {

			try {
				
				WebDriverWait wait = new WebDriverWait(driver, 120);
				element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//img[@title='QA ConnectMe']")));				
				System.out.println("QAConnect Icon is displayed");

				return element;
			    } catch (Exception e) {

				System.out.println("QAConnect Icon is not displayed");

				throw (e);
			}
		}
	
	public static WebElement InstallButton(AppiumDriver driver) throws Exception {

			try {
				
				WebDriverWait wait = new WebDriverWait(driver, 90);
				element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class='install pull-right']/a")));	
				System.out.println("InstallButton is displayed");

				return element;
			    } catch (Exception e) {

			    System.out.println("InstallButton is not displayed");
     			throw (e);
			}
		}
		
		

}
