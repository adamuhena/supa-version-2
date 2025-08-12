// utils/transformTrainingCenterData.js
export const transformTrainingCenterData = (data, getTradeAreaNameById, sectors) => {
  return (data || []).map((x, i) => {
    // Extract trade areas and sectors
    const tradeAreaNames = Array.isArray(center.legalInfo?.tradeAreas)
    ? center.legalInfo.tradeAreas
        .map((taObj) =>
          Array.isArray(taObj.tradeArea)
            ? taObj.tradeArea.map((id) => getTradeAreaNameById(id)).join(", ")
            : ""
        )
        .join(", ")
    : "";

    // let sectors = "";
    // let tradeAreas = "";

    tradeAreasData.forEach((sectorInfo) => {
      sectors += sectorInfo.sectorName + ", ";
      sectorInfo.tradeAreas.forEach((ta) => {
        tradeAreas += ta.name + ", ";
      });
    });

    // Get latest assessment record for category
    const latestAssessment =
      x.assessmentRecords && x.assessmentRecords.length > 0
        ? [...x.assessmentRecords].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )[0]
        : null;
    const latestCategory = latestAssessment?.category || "default";
    const categoryObj = CENTER_CATEGORY[latestCategory];
    const trainingCategory =
      categoryObj && categoryObj.label ? categoryObj.label : "Not Assigned";

    // Get assessment status
    const assessmentStatus =
      ASSESSMENT_STATUS[x.currentAssessmentStatus || "pending"].label;

    return {
      sn: i + 1,
      trainingCentreName: x?.trainingCentreName || "---",
      contactPersonName: x?.contactPerson || "---",
      contactPersonPhone: x?.phoneNumber || "---",
      contactPersonEmail: x?.email || "---",
      state: x?.state || "---",
      lga: x?.lga || "---",
      address: x?.address || "---",
      sectors: sectors.replace(/,\s*$/, ""),
      // tradeAreas: tradeAreas.replace(/,\s*$/, ""),
      tradeAreaNames: tradeAreaNames.replace(/,\s*$/, ""),
      assessmentStatus,
      trainingCategory,
      registrationDate: x.createdAt
        ? new Date(x.createdAt).toLocaleDateString()
        : "---",
    };
  });
};
