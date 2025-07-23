// import jsPDF from "jspdf";
// import QRCode from "qrcode";

// export async function downloadAdmissionLetterPDF({ user, assignment, period, verificationId }) {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text("Admission Letter", 105, 20, { align: "center" });

//   doc.setFontSize(12);
//   doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

//   doc.text(`Dear ${user.firstName} ${user.lastName},`, 14, 50);
//   doc.text(
//     `Congratulations! You have been assigned to the following training center:`,
//     14,
//     60
//   );

//   // Defensive check for trainingCenterId
//   const center = assignment.trainingCenterId && typeof assignment.trainingCenterId === "object"
//     ? assignment.trainingCenterId
//     : { trainingCentreName: "N/A", name: "N/A", address: "N/A", state: "N/A", lga: "N/A" };

//   doc.text(`Training Center: ${center.trainingCentreName || center.name || "—"}`, 14, 75);
//   doc.text(`Address: ${center.address || "—"}`, 14, 85);
//   doc.text(`State: ${center.state || "—"}`, 14, 95);
//   doc.text(`LGA: ${center.lga || "—"}`, 14, 105);

//   doc.text(`Period: ${period?.name || ""} (${period?.year || ""})`, 14, 120);

//   doc.text(
//     "Please report to your assigned center on the communicated date. Bring this letter with you.",
//     14,
//     135
//   );

//   doc.text("Best regards,", 14, 155);
//   doc.text("SUPA Team", 14, 165);

//   // Generate a unique verification URL with all required IDs
//   const verificationUrl = `http://192.168.0.8:2000/verify-admission?user=${user._id}&verification=${verificationId}&assignment=${assignment._id}&period=${assignment.periodId}`;
//   console.log("QR URL:", verificationUrl); // <-- Add this
//   console.log({
//     userId: user._id,
//     verificationId,
//     assignmentId: assignment._id,
//     periodId: assignment.periodId,
//     verificationUrl
//   });
//   // Generate QR code as data URL
//   const qrDataUrl = await QRCode.toDataURL(verificationUrl);
//   // Add QR code to PDF (x, y, width, height)
//   doc.addImage(qrDataUrl, "PNG", 150, 180, 40, 40);
//   doc.setFontSize(10);
//   doc.text("Scan to verify this letter:", 150, 175);

//   doc.save(
//     `Admission_Letter_${user.firstName}_${user.lastName}_${period?.year || ""}.pdf`
//   );
// } 


import jsPDF from "jspdf"
import QRCode from "qrcode"

export async function downloadAdmissionLetterPDF({ user, assignment, period, verificationId }) {
  const doc = new jsPDF()

  // Define colors
  const colors = {
    primary: "#1B5E20", // Dark Green
    secondary: "#C62828", // Red
    text: "#212121", // Dark Gray/Black
    lightGray: "#F5F5F5", // Light background
    white: "#FFFFFF",
  }

  // Add header background
  doc.setFillColor(colors.primary)
  doc.rect(0, 0, 210, 35, "F")

  // Add logo/header section
  doc.setTextColor(colors.white)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("SKILLS ACQUISITION PROGRAMME", 105, 15, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Industrial Training Fund (ITF)", 105, 22, { align: "center" })
  doc.text("supa.itf.gov.ng", 105, 28, { align: "center" })

  // Add red accent line
  doc.setDrawColor(colors.secondary)
  doc.setLineWidth(2)
  doc.line(20, 40, 190, 40)

  // Document title
  doc.setTextColor(colors.text)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("ADMISSION LETTER", 105, 55, { align: "center" })

  // Date and reference
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 160, 65)
  doc.text(`Ref: SUPA/ADM/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`, 160, 70)

  // Applicant details section
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Dear ${user.firstName} ${user.lastName},`, 20, 85)

  // Congratulations message
  doc.setFontSize(11)
  const congratsText = "Congratulations! Following the successful completion of your application, you have been"
  doc.text(congratsText, 20, 100)
  doc.text("assigned to the following training center for the Skills Acquisition Programme:", 20, 107)

  // Training center details box
  doc.setFillColor(colors.lightGray)
  doc.roundedRect(20, 115, 170, 45, 3, 3, "F")

  // Defensive check for trainingCenterId
  const center =
    assignment.trainingCenterId && typeof assignment.trainingCenterId === "object"
      ? assignment.trainingCenterId
      : { trainingCentreName: "N/A", name: "N/A", address: "N/A", state: "N/A", lga: "N/A" }

  doc.setTextColor(colors.text)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("TRAINING CENTER DETAILS", 25, 125)

  doc.setFont("helvetica", "normal")
  doc.text(`Center Name: ${center.trainingCentreName || center.name || "—"}`, 25, 135)
  doc.text(`Address: ${center.address || "—"}`, 25, 142)
  doc.text(`State: ${center.state || "—"}`, 25, 149)
  doc.text(`LGA: ${center.lga || "—"}`, 25, 156)

  // Period information
  doc.setFont("helvetica", "bold")
  doc.text("PROGRAMME DETAILS", 25, 175)
  doc.setFont("helvetica", "normal")
  doc.text(`Training Period: ${period?.name || "—"}`, 25, 185)
  doc.text(`Training Status: ${period?.status || "—"}`, 25, 192)
  doc.text(`Academic Year: ${period?.year || "—"}`, 25, 198)

  // Important instructions
  doc.setFillColor(colors.secondary)
  doc.rect(20, 200, 170, 25, "F")

  doc.setTextColor(colors.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("IMPORTANT INSTRUCTIONS", 25, 210)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text("• Report to your assigned center on the communicated date", 25, 217)
  doc.text("• Bring this admission letter and a valid ID for verification", 25, 222)

  // QR Code section
  const verificationUrl = `https://supa.itf.gov.ng/verify-admission?user=${user._id}&verification=${verificationId}&assignment=${assignment._id}&period=${assignment.periodId}`

  console.log("QR URL:", verificationUrl)
  console.log({
    userId: user._id,
    verificationId,
    assignmentId: assignment._id,
    periodId: assignment.periodId,
    verificationUrl,
  })

  // Generate QR code
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 80,
    margin: 1,
    color: {
      dark: colors.text,
      light: colors.white,
    },
  })

  // Add QR code with border
  doc.setDrawColor(colors.primary)
  doc.setLineWidth(1)
  doc.rect(140, 230, 40, 40)
  doc.addImage(qrDataUrl, "PNG", 142, 232, 36, 36)

  doc.setTextColor(colors.text)
  doc.setFontSize(8)
  doc.text("Scan to verify this letter", 160, 275, { align: "center" })

  // Signature section
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("We wish you success in your training programme.", 20, 240)

  doc.text("Best regards,", 20, 255)

  doc.setFont("helvetica", "bold")
  doc.text("SUPA Administration Team", 20, 265)
  doc.setFont("helvetica", "normal")
  doc.text("Industrial Training Fund (ITF)", 20, 272)

  // Footer
  doc.setDrawColor(colors.primary)
  doc.setLineWidth(1)
  doc.line(20, 285, 190, 285)

  doc.setFontSize(8)
  doc.setTextColor(colors.primary)
  doc.text("Industrial Training Fund | Skills Acquisition Programme | supa.itf.gov.ng", 105, 292, { align: "center" })

  // Save the PDF
  const fileName = `SUPA_Admission_Letter_${user.firstName}_${user.lastName}_${period?.year || new Date().getFullYear()}.pdf`
  doc.save(fileName)
}
