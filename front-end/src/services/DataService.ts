import http from '@/http-common';
import SalesActivity from '@/types/SalesActivity';

class DataService {
  async getSalesActivity(): Promise<SalesActivity[]> {
    const url = `/salesdata/activity`;

    const { data: responseBody } = await http.get<{
      status: string;
      data: SalesActivity[];
    }>(url);

    return responseBody.data;
  }
}

export default new DataService();
