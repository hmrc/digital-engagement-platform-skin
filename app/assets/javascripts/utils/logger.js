function envChecker() {
    let env;
    let url = window.location.href;

    if(!url.includes('qa') || !url.includes('test') || !url.includes('staging') || !url.includes('localhost')) {
        env = 'prod'
    } else {
        env = 'nonprod'
    }

    return env;
}

export const info = (info) =>  {
    let env = envChecker()

    if(env = 'nonprod'){
        console.log('INFO', info)
    } 
    
}

export const debug = (info, obj) =>  {
    let env = envChecker()

    if(env = 'nonprod'){
        console.log('DEBUG', info, obj)
    } 
}

export const error = (info, obj) =>  {
    let env = envChecker()

    if(env = 'nonprod'){
        console.log('ERROR', info, obj)
    } 
}