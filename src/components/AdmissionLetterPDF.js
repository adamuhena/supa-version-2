import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function downloadAdmissionLetterPDF({ user, assignment, period, verificationId }) {
  const doc = new jsPDF();

  // Define colors
  const colors = {
    primary: "#1B5E20", // Dark Green
    secondary: "#C62828", // Red
    text: "#212121", // Dark Gray/Black
    lightGray: "#F5F5F5", // Light background
    white: "#FFFFFF",
  };

  // Add header background
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, 210, 35, "F");

  // Add logo/header section
  doc.setTextColor(colors.white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SKILL-UP ARTISAN PROGRAMME", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Industrial Training Fund (ITF)", 105, 22, { align: "center" });
  doc.text("itf.gov.ng", 105, 28, { align: "center" });

  // Add red accent line
  doc.setDrawColor(colors.secondary);
  doc.setLineWidth(2);
  doc.line(20, 40, 190, 40);

  // Document title
  doc.setTextColor(colors.text);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ADMISSION LETTER", 105, 55, { align: "center" });

  // Date and reference
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 160, 65);
  doc.text(`Ref: ${assignment.admissionNumber || `SUPA/ADM/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`}`, 160, 70);

  // Applicant details section
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Dear ${user.firstName} ${user.lastName},`, 20, 85);

  // Congratulations message
  doc.setFontSize(11);
  const congratsText = "We are pleased to inform you that you have been offered admission to undergo";
  doc.text(congratsText, 20, 100);
  doc.text("the Skill-UP Artisan Programme with the following details:", 20, 107);

  // Programme details box
  doc.setFillColor(colors.lightGray);
  doc.roundedRect(20, 115, 170, 65, 3, 3, "F");

  doc.setTextColor(colors.text);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PROGRAMME DETAILS", 25, 125);

  doc.setFont("helvetica", "normal");
  doc.text(`Admission Number: ${assignment.admissionNumber || "—"}`, 25, 135);
  doc.text(`Trade Area: ${assignment.tradeArea || "—"}`, 25, 142);
  doc.text(`Training Centre: ${assignment.trainingCenterName || "—"}`, 25, 149);
  doc.text(`Centre Address: ${assignment.trainingCenterAddress || "—"}`, 25, 156);
  
  // Format dates
  const startDate = period?.startDate ? new Date(period.startDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "—";
  const endDate = period?.endDate ? new Date(period.endDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "—";
  const duration = period?.duration ? `${period.duration} Weeks` : "—";
  
  doc.text(`Duration: ${duration} (${startDate} - ${endDate})`, 25, 163);

  // Conditions section
  doc.setFont("helvetica", "bold");
  doc.text("CONDITIONS", 25, 180);
  doc.setFont("helvetica", "normal");
  
  // Split conditions text into bullet points if it exists in assignment
  const conditions = assignment.conditions || [
    "Submit acceptance letter",
    "Complete registration form",
    "Regular and punctual attendance",
    "Adhere to programme rules",
    "You are responsible for your accommodation and feeding",
    "Monthly stipend will be paid to subsidize your transport"
  ];
  
  conditions.forEach((condition, index) => {
    doc.text(`• ${condition}`, 25, 187 + (index * 7));
  });

  // Important instructions
  const lastConditionY = 187 + (conditions.length * 7);
  doc.setFillColor(colors.secondary);
  doc.rect(20, lastConditionY + 5, 170, 25, "F");

  doc.setTextColor(colors.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("IMPORTANT INSTRUCTIONS", 25, lastConditionY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  const instructions = assignment.instructions || [
    `Please confirm your acceptance no later than ${startDate}`,
    "Bring this admission letter and a valid ID for verification"
  ];
  
  instructions.forEach((instruction, index) => {
    doc.text(`• ${instruction}`, 25, lastConditionY + 22 + (index * 5));
  });

  // QR Code section
  const verificationUrl = `https://itf.gov.ng/verify-admission?user=${user._id}&verification=${verificationId}&assignment=${assignment._id}&period=${period?._id || assignment.periodId}`;

  // Generate QR code
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 80,
    margin: 1,
    color: {
      dark: colors.text,
      light: colors.white,
    },
  });

  // Add QR code with border
  const qrCodeY = lastConditionY + 35;
  doc.setDrawColor(colors.primary);
  doc.setLineWidth(1);
  doc.rect(140, qrCodeY, 40, 40);
  doc.addImage(qrDataUrl, "PNG", 142, qrCodeY + 2, 36, 36);

  doc.setTextColor(colors.text);
  doc.setFontSize(8);
  doc.text("Scan to verify this letter", 160, qrCodeY + 45, { align: "center" });

  // Signature section
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Once again, congratulations!", 20, qrCodeY + 10);

  doc.text("Yours faithfully,", 20, qrCodeY + 25);

  doc.setFont("helvetica", "bold");
  doc.text(assignment.signatoryName || "Ekong Nancy N.", 20, qrCodeY + 35);
  doc.setFont("helvetica", "normal");
  doc.text(assignment.signatoryTitle || "Director, TVST. Dept.", 20, qrCodeY + 42);
  doc.text("For: Director General/Chief Executive, ITF", 20, qrCodeY + 49);

  // Footer
  doc.setDrawColor(colors.primary);
  doc.setLineWidth(1);
  doc.line(20, qrCodeY + 55, 190, qrCodeY + 55);

  doc.setFontSize(8);
  doc.setTextColor(colors.primary);
  doc.text("Industrial Training Fund | Skill-UP Artisan Programme | itf.gov.ng", 105, qrCodeY + 62, { align: "center" });

  // Save the PDF
  const fileName = `ITF_SUPA_Admission_Letter_${user.firstName}_${user.lastName}_${period?.year || new Date().getFullYear()}.pdf`;
  doc.save(fileName);
}

