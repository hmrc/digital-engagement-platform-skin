export const sanitiseAndParseJsonData = (data) => {
    try {
        data = data.replace(/'/g, '"');
        data = data.replace(/\\/g, "");
        data = JSON.parse(data);
        return data;
    } catch(e) {
        console.log('error in sanitiseAndParseJsonData: ', e);
        return null;
    }
}
