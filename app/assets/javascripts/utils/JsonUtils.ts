import * as logger from './logger';

export const sanitiseAndParseJsonData = (data: string): {} | null => {
    try {
        data = data.replace(/'/g, '"');
        data = data.replace(/\\/g, "");
        data = JSON.parse(data);
        return data;
    } catch(e: unknown) {
        logger.error('error in sanitiseAndParseJsonData: ', e);
        return null;
    }
}