import * as logger from '../utils/logger';

export const sanitiseAndParseJsonData = (data) => {
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
