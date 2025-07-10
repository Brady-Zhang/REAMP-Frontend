// src/components/PhotographyCompanyDashboard.tsx

import { useEffect, useState } from 'react';
import { PhotographyCompany } from '../../interfaces/PhotographyCompany';
import { getAllPhotographyCompanies } from '../../api/photography/getAllPhotographyCompany';


const PhotographyCompanyDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<PhotographyCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getAllPhotographyCompanies();
        setCompanies(data);
      } catch (err: any) {
        const msg = 'Unknown error';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">
      加载失败：{error}
    </div>;
  }

  if (companies.length === 0) {
    return <div className="text-center py-4 text-gray-600">
      暂无摄影公司数据（数组长度为 0）
    </div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Photography Companies
      </h2>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {company.photographyCompanyName}
            </h3>
            <p className="text-gray-500 text-sm">
              Email: {company.email}
            </p>
            <p className="text-gray-500 text-sm">
              Phone: {company.phoneNumber}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotographyCompanyDashboard;
