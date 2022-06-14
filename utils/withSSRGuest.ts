import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        if (cookies["nextauth.token"]) {
            // Verifica se existe o cookie e redireciona o usuário para o dashboard
            return {
                redirect: {
                    destination: "/dashoboard",
                    permanent: false,
                },
            };
        }
        return await fn(ctx);
    };
};
