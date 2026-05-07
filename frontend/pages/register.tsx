import { FormEvent, useState } from 'react';
import { api } from '../services/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    await api('/api/v1/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, username: email, password: 'password' }) });
  }
  return <form className="card" onSubmit={submit}><h1>Register</h1><input value={email} onChange={(event) => setEmail(event.target.value)} /><button>Create</button></form>;
}
