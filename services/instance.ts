import axios from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiConfig = {
  endpoint: string;
  method: HttpMethod;
  data?: object;
  params?: object;
};

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

const apiRequest = async ({ endpoint, method, data, params }: ApiConfig) => {
  const url = `/api/${endpoint}`;
  
  try {
    let response;
    
    switch (method) {
      case 'GET':
        response = await http.get(url, { params });
        break;
      case 'POST':
        response = await http.post(url, data);
        break;
      case 'PUT':
        response = await http.put(url, data);
        break;
      case 'DELETE':
        response = await http.delete(url);
      break;
      default:
      throw new Error('Invalid HTTP method');
    }

    return response;
  } catch (error: any) {
    throw error;
  }
};

export const apiHelper = (endpoint: string) => {
  return {
    get: (params = {}) => apiRequest({ endpoint, method: 'GET', params }),
    show: (slug: string) => apiRequest({ endpoint: `${endpoint}/${slug}`, method: 'GET' }),
    post: (data: any) => apiRequest({ endpoint, method: 'POST', data }),
    put: (id: string, data: any) => apiRequest({ endpoint: `${endpoint}/${id}`, method: 'PUT', data }),
    delete: (id: string) => apiRequest({ endpoint: `${endpoint}/${id}`, method: 'DELETE' }),
  };
};
 