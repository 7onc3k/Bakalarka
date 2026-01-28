const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');

// Citace podle ČSN ISO 690 - harvardský styl (VŠE)

const povinnaLiteratura = [
  {
    autor: "SOMMERVILLE, Ian",
    rok: "2016",
    nazev: "Software Engineering",
    vydani: "10th ed., Global ed.",
    misto: "Harlow",
    vydavatel: "Pearson Education",
    isbn: "978-1-292-09613-1",
    katalog: "https://katalog.vse.cz/Record/000533419",
    ebook: true
  }
];

const doporucenaLiteratura = [
  {
    autor: "FORSGREN, Nicole, Jez HUMBLE a Gene KIM",
    rok: "2018",
    nazev: "Accelerate: The Science of Lean Software and DevOps",
    misto: "Portland",
    vydavatel: "IT Revolution Press",
    isbn: "978-1-942788-33-1",
    katalog: "https://katalog.vse.cz/Record/000609790"
  },
  {
    autor: "BECK, Kent",
    rok: "2005",
    nazev: "Extreme Programming Explained: Embrace Change",
    vydani: "2nd ed.",
    misto: "Boston",
    vydavatel: "Addison-Wesley",
    isbn: "978-0-321-27865-4",
    katalog: "https://katalog.vse.cz/Record/000223898"
  },
  {
    autor: "BROOKS, Frederick P.",
    rok: "1995",
    nazev: "The Mythical Man-Month: Essays on Software Engineering",
    vydani: "Anniversary ed.",
    misto: "Reading",
    vydavatel: "Addison-Wesley",
    isbn: "978-0-201-83595-3",
    katalog: "https://katalog.vse.cz/Record/000201536"
  }
];

function createCitation(item, number) {
  const vydani = item.vydani ? ` ${item.vydani}.` : "";
  return new Paragraph({
    children: [
      new TextRun({ text: `${number}. ${item.autor}, ${item.rok}. ` }),
      new TextRun({ text: item.nazev, italics: true }),
      new TextRun({ text: `.${vydani} ${item.misto}: ${item.vydavatel}. ISBN ${item.isbn}.` })
    ],
    spacing: { after: 200 }
  });
}

const allBooks = [...povinnaLiteratura, ...doporucenaLiteratura];

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        text: "Povinná literatura",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      ...povinnaLiteratura.map((c, i) => createCitation(c, i + 1)),

      new Paragraph({
        text: "Doporučená literatura",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 }
      }),
      ...doporucenaLiteratura.map((c, i) => createCitation(c, i + 1)),

      // Odkazy na katalog VŠE
      new Paragraph({
        text: "Odkazy na katalog VŠE",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),
      ...allBooks.map((item, i) => new Paragraph({
        children: [
          new TextRun({ text: `${i + 1}. ${item.autor.split(',')[0]}` }),
          new TextRun({ text: item.ebook ? " (e-book)" : " (knihovna)" }),
          new TextRun({ text: `: ${item.katalog}` })
        ],
        spacing: { after: 100 }
      }))
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/dev/code/Bakalarka/thesis/zadani-literatura.docx', buffer);
  console.log('Vytvořeno: zadani-literatura.docx');
  console.log('- Citace podle ISO 690');
  console.log('- Odkazy na katalog VŠE na konci');
});
