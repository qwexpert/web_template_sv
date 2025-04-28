

export async function api(url, method = 'GET', data = null) {
    const opts = {
        method,
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'include'
    }

    if (method === 'GET' && data) {
        const params = new URLSearchParams()

        for (const key in data) params.append(key, data[key])

        url += `?${params.toString()}`
    } else if (data) {
        opts.headers['Content-Type'] = 'application/json'
        opts.body = JSON.stringify(data)
    }

    const token = localStorage.getItem('token')
    
    if (token) opts.headers['Authorization'] = `Bearer ${token}`

    try {
        const response = await fetch(url, opts)
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.error)
        }

        return await response.json()
    } catch (error) {
        console.error('API call failed:', error)
        throw error
    }
}

