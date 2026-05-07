import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@lab.test');
  const [password, setPassword] = useState('password');
  const auth = useAuth();
  async function submit(event: FormEvent) {
    event.preventDefault();
    await auth.login(email, password);
  }
  return (
    <form className="card" onSubmit={submit}>
      <h1>Login</h1>
      <input value={email} onChange={(event) => setEmail(event.target.value)} />
      <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
      <button>Login</button>
    </form>
  );
}
