const fetcher = async (url: string, method: string, body?: any) => {
    try {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            ...body ? { body: JSON.stringify(body) } : {}
        })
        return res.json()

    } catch (err) {
        console.error(err)
        return null
    }
}

export default fetcher;