"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BotonPDF() {

  async function descargarPDF() {

    const elemento =
      document.getElementById(
        "exportar-pdf"
      );

    if (!elemento) return;

    const canvas =
      await html2canvas(
        elemento,
        {
          scale: 2,
        }
      );

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const pdf =
      new jsPDF(
        "p",
        "mm",
        "a4"
      );

    const width =
      210;

    const height =
      (canvas.height *
        width) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      width,
      height
    );

    pdf.save(
      "groundforce-planner.pdf"
    );
  }

  return (

    <button
      onClick={descargarPDF}
      className="w-full rounded-3xl bg-slate-900 px-6 py-5 text-lg font-bold text-white transition hover:bg-slate-700"
    >

      Descargar PDF

    </button>

  );
}