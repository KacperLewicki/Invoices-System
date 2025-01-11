import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({ error: "Metoda niedozwolona" });
    }

    const {

      invoiceName,
      customerName,
      seller,
      paymentMethod,
      effectiveMonth,
      currency,
      dataInvoice,
      dataInvoiceSell,
      dueDate,
      comments,
      summaryNetto,
      summaryVat,
      summaryBrutto,
      items = [],

    } = req.body;

    // Funkcja do mapowania polskich znaków na ASCII

    const mapPolishChars = (text) =>
      text
        ? text
          .replace(/ą/g, "a")
          .replace(/ć/g, "c")
          .replace(/ę/g, "e")
          .replace(/ł/g, "l")
          .replace(/ń/g, "n")
          .replace(/ó/g, "o")
          .replace(/ś/g, "s")
          .replace(/ź/g, "z")
          .replace(/ż/g, "z")
        : "";

    const pdfDoc = await PDFDocument.create();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // A4 pionowo

    const page = pdfDoc.addPage([595, 842]);

    // Kolory i marginesy

    const purpleColor = rgb(0.3, 0.12, 0.58);
    const blackColor = rgb(0, 0, 0);
    const grayColor = rgb(0.6, 0.6, 0.6);
    const marginLeft = 50;
    const marginRight = 545;
    let currentY = 780;

    // logo na górze po prawej stronie

    page.drawCircle({

      x: marginRight - 20,
      y: 800,
      size: 16,
      color: purpleColor,
    });

    page.drawText("KL", {

      x: marginRight - 27,
      y: 793,
      size: 14,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // Funkcja do rysowania nagłówków sekcji

    function drawSectionHeader(text, x, y) {

      page.drawText(mapPolishChars(text), {

        x,
        y,
        size: 10,
        font: fontBold,
        color: purpleColor,

      });
    }

    function drawMiniTable(headers, rows, widths, startX, startY) {

      let y = startY;

      // Nagłówki tabeli

      let x = startX;

      headers.forEach((header, index) => {

        page.drawText(mapPolishChars(header), {

          x: x + 5,
          y: y - 12,
          size: 10,
          font: fontBold,
          color: purpleColor,
        });

        page.drawRectangle({

          x,
          y: y - 20,
          width: widths[index],
          height: 25,
          borderColor: grayColor,
          borderWidth: 0.5,
        });
        x += widths[index];
      });
      y -= 25;

      // Wiersze tabeli

      rows.forEach((row) => {
        x = startX;
        row.forEach((cell, index) => {
          page.drawText(mapPolishChars(cell), {
            x: x + 5,
            y: y - 12,
            size: 10,
            font: fontRegular,
            color: blackColor,
          });

          // Rysowanie obramowania

          page.drawRectangle({
            x,
            y: y - 20,
            width: widths[index],
            height: 25,
            borderColor: grayColor,
            borderWidth: 0.5,
          });
          x += widths[index];
        });
        y -= 25;
      });

      return y;
    }

    function drawTwoColumnData(leftData, rightData, xLeft, xRight, startY) {

      let y = startY;

      leftData.forEach((entry) => {

        page.drawText(mapPolishChars(entry.label), {

          x: xLeft,
          y,
          size: 10,
          font: fontBold,
          color: grayColor,

        });
        page.drawText(mapPolishChars(entry.value), {

          x: xLeft + 100,
          y,
          size: 10,
          font: fontRegular,
          color: blackColor,

        });

        y -= 20;
      });

      y = startY;

      rightData.forEach((entry) => {

        page.drawText(mapPolishChars(entry.label), {

          x: xRight,
          y,
          size: 10,
          font: fontBold,
          color: grayColor,
        });

        page.drawText(mapPolishChars(entry.value), {

          x: xRight + 100,
          y,
          size: 10,
          font: fontRegular,
          color: blackColor,
        });

        y -= 20;
      });

      return y;
    }

    // Funkcja do rysowania tabeli

    function drawTable(headers, rows, widths, startY) {
      let y = startY;

      // Nagłówki tabeli

      let x = marginLeft;
      headers.forEach((header, index) => {

        page.drawText(mapPolishChars(header), {

          x: x + 5,
          y: y - 12,
          size: 10,
          font: fontBold,
          color: purpleColor,
        });

        page.drawRectangle({

          x,
          y: y - 20,
          width: widths[index],
          height: 25,
          borderColor: grayColor,
          borderWidth: 0.5,

        });

        x += widths[index];

      });

      y -= 25;

      // Wiersze tabeli

      rows.forEach((row) => {
        x = marginLeft;
        row.forEach((cell, index) => {

          page.drawText(mapPolishChars(cell), {

            x: x + 5,
            y: y - 12,
            size: 10,
            font: fontRegular,
            color: blackColor,
          });

          // Rysowanie obramowania

          page.drawRectangle({

            x,
            y: y - 20,
            width: widths[index],
            height: 25,
            borderColor: grayColor,
            borderWidth: 0.5,
          });

          x += widths[index];

        });

        y -= 25;
      });

      return y;
    }

    // Nagłówek dokumentu

    page.drawText(mapPolishChars(`Faktura: ${invoiceName}`), {

      x: marginLeft,
      y: currentY,
      size: 16,
      font: fontBold,
      color: purpleColor,

    });

    currentY -= 40;

    // Dane klienta i Szczegóły noty kredytowej

    drawSectionHeader("Dane Klienta", marginLeft, currentY);
    drawSectionHeader("Szczegoly Faktury", 300, currentY);

    currentY = drawTwoColumnData(
      [
        { label: "Klient", value: customerName },
        { label: "Sprzedawca", value: seller },
        { label: "Metoda platnosci", value: paymentMethod },
        { label: "Miesiac", value: effectiveMonth },
        { label: "Waluta", value: currency },
      ],
      [
        { label: "Data wystawienia", value: new Date(dataInvoice).toLocaleDateString() },
        { label: "Data sprzedazy", value: new Date(dataInvoiceSell).toLocaleDateString() },
        { label: "Termin platnosci", value: new Date(dueDate).toLocaleDateString() },
        { label: "Komentarz", value: comments || "Brak" },
      ],
      marginLeft,
      300,
      currentY - 30
    );

    currentY -= 40;

    // Tabela z pozycjami

    drawSectionHeader("Pozycje Fakrtury", marginLeft, currentY);

    currentY = drawTable(

      ["Nazwa", "Ilość", "Netto", "VAT", "Brutto"],

      items.map((item) => [

        item.itemName,
        String(item.quantity),
        `${item.nettoItem} ${currency}`,
        `${item.vatItem}%`,
        `${item.bruttoItem} ${currency}`,
      ]),
      [200, 50, 80, 50, 80],
      currentY - 20
    );

    currentY -= 40;

    // tabela podsumowanie

    const miniTableStartX = 210;
    drawSectionHeader("Podsumowanie", miniTableStartX, currentY);

    currentY = drawMiniTable(

      ["", "Kwota"],
      [
        ["Razem Netto", `${summaryNetto} ${currency}`],
        ["Razem VAT", `${summaryVat} ${currency}`],
        ["Razem Brutto", `${summaryBrutto} ${currency}`],
      ],
      [200, 100],
      miniTableStartX,
      currentY - 20
    );

    // tekst na środku na dole

    page.drawText(

      mapPolishChars(

        "Faktura została wygenerowana automatycznie. Wszelkie prawa zastrzeżone."
      ),
      {
        x: 297.5 - 150,
        y: 20,
        size: 8,
        font: fontRegular,
        color: grayColor,
      }
    );

    // Zapisanie dokumentu PDF

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="FV-${invoiceName}.pdf"`);
    res.status(200).send(Buffer.from(pdfBytes));

  } catch (err) {

    console.error("Błąd pdf-lib:", err);
    res.status(500).json({ error: err.message });
  }
}
