function envChecker() {
    let env;
    let url = window.location.href;

    if(url.includes('qa') || url.includes('test') || url.includes('staging') || url.includes('localhost')) {
        env = 'dev'
    } else {
        env = 'prod'
    }

    return env;
}

export const info = (info) =>  {

    if(envChecker() == 'dev'){
        console.log('INFO: ' + info)
    } 
    
}

export const debug = (info, obj) =>  {

    if(envChecker() == 'dev'){
        console.log('DEBUG: ' + info, obj)
    } 
}

export const error = (info, obj) =>  {

    if(envChecker() == 'dev'){
        if(obj){
            console.error('ERROR: ' + info, obj)
        } else {
            console.error('ERROR: ' + info)
        }
        
    } 
}