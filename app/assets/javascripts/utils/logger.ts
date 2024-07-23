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

// I have set this as an object only. The issue with setting an interface is that the object is complicated and changes properties depending on what the DA is doing. AL

export const error = (info: string, obj: unknown): void =>  {
    if(envChecker() == 'dev'){
        if(obj){
            console.error('ERROR: ' + info, obj)
        } else {
            console.error('ERROR: ' + info)
        }
    } 
}
// Obj here has to be typed as unknown because it is throwing an error on the JsonUtils.ts file where it is called. I think this is because TS cannot know what the object will be that comes from the fetch. It could be data or it could be an error.