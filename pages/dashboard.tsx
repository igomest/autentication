import { destroyCookie } from "nookies"
import { useContext, useEffect } from "react"
import { Can } from "../components/Can"
import { AuthContext } from "../contexts/AuthContext"
import { useCan } from "../hooks/useCan"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRGuest } from "../utils/withSSRAuth"


const Dashboard = () => {
    const { user, signOut } = useContext(AuthContext)

    // const userCanSeeMetrics = useCan({
    //     roles: ['administrator', 'editor']
    // })

    useEffect(() => {
        api.get('/me').then(response => console.log(response))
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <h1>Dashboard: {user?.email}</h1>

            {/* {userCanSeeMetrics &&
                <p><strong>Métricas</strong></p>
            } */}

            <Can permissions={['metrics.list']} roles={['administrator', 'editor']}>
                <p><strong>Métricas</strong></p>
            </Can>

            <button type="button" onClick={signOut}>Sign out</button>
        </>
    )
}


export const getServerSideProps = withSSRGuest(async (ctx) => {
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/me')

    console.log(response.data)

    return {
        props: {}
    }
})


export default Dashboard