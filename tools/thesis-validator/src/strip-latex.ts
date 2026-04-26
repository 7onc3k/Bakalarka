import { readFileSync } from "fs";
import { join } from "path";

const THESIS_DIR = join(import.meta.dirname, "..", "..", "..", "thesis");
const PRACE_PATH = join(THESIS_DIR, "prace.tex");
const BIB_PATH = join(THESIS_DIR, "literatura.bib");

const FALLBACK_MAIN_TEXT_FILES = [
  "uvod.tex",
  "kap01.tex",
  "kap02.tex",
  "kap03.tex",
  "kap04.tex",
  "kap05.tex",
  "zaver.tex",
];

const NON_BODY_INCLUDES = new Set(["zacatek", "zkratky", "literatura"]);

type BlockType = "raw" | "draft" | "final";

export interface StrippedSection {
  file: string;
  content: string;
  blockTypes: Record<BlockType, number>;
}

export interface BibliographyExcerpt {
  file: string;
  content: string;
  citedKeys: number;
  foundEntries: number;
  missingKeys: string[];
}

export interface ReviewInput {
  sections: StrippedSection[];
  bibliography: BibliographyExcerpt;
}

function stripComments(tex: string): string {
  return tex
    .split("\n")
    .map((line) => {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "%" && (i === 0 || line[i - 1] !== "\\")) {
          return line.slice(0, i);
        }
      }

      return line;
    })
    .join("\n");
}

function removeRawBlocks(tex: string): string {
  return tex.replace(/\\begin\{raw\}[\s\S]*?\\end\{raw\}/g, "");
}

function getMainTextFilesFromPraceTex(): string[] {
  try {
    const prace = readFileSync(PRACE_PATH, "utf-8");
    const files: string[] = [];

    for (const rawLine of prace.split("\n")) {
      const line = stripComments(rawLine);

      if (line.includes("\\appendix")) break;

      for (const match of line.matchAll(/\\include\{([^}]+)\}/g)) {
        const includeName = match[1].trim();
        if (NON_BODY_INCLUDES.has(includeName)) continue;
        files.push(`${includeName}.tex`);
      }
    }

    return files.length > 0 ? files : FALLBACK_MAIN_TEXT_FILES;
  } catch {
    return FALLBACK_MAIN_TEXT_FILES;
  }
}

function extractCitationKeys(tex: string): string[] {
  const cleaned = stripComments(removeRawBlocks(tex));
  const keys: string[] = [];
  const citationRegex =
    /\\(?:cite|textcite|parencite|citeauthor|citeyear)(?:\[[^\]]*])*\{([^}]+)\}/g;

  for (const match of cleaned.matchAll(citationRegex)) {
    const rawKeys = match[1]
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean);

    keys.push(...rawKeys);
  }

  return keys;
}

