
export function request(url, options) {
    // console.log(options)
    const request = new Request(url, {
        method: options.method,
        headers: {
            // 'Content-Type':'application/json',
        }
    })
    return fetch(request)
        .then(async response => {
            return {
                status: response.status,
                data: await response.json()
            }
        })
        .catch(e => {
            console.log(e)
            throw new Error(e)
        })
}