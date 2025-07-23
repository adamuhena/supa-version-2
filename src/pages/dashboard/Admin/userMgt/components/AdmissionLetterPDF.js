import jsPDF from "jspdf";

export function downloadAdmissionLetterPDF({ user, assignment, period }) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Admission Letter", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

  doc.text(`Dear ${user.firstName} ${user.lastName},`, 14, 50);
  doc.text(
    `Congratulations! You have been assigned to the following training center:`,
    14,
    60
  );

  doc.text(`Training Center: ${assignment.trainingCenterId.trainingCentreName || assignment.trainingCenterId.name}`, 14, 75);
  doc.text(`Address: ${assignment.trainingCenterId.address}`, 14, 85);
  doc.text(`State: ${assignment.trainingCenterId.state}`, 14, 95);
  doc.text(`LGA: ${assignment.trainingCenterId.lga}`, 14, 105);

  doc.text(`Period: ${period?.name || ""} (${period?.year || ""})`, 14, 120);

  doc.text(
    "Please report to your assigned center on the communicated date. Bring this letter with you.",
    14,
    135
  );

  doc.text("Best regards,", 14, 155);
  doc.text("SUPA Team", 14, 165);

  doc.save(
    `Admission_Letter_${user.firstName}_${user.lastName}_${period?.year || ""}.pdf`
  );
}