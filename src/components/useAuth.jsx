import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const profissional = localStorage.getItem('profissional');
    if (!profissional) {
      navigate('/login');
    }
  }, [navigate]);
};

export default useAuth;