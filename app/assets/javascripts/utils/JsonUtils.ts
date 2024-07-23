import * as logger from './logger';

export const sanitiseAndParseJsonData = (data: string): {} | null => {
    try {
        data = data.replace(/'/g, '"');
        data = data.replace(/\\/g, "");
        data = JSON.parse(data);
        return data;
    } catch(e) {
        logger.error('error in sanitiseAndParseJsonData: ', e);
        return null;
    }
}
// Do you agree with the typing? I cannot get the console to fire to check the data. However, replace is a string method and it is being parsed which should turn it into a JSON object as long as the string can be converted. It is used in the ChatContainer.ts in messageData but I could not get the console to work for that either. It is data coming from Nuance. 

// Another issue is when hovering over the data property that the data is still typed as string on the JSON.parse line and the return line. It has not seemed to track the change. I have tried setting variables and typing the variables which has seemd to work as it has been annotated. However, I am not sure if it is as readable? I don't think it will change the functionality though?

// const sanitisedStr: string = data.replace(/'/g, '"').replace(/\\/g, "");
// const jsonData: {} = JSON.parse(sanitisedStr)
// return jsonData

//A better option may be to use an interface and type each line of the data but I cannot see as the console won't show it and it could be very complex / changing depending on circumstances.