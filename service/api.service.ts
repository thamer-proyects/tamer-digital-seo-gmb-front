import axios from 'axios';
import config from '@/config/config';

class ApiService {
  private readonly apiUrl = config.apiUrl;
  protected axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error('Error:', error.response.data);
          console.error('Status:', error.response.status);
          console.error('Headers:', error.response.headers);
          console.log(this.apiUrl);

          switch (error.response.status) {
            case 400:
              console.log('Wrong request. Please check the data.');
              break;
            case 401:
              console.log('Unauthorized.');
              break;
            case 404:
              console.log('Resource not found.');
              break;
            case 500:
              console.log('Internal server error. Try again later.');
              break;
            default:
              console.log('Something went wrong.');
          }
        } else if (error.request) {
          console.error('Request Error:', error.request);
        } else {
          console.error('Error', error.message);
        }

        return Promise.reject(error.message);
      },
    );
  }
}

export default ApiService;
