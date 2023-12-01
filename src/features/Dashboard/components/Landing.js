import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../../../lib/auth';

export const Landing = () => {
  const navigate = useNavigate();
  const user = useUser();

  useEffect(() => {
    if (!user.data) {
      navigate('/auth/login');
    }
  }, [user.data, navigate]);

  return null;
};
