import axios from 'axios'
export const fetchGetApi = async (url) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com${url}`);
      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch data');
    }
  };