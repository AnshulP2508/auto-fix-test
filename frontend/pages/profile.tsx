import { useEffect, useState } from 'react';
import { api } from '../services/api';

function mergeDeep(target: any, source: any): any {
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object') {
      target[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.search) as any);
    setProfile(mergeDeep({ theme: 'light' }, params));
    void api('/api/v1/users/me').then(setProfile);
  }, []);
  return <section className="card"><h1>Profile</h1><pre>{JSON.stringify(profile, null, 2)}</pre></section>;
}
