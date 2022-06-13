import axios, { AxiosError } from "axios";
import { request } from "http";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

type AxiosErrorResponse = {
  code?: string;
};

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

/* 
  request: intercepta a requisição antes que ela seja feita
  response: intercepta a requisição depois que ela for feita, ou seja, posso fazer uma funcionalidade depois da resposta do backend
*/

// o response.use recebe dois parâmetros: o primeiro é o que fazer se a requisição for um sucesso e o segundo, o que fazer se der algum erro
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<AxiosErrorResponse>) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        // renovar o token
        cookies = parseCookies();

        const { "nextauth.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config; // toda a configuração da requisição feita para o backend, como qual rotas eu chamei, quais parâmetros foram passados, o que deveria acontecer depois da requisição ser feita, etc.

        if (!isRefreshing) {
          // Quando o token estiver inválido, ele atualiza o token. O refreshing é feito uma única vez, quando o token não está válido.
          isRefreshing = true;

          api
            .post("/refresh", {
              refreshToken,
            })
            .then((response) => {
              const { token } = response.data;

              setCookie(undefined, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, // (30 days) quanto tempo o cookie deve ser mantido no navegador
                path: "/", // qualquer endereço da app vai ter acesso ao cookie, geralmente usado '/' para um cookie global
              });

              setCookie(
                undefined,
                "nextauth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // (30 days) quanto tempo o cookie deve ser mantido no navegador
                  path: "/", // qualquer endereço da app vai ter acesso ao cookie, geralmente usado '/' para um cookie global
                }
              );

              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              failedRequestQueue.forEach((request) => request.onSuccess(token));
              failedRequestQueue = [];
            })
            .catch((err) => {
              failedRequestQueue.forEach((request) => request.onFailure(err));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              // quando o processo de refresh estiver finalizado
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              // quando ocorrer algum erro
              reject(err);
            },
          });
        });
      } else {
        // o erro pode não ser do tipo token expirado, portanto o usuário é deslogado
      }
    }
  }
);