function parseBibEntries(bibtex: string): Map<string, string> {
  const entries = new Map<string, string>();
  let index = 0;

  while (index < bibtex.length) {
    if (bibtex[index] !== "@") {
      index++;
      continue;
    }

    const start = index;
    index++;

    while (index < bibtex.length && /\s/.test(bibtex[index])) index++;
    while (index < bibtex.length && /[a-zA-Z]/.test(bibtex[index])) index++;
    while (index < bibtex.length && /\s/.test(bibtex[index])) index++;

    const open = bibtex[index];
    if (open !== "{" && open !== "(") continue;

    const close = open === "{" ? "}" : ")";
    let depth = 1;
    let inQuotes = false;
    index++;

    while (index < bibtex.length && depth > 0) {
      const ch = bibtex[index];
      const prev = bibtex[index - 1];

      if (ch === '"' && prev !== "\\") {
        inQuotes = !inQuotes;
      } else if (!inQuotes) {
        if (ch === open) depth++;
        if (ch === close) depth--;
      }

      index++;
    }

    const rawEntry = bibtex.slice(start, index).trim();
    const keyMatch = rawEntry.match(/^@\s*[a-zA-Z]+\s*[{(]\s*([^,\s]+)\s*,/s);
    if (keyMatch) {
      entries.set(keyMatch[1].trim(), rawEntry);
    }
  }

  return entries;
}

function buildBibliographyExcerpt(citationKeys: string[]): BibliographyExcerpt {
  const orderedKeys = [...new Set(citationKeys)];

  try {
    const bibtex = readFileSync(BIB_PATH, "utf-8");
    const entryMap = parseBibEntries(bibtex);
    const foundEntries: string[] = [];
    const missingKeys: string[] = [];

    for (const key of orderedKeys) {
      const entry = entryMap.get(key);
      if (entry) {
        foundEntries.push(entry);
      } else {
        missingKeys.push(key);
      }
    }

    const content = [
      "# Bibliografie",
      `Zdroj: literatura.bib`,
      `Citované klíče v hlavním textu: ${orderedKeys.length}`,
      `Nalezené záznamy: ${foundEntries.length}`,
      missingKeys.length > 0
        ? `Chybějící klíče: ${missingKeys.join(", ")}`
        : `Chybějící klíče: žádné`,
      `Poznámka: Přiloženy jsou pouze záznamy citované v hlavním textu.`,
      "",
      foundEntries.join("\n\n"),
    ]
      .filter(Boolean)
      .join("\n");

    return {
      file: "literatura.bib",
      content,
      citedKeys: orderedKeys.length,
      foundEntries: foundEntries.length,
      missingKeys,
    };
  } catch {
    return {
      file: "literatura.bib",
      content: "# Bibliografie\nNepodařilo se načíst thesis/literatura.bib.",
      citedKeys: orderedKeys.length,
      foundEntries: 0,
      missingKeys: orderedKeys,
    };
  }
}

/**
 * Strip LaTeX syntax from thesis .tex files, preserving structure as Markdown headings.
 * RAW blocks are removed (audit trail / notes only). DRAFT blocks are marked.
 */
export function stripLatex(tex: string, filename: string): string {
  let out = stripComments(removeRawBlocks(tex));

  // Mark DRAFT blocks so reviewer knows maturity level
  out = out.replace(/\\begin\{draft\}/g, "\n--- [DRAFT] ---");
  out = out.replace(/\\end\{draft\}/g, "--- [/DRAFT] ---\n");

  // Structure → Markdown headings
  out = out.replace(/\\chapter\*?\{(.+?)\}/g, "# $1");
  out = out.replace(/\\section\*?\{(.+?)\}/g, "## $1");
  out = out.replace(/\\subsection\*?\{(.+?)\}/g, "### $1");
  out = out.replace(/\\subsubsection\*?\{(.+?)\}/g, "#### $1");
  out = out.replace(/\\paragraph\*?\{(.+?)\}/g, "**$1**");

  // Labels and refs → readable
  out = out.replace(/\\label\{[^}]+\}/g, "");
  out = out.replace(/\\ref\{([^}]+)\}/g, "[ref:$1]");
  out = out.replace(/\\nameref\{([^}]+)\}/g, "[ref:$1]");
  out = out.replace(/\\autoref\{([^}]+)\}/g, "[ref:$1]");

  // Citations → inline
  out = out.replace(/\\cite\{([^}]+)\}/g, "[$1]");
  out = out.replace(/\\textcite\{([^}]+)\}/g, "[$1]");
  out = out.replace(/\\parencite\{([^}]+)\}/g, "[$1]");
  out = out.replace(/\\citeauthor\{([^}]+)\}/g, "[$1]");
  out = out.replace(/\\citeyear\{([^}]+)\}/g, "[$1]");
  out = out.replace(/\\ac[fs]?\{([^}]+)\}/g, "$1");
  out = out.replace(/\\mgrp\{([^}]+)\}/g, "$1");
  out = out.replace(/\\mmet\{([^}]+)\}/g, "$1");

  // Text formatting
  out = out.replace(/\\textbf\{(.+?)\}/g, "**$1**");
  out = out.replace(/\\textit\{(.+?)\}/g, "*$1*");
  out = out.replace(/\\texttt\{(.+?)\}/g, "`$1`");
  out = out.replace(/\\emph\{(.+?)\}/g, "*$1*");

  // Footnotes → inline parenthetical
  out = out.replace(/\\footnote\{(.+?)\}/g, " (footnote: $1)");

  // Lists
  out = out.replace(/\\begin\{(itemize|enumerate)\}/g, "");
  out = out.replace(/\\end\{(itemize|enumerate)\}/g, "");
  out = out.replace(/\\item\s*/g, "- ");

  // Tables — keep as simplified text
  out = out.replace(/\\begin\{table\}(?:\[[^\]]*])?/g, "\n[TABLE]\n");
  out = out.replace(/\\end\{table\}/g, "\n[/TABLE]\n");
  out = out.replace(/\\caption(?:\[[^\]]*])?\{(.+?)\}/g, "\nTable: $1\n");
  out = out.replace(/\\begin\{tabular\}[^}]*\}/g, "[TABLE START]\n");
  out = out.replace(/\\end\{tabular\}/g, "\n[TABLE END]");
  out = out.replace(/\\(toprule|midrule|bottomrule)/g, "");
  out = out.replace(/\\cmidrule(?:\([^)]*\))?\{[^}]+\}/g, "");
  out = out.replace(/\\checkmark/g, "OK");
  out = out.replace(/\\times/g, "FAIL");
  out = out.replace(/\\cna\{([^}]+)\}/g, "$1");
  out = out.replace(/\\cellcolor\{[^}]+\}/g, "");
  out = out.replace(/\\centering/g, "");
  out = out.replace(/\\resizebox\{[^}]+\}\{[^}]+\}\{/g, "");
  out = out.replace(/\\hline/g, "---");
  out = out.replace(/&/g, " | ");
  out = out.replace(/\\\\/g, "");

  // Figures
  out = out.replace(
    /\\begin\{figure\}[\s\S]*?\\caption\{(.+?)\}[\s\S]*?\\end\{figure\}/g,
    "[FIGURE: $1]"
  );
  out = out.replace(/\\begin\{figure\}[\s\S]*?\\end\{figure\}/g, "[FIGURE]");
  out = out.replace(/\\includegraphics[^{]*\{[^}]+\}/g, "");

  // Math — simplify
  out = out.replace(/\$([^$]+)\$/g, "$1");
  out = out.replace(/\\%/g, "%");

  // Special chars
  out = out.replace(/~/g, " ");
  out = out.replace(/\\,/g, " ");
  out = out.replace(/---/g, "—");
  out = out.replace(/--/g, "–");
  out = out.replace(/``/g, '"');
  out = out.replace(/''/g, '"');

  // Remove remaining LaTeX commands (catch-all for misc commands)
  out = out.replace(/\\(medskip|bigskip|smallskip|noindent|newpage|clearpage|pagebreak)/g, "");
  out = out.replace(/\\(addcontentsline|printbibliography)(\[[^\]]*])?(\{[^}]*\})*/g, "");
  out = out.replace(/\\Needspace\{[^}]+\}/g, "");
  out = out.replace(/\\vspace\{[^}]+\}/g, "");
  out = out.replace(/\\hspace\{[^}]+\}/g, "");
  out = out.replace(/\\def\\[a-zA-Z]+\{[^}]*\}/g, "");
  out = out.replace(/^\}\s*$/gm, "");

  // Clean up: collapse multiple blank lines
  out = out.replace(/\n{3,}/g, "\n\n");
  out = out.trim();

  return out;
}