// import jsPDF from "jspdf"
// import QRCode from "qrcode"

// export async function downloadAdmissionLetterPDF({ user, assignment, period, verificationId }) {
//   const doc = new jsPDF()

//   // Define colors
//   const colors = {
//     primary: "#1B5E20", // Dark Green
//     secondary: "#C62828", // Red
//     text: "#212121", // Dark Gray/Black
//     lightGray: "#F5F5F5", // Light background
//     white: "#FFFFFF",
//   }

//   // Add header background
//   doc.setFillColor(colors.primary)
//   doc.rect(0, 0, 210, 35, "F")

//   // Add logo/header section
//   doc.setTextColor(colors.white)
//   doc.setFontSize(20)
//   doc.setFont("helvetica", "bold")
//   doc.text("SKILLS ACQUISITION PROGRAMME", 105, 15, { align: "center" })

//   doc.setFontSize(12)
//   doc.setFont("helvetica", "normal")
//   doc.text("Industrial Training Fund (ITF)", 105, 22, { align: "center" })
//   doc.text("supa.itf.gov.ng", 105, 28, { align: "center" })

//   // Add red accent line
//   doc.setDrawColor(colors.secondary)
//   doc.setLineWidth(2)
//   doc.line(20, 40, 190, 40)

//   // Document title
//   doc.setTextColor(colors.text)
//   doc.setFontSize(18)
//   doc.setFont("helvetica", "bold")
//   doc.text("ADMISSION LETTER", 105, 55, { align: "center" })

//   // Date and reference
//   doc.setFontSize(10)
//   doc.setFont("helvetica", "normal")
//   doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 160, 65)
//   doc.text(`Ref: SUPA/ADM/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`, 160, 70)

//   // Applicant details section
//   doc.setFontSize(12)
//   doc.setFont("helvetica", "normal")
//   doc.text(`Dear ${user.firstName} ${user.lastName},`, 20, 85)

//   // Congratulations message
//   doc.setFontSize(11)
//   const congratsText = "Congratulations! Following the successful completion of your application, you have been"
//   doc.text(congratsText, 20, 100)
//   doc.text("assigned to the following training center for the Skills Acquisition Programme:", 20, 107)

