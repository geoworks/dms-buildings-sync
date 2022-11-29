import fetch from 'node-fetch';

interface CookieAndRequestVerificationToken {
  cookie: string,
  requestVerificationToken: string
}

let connectAuthorize = async (
  url: string,
): Promise<CookieAndRequestVerificationToken> => {
  try {
    console.log('connectAuthorize url', url)
    let response = await fetch(
      url,
      {
        method: 'GET',
      }
    );
    if (response.status !== 200) {
      throw new Error('response.status = ' + response.status);
    }
    let potentialCookie = response.headers.get('set-cookie');
    if (!potentialCookie) {
      throw new Error('no potentialCookie');
    }
    let responseText = await response.text();
    let requestVerificationTokenSearchInputStart = '<input name="__RequestVerificationToken"';
    let startIndexInput = responseText.indexOf(requestVerificationTokenSearchInputStart);
    if (startIndexInput == -1) {
      throw new Error('не удалось найти' + requestVerificationTokenSearchInputStart);
    }
    let responseTextSlicedInputWithStartIndex = responseText.slice(startIndexInput + requestVerificationTokenSearchInputStart.length);
    let requestVerificationTokenSearchInputEnd = '/>';
    let endIndexInput = responseTextSlicedInputWithStartIndex.indexOf(requestVerificationTokenSearchInputEnd);
    let inputStrHandle = responseTextSlicedInputWithStartIndex.slice(0, endIndexInput);
    let requestVerificationTokenSearchValueStart = 'value="';
    let startIndexValue = inputStrHandle.indexOf(requestVerificationTokenSearchValueStart);
    if (startIndexValue == -1) {
      throw new Error('не удалось найти' + requestVerificationTokenSearchValueStart);
    }
    let responseTextSlicedValueWithStartIndex = inputStrHandle.slice(startIndexValue + requestVerificationTokenSearchValueStart.length);
    let requestVerificationTokenSearchValueEnd = '\"';
    let endIndexValue = responseTextSlicedValueWithStartIndex.indexOf(requestVerificationTokenSearchValueEnd);
    if (endIndexValue == -1) {
      throw new Error('не удалось найти' + requestVerificationTokenSearchValueEnd);
    }
    let __RequestVerificationToken = responseTextSlicedValueWithStartIndex.slice(0, endIndexValue);
    return {
      cookie: potentialCookie,
      requestVerificationToken: __RequestVerificationToken
    };
  }
  catch (e) {
    e.message = 'connectAuthorize error: ' + e.message;
    throw e;
  }
};
export default connectAuthorize;