/**
 * Count lines per block type from the ORIGINAL tex source (before stripping).
 */
function countBlockLines(tex: string): Record<BlockType, number> {
  const lines = tex.split("\n");
  let currentBlock: BlockType = "final";
  const counts: Record<BlockType, number> = { raw: 0, draft: 0, final: 0 };

  for (const line of lines) {
    if (line.includes("\\begin{raw}")) {
      currentBlock = "raw";
      continue;
    }
    if (line.includes("\\end{raw}")) {
      currentBlock = "final";
      continue;
    }
    if (line.includes("\\begin{draft}")) {
      currentBlock = "draft";
      continue;
    }
    if (line.includes("\\end{draft}")) {
      currentBlock = "final";
      continue;
    }
    if (line.trim()) counts[currentBlock]++;
  }

  return counts;
}

export function loadAndStripThesis(): ReviewInput {
  const sections: StrippedSection[] = [];
  const citationKeys: string[] = [];

  for (const file of getMainTextFilesFromPraceTex()) {
    const path = join(THESIS_DIR, file);
    try {
      const tex = readFileSync(path, "utf-8");
      citationKeys.push(...extractCitationKeys(tex));

      sections.push({
        file,
        blockTypes: countBlockLines(tex),
        content: stripLatex(tex, file),
      });
    } catch {
      console.warn(`Skipping ${file}: not found`);
    }
  }

  return {
    sections,
    bibliography: buildBibliographyExcerpt(citationKeys),
  };
}

export function buildFullText(input: ReviewInput): string {
  const { sections, bibliography } = input;
  const header = `# Bakalářská práce — text k recenzi
Generováno: ${new Date().toISOString().split("T")[0]}
Soubory hlavního textu: ${sections.map((s) => s.file).join(", ")}
Bibliografie: ${bibliography.file}
Poznámka: Hlavní text se načítá podle include mapy v prace.tex. RAW bloky (poznámky, audit trail) byly odstraněny. Posíláme DRAFT + finální text a k tomu citovanou bibliografii.

## Statistika (řádky v orig. zdrojích)
${sections
  .map(
    (s) =>
      `- ${s.file}: finální=${s.blockTypes.final}, draft=${s.blockTypes.draft}, raw=${s.blockTypes.raw} (odstraněno)`
  )
  .join("\n")}

## Bibliografie
- citované klíče: ${bibliography.citedKeys}
- nalezené záznamy: ${bibliography.foundEntries}
- chybějící klíče: ${bibliography.missingKeys.length > 0 ? bibliography.missingKeys.join(", ") : "žádné"}

---

`;

  return [
    header,
    sections.map((s) => s.content).join("\n\n---\n\n"),
    bibliography.content,
  ].join("\n\n---\n\n");
}

// CLI: run standalone to see stripped output
if (process.argv[1]?.endsWith("strip-latex.ts")) {
  const reviewInput = loadAndStripThesis();
  const full = buildFullText(reviewInput);
  console.log(full);
  console.error(
    `\nTotal: ${full.length} chars, ~${Math.round(full.length / 4)} tokens`
  );
}
