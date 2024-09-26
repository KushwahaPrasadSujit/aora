import { useEffect, useState } from "react"

const useRapidApi = (query) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([])

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4e5632d585msh1dd87aa475c0099p1b4badjsnc11fa52185a9',
            'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
        },
    }

    const fetchData = async () => {
        setIsLoading(true)
        try {
            let response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/${query ?? ''}`, options)
            if (!response.ok) {
                throw new Error('unable to fetch movie list. Please try again later!');
            }
            const data = await response.json();
            setData([...data])
        } catch (error) {
            throw new Error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const refetch = () => fetchData()

    return {
        isLoading,
        data,
        refetch
    }

}

export default useRapidApi