package appModules;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class RestApi {
	
	
	LibIndy LibIndyObj=new LibIndy();
	public static String  ResponseSendSms;

	public  String sendPostRequest(String requestUrl, String payload,String requestType) {
        StringBuffer jsonString = new StringBuffer();

	    try {
	        URL url = new URL(requestUrl);
	        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	        connection.setDoInput(true);
	        connection.setDoOutput(true);
	        connection.setRequestMethod(requestType);
	        connection.setRequestProperty("Accept", "application/json");
	        connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
	        if (payload!="")
	        {
	        OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream(), "UTF-8");
	        writer.write(payload);
	        writer.close();
	        }
	        
	        BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	        String line;
	        while ((line = br.readLine()) != null) {
	                jsonString.append(line);
	                System.out.println(jsonString);
	        }
	        br.close();
	    } catch (Exception e) {
	            throw new RuntimeException(e.getMessage());
	    }
	    return jsonString.toString();
	}
	
	
	
	public void sendSmsRestApi(String Env) throws Exception
	{	
		String payload=null;
	    String requestUrl=null;
	    LibIndyObj.testCreateMyDidWorksForEmptyJson();
	    LibIndyObj.testSignWorks();
	    System.out.println("Verkey is "+LibIndy.V1);
	    System.out.println("Signature 1 is "+ LibIndy.Signature1);
	    System.out.println("Signature 2 is "+ LibIndy.Signature2);
	    System.out.println("did 2 is "+ LibIndy.DID2);
		if (Env=="Demo")
		{
		 payload="{\"challenge\":\"{\\\"verKey\\\":\\\""+LibIndy.V1+"\\\",\\\"targetHostDID\\\":\\\"MbVrbbVfvu7duSJWG6XxwR\\\",\\\"phoneNumber\\\":\\\"8327364896\\\",\\\"pairwiseDID\\\":\\\""+LibIndy.DID2+"\\\"}\",\"signature\":\""+LibIndy.Signature1+"\"}";
		 requestUrl="https://agency-ea.evernym.com/agent/5iZiu2aLYrQXSdonEtrTA2/connection-req";//PairwiseID
		 System.out.println("Demo");
		}
		else
		{
		 payload="{\"challenge\":\"{\\\"verKey\\\":\\\""+LibIndy.V1+"\\\",\\\"targetHostDID\\\":\\\"MbVrbbVfvu7duSJWG6XxwR\\\",\\\"phoneNumber\\\":\\\"8327364896\\\",\\\"pairwiseDID\\\":\\\""+LibIndy.DID2+"\\\"}\",\"signature\":\""+LibIndy.Signature1+"\"}";
	     requestUrl="https://agency-ea-sandbox.evernym.com/agent/5iZiu2aLYrQXSdonEtrTA2/connection-req";
		}
		String requestType="POST";
		System.out.println(payload);
		System.out.println(requestUrl);

		ResponseSendSms=sendPostRequest(requestUrl, payload,requestType);
		System.out.println("send sms api");		
		
	}
	
	

	
}
