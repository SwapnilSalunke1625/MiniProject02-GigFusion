import React from "react";
import { jsPDF } from "jspdf";
import Logo from "./Assets/gigFusionlogo.png"; // Import logo image
import { FaDownload } from "react-icons/fa";
import axios from "axios";

const Invoice = () => {
    const [currentUser, setCurrentUser] = React.useState(null);

    React.useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("/api/current-user");
                setCurrentUser(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, []);
  const generateInvoice = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const invoiceNumber = `INV-${Date.now()}`;

    // Add company logo centered at the top
    doc.addImage(Logo, "PNG", 80, 10, 50, 20);

    // Company Name - Centered & Bold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(34, 50, 101); // Blue color
    doc.text("Gig Fusion Invoice", 105, 40, null, null, "center");

    // Invoice Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice No: ${invoiceNumber}`, 20, 60);
    doc.text(`Date: ${timestamp}`, 20, 70);

    // Bill To Section
    doc.setTextColor(34, 50, 101); // Blue color
    doc.text("Gig Expert :", 20, 90);
    doc.setTextColor(0, 0, 0);
    doc.text("Name: Swapnil Salunke", 20, 100);
    doc.text("Address: Darashiv Maharashtra India", 20, 110);

    // Table Headers
    doc.setTextColor(34, 50, 101);
    doc.text("Items:", 20, 130);
    doc.setTextColor(0, 0, 0);
    doc.text("------------------------------------------------------", 20, 140);
    
    doc.setFontSize(12);
    doc.text("Description", 20, 150);
    doc.text("Qty", 100, 150);
    doc.text("Rate", 120, 150);
    doc.text("Total", 140, 150);
    
    doc.text("------------------------------------------------------", 20, 155);

    // Table Data (Example Item)
    doc.setFont("helvetica", "bold");
    doc.text("Website Development", 20, 165);
    doc.text("1", 105, 165);
    doc.text("Rs. 500 ", 125, 165);
    doc.text("Rs. 500", 145, 165);

    doc.text("------------------------------------------------------", 20, 175);

    // Right-aligned summary
    const rightAlignX = 160; // Adjusted X position for right alignment
    doc.setFontSize(14);
    
    doc.text("Subtotal:", rightAlignX - 50, 190);
    doc.text("Rs. 500", rightAlignX, 190, { align: "right" });

    doc.text("Tax (10%):", rightAlignX - 50, 200);
    doc.text("Rs. 50", rightAlignX, 200, { align: "right" });

    doc.text("Total:", rightAlignX - 50, 210);
    doc.text("Rs. 550", rightAlignX, 210, { align: "right" });

    doc.save(`invoice_${invoiceNumber}.pdf`);
  };

  return (
    <button
      onClick={generateInvoice}
      className="p-3 bg-stdBlue text-white rounded-md hover:bg-blue-700"
    >
      <FaDownload size={16} />
    </button>
  );
};

export default Invoice;
