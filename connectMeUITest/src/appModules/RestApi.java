package appModules;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class RestApi {
	
public  String post(String bodyParam) throws Exception 
	
	{
	    String env=readConfig("env");
	    String path=readConfig("path");
	    int statusCodeResponse;
		RestAssured.baseURI = env+path;
		Response ResponseRest = RestAssured.given()
	    .contentType("application/json").
	    body(bodyParam).
	    when().
	    post("");
		// Retrieve the body of the Response
		// To check for sub string presence get the Response body as a String.
		// Do a String.contains
		String bodyAsString = ResponseRest.getBody().asString();
		statusCodeResponse = ResponseRest.getStatusCode();
		System.out.println(bodyAsString);
		return bodyAsString;
	}


	
	public static String readConfig(String Property) throws Exception 

	{

		InputStream in = new FileInputStream("config.properties");
	    Properties prop = new Properties();
	    prop.load(in);
	    return  prop.getProperty(Property);
	    		
	}
	
	public String createPairwiseKey(String pairwiseDID,String pairwiseVerkey) throws Exception
	{
		
	 String bodyParam;
	 bodyParam=  "{\"to\":\"W3Htwqb4uxzUWwoqRPYmKU\",\"agentPayload\":\"{\\\"type\\\":\\\"CREATE_KEY\\\",\\\"forDID\\\":\\\""+pairwiseDID+"\\\",\\\"forDIDVerKey\\\":\\\""+pairwiseVerkey+"\\\",\\\"nonce\\\":\\\"N1234\\\"}\"}";
	 System.out.println(bodyParam);
	 String response=post(bodyParam);
	 return response;
		        		
	}
	
	public String setProfileData(String pairwiseDID,String name) throws Exception
	{
	 String bodyParam;	 
	 bodyParam=   "{\"to\":\""+pairwiseDID+"\",\"agentPayload\":\"{\\\"type\\\":\\\"UPDATE_PROFILE_DATA\\\",\\\"name\\\":\\\""+name+"\\\",\\\"logoUrl\\\":\\\"https://checkleague.com/wp-content/uploads/2016/12/Arsenal-FC-logo.png\\\"}\"}";
	 System.out.println(bodyParam);
	 String response=post(bodyParam);
	 return response;		        		
	}
	
	public String sendInvite(String pairwiseDID,String delegate,String phoneNumber) throws Exception
	{
	 String bodyParam;	 
	 bodyParam=   "{\"to\":\""+pairwiseDID+"\",\"agentPayload\":\"{\\\"type\\\":\\\"SEND_INVITE\\\",\\\"keyDlgProof\\\":\\\""+delegate+"\\\",\\\"phoneNumber\\\":\\\""+phoneNumber+"\\\"}\"}";
	 System.out.println(bodyParam);
	 String response=post(bodyParam);
	 return response;	
		        		
	}
	
	public void sendClaimOffer(String pairwiseDID) throws Exception
	{
     String bodyParam="{\"to\":\""+pairwiseDID+"\",\"agentPayload\":\"{\\\"type\\\":\\\"SEND_MSG\\\",\\\"uid\\\":\\\"D1234\\\",\\\"msgType\\\":\\\"claimOffer\\\",\\\"statusCode\\\":\\\"\\\",\\\"edgeAgentPayload\\\":\\\"{\\\\\\\"msg_type\\\\\\\":\\\\\\\"CLAIM_OFFER\\\\\\\",\\\\\\\"version\\\\\\\":\\\\\\\"0.1\\\\\\\",\\\\\\\"to_did\\\\\\\":\\\\\\\"BnRXf8yDMUwGyZVDkSENeq\\\\\\\",\\\\\\\"from_did\\\\\\\":\\\\\\\"GxtnGN6ypZYgEqcftSQFnC\\\\\\\",\\\\\\\"iid\\\\\\\":\\\\\\\"cCanHnpFAD\\\\\\\",\\\\\\\"mid\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"claim\\\\\\\":{\\\\\\\"name\\\\\\\":[\\\\\\\"Alice\\\\\\\"],\\\\\\\"date_of_birth\\\\\\\":[\\\\\\\"2000-05-17\\\\\\\"],\\\\\\\"height\\\\\\\":[\\\\\\\"175\\\\\\\"]},\\\\\\\"schema_seq_no\\\\\\\":103,\\\\\\\"issuer_did\\\\\\\":\\\\\\\"V4SGRU86Z58d6TV7PBUe6f\\\\\\\",\\\\\\\"nonce\\\\\\\":\\\\\\\"351590\\\\\\\",\\\\\\\"claim_name\\\\\\\":\\\\\\\"Profile detail\\\\\\\",\\\\\\\"issuer_name\\\\\\\":\\\\\\\"Test Enterprise\\\\\\\",\\\\\\\"optional_data\\\\\\\":{\\\\\\\"terms_of_service\\\\\\\":\\\\\\\"<Large block of text>\\\\\\\",\\\\\\\"price\\\\\\\":6}}\\\",\\\"refMsgId\\\":\\\"<ph_ref_msg_uid_ph>\\\"}\"}";
	 System.out.println(bodyParam);
     String response=post(bodyParam);
	 System.out.println("claim send");
  }
	
	public void sendClaim(String pairwiseDID) throws Exception
 {	 
     Thread.sleep(10000);
     String bodyParam="{\"to\":\""+pairwiseDID+"\",\"agentPayload\":\"{\\\"type\\\":\\\"GET_MSGS\\\",\\\"uid\\\":\\\"D1234\\\",\\\"msgType\\\":\\\"\\\",\\\"statusCode\\\":\\\"\\\",\\\"includeEdgePayload\\\":\\\"\\\"}\"}";
	 System.out.println(bodyParam);
     String response=post(bodyParam);
     String refmsgID = response.substring(response.indexOf("refMsgId") + 11 , response.indexOf("refMsgId") + 18); 
	 System.out.println(refmsgID);
     String bodyParam1="{\"to\":\""+pairwiseDID+"\",\"agentPayload\":\"{\\\"type\\\":\\\"SEND_MSG\\\",\\\"uid\\\":\\\"\\\",\\\"msgType\\\":\\\"claim\\\",\\\"statusCode\\\":\\\"\\\",\\\"edgeAgentPayload\\\":\\\"{\\\\\\\"claim\\\\\\\":{\\\\\\\"name\\\\\\\":[\\\\\\\"Alex\\\\\\\",\\\\\\\"1139481716457488690172217916278103335\\\\\\\"],\\\\\\\"sex\\\\\\\":[\\\\\\\"male\\\\\\\",\\\\\\\"5944657099558967239210949258394887428692050081607692519917050011144233115103\\\\\\\"]},\\\\\\\"schema_seq_no\\\\\\\":103,\\\\\\\"signature\\\\\\\":{\\\\\\\"primary_claim\\\\\\\":{\\\\\\\"m2\\\\\\\":\\\\\\\"20420316692351924311646177502077807792663617478067197592943163185944705998086\\\\\\\",\\\\\\\"a\\\\\\\":\\\\\\\"6566933350903129549607506537052766175425374074293055985386482806651956523613033232784371440102253415107754287206736745010694086103475076726057412045714848896081925277890684071381506791238043778647931991613089426559284979043709210151879787062364992915332100756152496639410873470601461533911947819555704592146218936223533854606001543620219656009153675614820725496282116620954545522829316389888863026209825136532918285775690115300880509988032635212766579185918477193610761745685529819239340742430784095253336377095499209553031138865018474149603100771289370720726560604625816012353662105226538841250169314045056764074461\\\\\\\",\\\\\\\"e\\\\\\\":\\\\\\\"259344723055062059907025491480697571938277889515152306249728583105665800713306759149981690559193987143012367913206299323899696942213235956742930052211521081746994120820185516719379\\\\\\\",\\\\\\\"v\\\\\\\":\\\\\\\"9482621276448459633945009869444750066626556234441628126928564119686558376128010445622415684612535944073964037810663902133879346067623757047447523062669481606143738916410735682773742567768433718389737330577863602493726725323797355821453920302906670150628953430106137563315403977577258933843271153538961703231007803960296253688143375067131550178877039597097455288310512563867389993393757674719926577610494706037219218929640237427253257167336626804790181008486658246008024756687915693696685042619930860220105293836822633946075770340137818192495484624755643137108662078919873573105867271946717570030746467378115245928967644122656737772484769676110383526846938274626045976981598608757559187597668625085925181068712044877744074038255669950863257335429715952293392555802166376206725435619931437992697064445409294375384001630016\\\\\\\"},\\\\\\\"non_revocation_claim\\\\\\\":null},\\\\\\\"issuer_did\\\\\\\":\\\\\\\"V4SGRU86Z58d6TV7PBUe6f\\\\\\\",\\\\\\\"msg_type\\\\\\\":\\\\\\\"CLAIM\\\\\\\",\\\\\\\"version\\\\\\\":\\\\\\\"0.1\\\\\\\",\\\\\\\"claim_offer_id\\\\\\\":\\\\\\\"D1234\\\\\\\",\\\\\\\"from_did\\\\\\\":\\\\\\\""+pairwiseDID+"\\\\\\\"}\\\",\\\"refMsgId\\\":\\\""+refmsgID+"\\\"}\"}";
	 System.out.println(bodyParam1);
     String response1=post(bodyParam1);

   }

	
}
