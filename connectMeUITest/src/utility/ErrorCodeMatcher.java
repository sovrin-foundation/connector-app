package utility;

import org.hamcrest.Description;
import org.hamcrest.TypeSafeMatcher;
import org.hyperledger.indy.sdk.ErrorCode;
import org.hyperledger.indy.sdk.IndyException;

public class ErrorCodeMatcher extends TypeSafeMatcher<IndyException> {
	private ErrorCode expectedErrorCode;

	public ErrorCodeMatcher(ErrorCode errorCode) {
		this.expectedErrorCode = errorCode;
	}

	@Override
	protected boolean matchesSafely(IndyException e) {
		return expectedErrorCode.equals(e.getErrorCode());
	}

	@Override
	public void describeTo(Description description) {
		description.appendText("expect ").appendText(expectedErrorCode.name());
	}
}
