import { setupAPIClient } from "../services/api"
import { withSSRGuest } from "../utils/withSSRAuth"


const Metrics = () => {
    return (
        <>
            <h1>Metrics</h1>
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
}, {
    permissions: ['metrics.list3'],
    roles: ['administrator']
})


export default Metrics