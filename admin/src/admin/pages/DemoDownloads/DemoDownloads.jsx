import { useState, useEffect } from "react";
import { FiDownload, FiSearch, FiFileText, FiCalendar } from "react-icons/fi";
import DataTable from "../../components/DataTable/DataTable";
import { getAllDemoDownloadsApi } from "../../api/Demo";
import { toast } from "react-toastify";
import "./DemoDownloads.scss";

const DemoDownloads = () => {
  const [demoDownloads, setDemoDownloads] = useState([]);
  console.log(demoDownloads,'-----');
  
  const [loading, setLoading] = useState(true);

  const fetchDemoDownloads = async () => {
    try {
      setLoading(true);
      const data = await getAllDemoDownloadsApi();
      console.log('Fetched demo downloads:', data);
      setDemoDownloads(data);
    } catch (error) {
      toast.error("Failed to fetch demo downloads");
      console.error("Error fetching demo downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoDownloads();
  }, []);

  const columns = [
    {
      label: "User",
      key: "user",
      render: (user) => (
        <div>
          <div className="user-name">{user?.name || "N/A"}</div>
        </div>
      ),
    },
    {
      label: "Email",
      key: "user",
      render: (user) => user?.email || "N/A",
    },
    {
      label: "Phone",
      key: "user",
      render: (user) => user?.phone || "N/A",
    },
    {
      label: "Product",
      key: "product",
      render: (product) => product?.name || "N/A",
    },
    {
      label: "Download Date",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const exportToCSV = () => {
    const csvContent = [
      ["User Name", "Email", "Phone", "Product", "Download Date"],
      ...demoDownloads.map((download) => [
        download?.user?.name || "N/A",
        download?.user?.email || "N/A",
        download?.user?.phone || "N/A",
        download?.product?.name || "N/A",
        new Date(download?.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "demo-downloads.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Demo Downloads Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>Demo Downloads Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Download Date</th>
              </tr>
            </thead>
            <tbody>
              ${demoDownloads
                .map(
                  (download) => `
                <tr>
                  <td>${download?.user?.name || "N/A"}</td>
                  <td>${download?.user?.email || "N/A"}</td>
                  <td>${download?.user?.phone || "N/A"}</td>
                  <td>${download?.product?.name || "N/A"}</td>
                  <td>${new Date(download?.createdAt).toLocaleDateString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="demo-downloads-page">
        <div className="loading">Loading demo downloads...</div>
      </div>
    );
  }

  return (
    <div className="demo-downloads-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FiDownload className="page-icon" />
            Demo Downloads
          </h1>
          <p>Track and manage product demo downloads</p>
        </div>
      </div>

      <div className="page-content">
        {demoDownloads.length > 0 ? (
          <DataTable
            data={demoDownloads}
            columns={columns}
            itemsPerPage={10}
          />
        ) : (
          <div className="no-data">
            <p>No demo downloads found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoDownloads;