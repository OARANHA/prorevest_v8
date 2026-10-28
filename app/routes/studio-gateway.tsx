import { useAuth } from '../contexts/AuthContext';
import StudioPresentation from './studio';
import StudioEditor from './studioprorevest';

export default function StudioGateway() {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center" role="status">Verificando sua sessão...</main>;
  }

  return user ? <StudioEditor /> : <StudioPresentation />;
}
