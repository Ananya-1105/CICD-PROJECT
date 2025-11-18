import React, { useEffect, useState } from "react";
import axios from "axios";

const HrRecruitment = () => {
  const [applicants, setApplicants] = useState([]);
  const BASE_URL = "http://34.204.199.101:8080/api/recruitments";
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(BASE_URL, axiosConfig);
      setApplicants(res.data || []);
    } catch (err) {
      console.error("Error fetching applicants", err);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await axios.put(`${BASE_URL}/${id}?status=${status}`, null, axiosConfig);
      fetchApplicants();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const sections = ["REVIEWED", "IN_PROGRESS", "ON_HOLD"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sections.map((section) => (
        <div key={section} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">{section.replace("_", " ")}</h2>
          <ul className="space-y-2">
            {applicants
              .filter((a) => a.status === section)
              .map((a) => (
                <li key={a.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span>{a.name}</span>
                  <div className="flex gap-1">
                    {section !== "REVIEWED" && (
                      <button
                        onClick={() => changeStatus(a.id, "REVIEWED")}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Review
                      </button>
                    )}
                    {section !== "IN_PROGRESS" && (
                      <button
                        onClick={() => changeStatus(a.id, "IN_PROGRESS")}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        In Progress
                      </button>
                    )}
                    {section !== "ON_HOLD" && (
                      <button
                        onClick={() => changeStatus(a.id, "ON_HOLD")}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Hold
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HrRecruitment;
