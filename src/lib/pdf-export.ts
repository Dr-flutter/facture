import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function exportElementToPDF(el: HTMLElement, filename: string) {
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  // Fit width, preserve aspect ratio
  const imgH = (canvas.height * pageW) / canvas.width;
  if (imgH <= pageH) {
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH);
  } else {
    // Multi-page if needed
    let remaining = imgH;
    let y = 0;
    while (remaining > 0) {
      pdf.addImage(imgData, "JPEG", 0, y, pageW, imgH);
      remaining -= pageH;
      y -= pageH;
      if (remaining > 0) pdf.addPage();
    }
  }
  pdf.save(filename);
}

export async function shareElementAsPDF(el: HTMLElement, filename: string) {
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const imgH = (canvas.height * pageW) / canvas.width;
  pdf.addImage(imgData, "JPEG", 0, 0, pageW, imgH);
  const blob = pdf.output("blob");
  const file = new File([blob], filename, { type: "application/pdf" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: filename });
  } else {
    // Fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
