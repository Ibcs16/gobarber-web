import { useLocation } from 'react-router-dom';

export default function useQuery(): URLSearchParams {
  const { search } = useLocation();
  return new URLSearchParams(search);
}
