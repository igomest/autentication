import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Home = () => {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="E-mail" onChange={e => setEmail(e.target.value)}/>
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)}/>
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Home;
