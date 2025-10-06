import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EmployeeCharts = ({ analytics }) => {
  const { deptCount, positionCount, deptSalary, positionSalary } = analytics;

  // Pie chart for department count
  const deptCountData = {
    labels: Object.keys(deptCount),
    datasets: [
      {
        label: "Employees by Department",
        data: Object.values(deptCount),
        backgroundColor: [
          "#4F46E5",
          "#6366F1",
          "#818CF8",
          "#A5B4FC",
          "#C7D2FE",
          "#E0E7FF",
        ],
      },
    ],
  };

  // Pie chart for position count
  const positionCountData = {
    labels: Object.keys(positionCount),
    datasets: [
      {
        label: "Employees by Position",
        data: Object.values(positionCount),
        backgroundColor: [
          "#EC4899",
          "#F472B6",
          "#F9A8D4",
          "#FBCFE8",
          "#FCE7F3",
        ],
      },
    ],
  };

  // Bar chart for average salary by department
  const deptSalaryData = {
    labels: Object.keys(deptSalary),
    datasets: [
      {
        label: "Avg Salary by Department",
        data: Object.values(deptSalary),
        backgroundColor: "#4ADE80",
      },
    ],
  };

  // Bar chart for average salary by position
  const positionSalaryData = {
    labels: Object.keys(positionSalary),
    datasets: [
      {
        label: "Avg Salary by Position",
        data: Object.values(positionSalary),
        backgroundColor: "#FACC15",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2 text-center">Employees by Department</h3>
        <Pie data={deptCountData} />
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2 text-center">Employees by Position</h3>
        <Pie data={positionCountData} />
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2 text-center">Avg Salary by Department</h3>
        <Bar data={deptSalaryData} />
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold mb-2 text-center">Avg Salary by Position</h3>
        <Bar data={positionSalaryData} />
      </div>
    </div>
  );
};

export default EmployeeCharts;

