function envChecker(): string {
    let env: string;
    let url: string = window.location.href;

    if(url.includes('qa') || url.includes('test') || url.includes('staging') || url.includes('localhost')) {
        env = 'dev'
    } else {
        env = 'prod'
    }
    return env;
}

export const info = (info: string): void =>  {
    if(envChecker() == 'dev'){
        console.log('INFO: ' + info)
    }  
}

export const debug = (info: string, obj?: {}): void =>  {
    if(envChecker() == 'dev'){
        console.log('DEBUG: ' + info, obj)
    } 
}

export const error = (info: string, obj: unknown): void =>  {
    if(envChecker() == 'dev'){
        if(obj){
            console.error('ERROR: ' + info, obj)
        } else {
            console.error('ERROR: ' + info)
        }
    } 
}