declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number;
    filename?: string;
    image?: { type?: "jpeg" | "png" | "webp"; quality?: number };
    html2canvas?: { scale?: number; useCORS?: boolean };
    jsPDF?: { unit?: string; format?: string; orientation?: string };
  }

  function html2pdf(): {
    set(opt: Html2PdfOptions): { from(element: HTMLElement): { save(): void } };
  };

  export default html2pdf;
}