//   // Training center details box
//   doc.setFillColor(colors.lightGray)
//   doc.roundedRect(20, 115, 170, 45, 3, 3, "F")

//   // Defensive check for trainingCenterId
//   const center =
//     assignment.trainingCenterId && typeof assignment.trainingCenterId === "object"
//       ? assignment.trainingCenterId
//       : { trainingCentreName: "N/A", name: "N/A", address: "N/A", state: "N/A", lga: "N/A" }

//   doc.setTextColor(colors.text)
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(10)
//   doc.text("TRAINING CENTER DETAILS", 25, 125)

//   doc.setFont("helvetica", "normal")
//   doc.text(`Center Name: ${center.trainingCentreName || center.name || "—"}`, 25, 135)
//   doc.text(`Address: ${center.address || "—"}`, 25, 142)
//   doc.text(`State: ${center.state || "—"}`, 25, 149)
//   doc.text(`LGA: ${center.lga || "—"}`, 25, 156)

//   // Period information
//   doc.setFont("helvetica", "bold")
//   doc.text("PROGRAMME DETAILS", 25, 175)
//   doc.setFont("helvetica", "normal")
//   doc.text(`Training Period: ${period?.name || "—"}`, 25, 185)
//   doc.text(`Training Status: ${period?.status || "—"}`, 25, 192)
//   doc.text(`Academic Year: ${period?.year || "—"}`, 25, 198)

//   // Important instructions
//   doc.setFillColor(colors.secondary)
//   doc.rect(20, 200, 170, 25, "F")

//   doc.setTextColor(colors.white)
//   doc.setFont("helvetica", "bold")
//   doc.setFontSize(10)
//   doc.text("IMPORTANT INSTRUCTIONS", 25, 210)

//   doc.setFont("helvetica", "normal")
//   doc.setFontSize(9)
//   doc.text("• Report to your assigned center on the communicated date", 25, 217)
//   doc.text("• Bring this admission letter and a valid ID for verification", 25, 222)

//   // QR Code section
//   const verificationUrl = `https://supa.itf.gov.ng/verify-admission?user=${user._id}&verification=${verificationId}&assignment=${assignment._id}&period=${assignment.periodId}`

//   console.log("QR URL:", verificationUrl)
//   console.log({
//     userId: user._id,
//     verificationId,
//     assignmentId: assignment._id,
//     periodId: assignment.periodId,
//     verificationUrl,
//   })

//   // Generate QR code
//   const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
//     width: 80,
//     margin: 1,
//     color: {
//       dark: colors.text,
//       light: colors.white,
//     },
//   })

//   // Add QR code with border
//   doc.setDrawColor(colors.primary)
//   doc.setLineWidth(1)
//   doc.rect(140, 230, 40, 40)
//   doc.addImage(qrDataUrl, "PNG", 142, 232, 36, 36)

//   doc.setTextColor(colors.text)
//   doc.setFontSize(8)
//   doc.text("Scan to verify this letter", 160, 275, { align: "center" })

//   // Signature section
//   doc.setFontSize(10)
//   doc.setFont("helvetica", "normal")
//   doc.text("We wish you success in your training programme.", 20, 240)

//   doc.text("Best regards,", 20, 255)

//   doc.setFont("helvetica", "bold")
//   doc.text("SUPA Administration Team", 20, 265)
//   doc.setFont("helvetica", "normal")
//   doc.text("Industrial Training Fund (ITF)", 20, 272)

//   // Footer
//   doc.setDrawColor(colors.primary)
//   doc.setLineWidth(1)
//   doc.line(20, 285, 190, 285)

//   doc.setFontSize(8)
//   doc.setTextColor(colors.primary)
//   doc.text("Industrial Training Fund | Skills Acquisition Programme | supa.itf.gov.ng", 105, 292, { align: "center" })

//   // Save the PDF
//   const fileName = `SUPA_Admission_Letter_${user.firstName}_${user.lastName}_${period?.year || new Date().getFullYear()}.pdf`
//   doc.save(fileName)
// }
