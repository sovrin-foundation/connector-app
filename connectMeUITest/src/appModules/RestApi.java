package appModules;

import org.json.JSONException;
import org.json.JSONObject;

import com.jayway.restassured.builder.RequestSpecBuilder;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSpecification;
import static com.jayway.restassured.RestAssured.given;

public class RestApi {

	public void httpPost() throws JSONException, InterruptedException {

		// Initializing Rest API's URL
		String APIUrl = "https://callcenter.evernym.com/agent/id/LHZ2PapMMYpFrwG8w82XHa/auth";

		// Initializing payload or API body
		String APIBody = "{\"sendPushNotif\":\"Y\",\"message\":\"Are you on the phone with Amit at Suncoast?\"}"; 
		// e.g.-// "{\"key1\":\"value1\",\"key2\":\"value2\"}"

		// Building request using requestSpecBuilder
		RequestSpecBuilder builder = new RequestSpecBuilder();

		// Setting API's body
		builder.setBody(APIBody);

		// Setting content type as application/json or application/xml
		builder.setContentType("application/json; charset=UTF-8");

		RequestSpecification requestSpec = builder.build();

		// Making post request with authentication, leave blank in case there
		// are no credentials- basic("","")
		Response response = given().authentication().preemptive().basic("", "").spec(requestSpec).when().post(APIUrl);
		try {
			JSONObject JSONResponseBody = new JSONObject(response.body().asString());
		} catch (org.json.JSONException e) {
			e.printStackTrace();
		}

	}
}
