import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const THESIS_DIR = join(import.meta.dirname, "..", "..", "..", "thesis");

// Files to process in order
const THESIS_FILES = [
  "uvod.tex",
  "kap01.tex",
  "kap02.tex",
  "kap03.tex",
  "kap04.tex",
  "kap05.tex",
  "zaver.tex",
];

type BlockType = "raw" | "draft" | "final";

interface StrippedSection {
  file: string;
  content: string;
  blockTypes: Record<BlockType, number>; // line counts per type
}

/**
 * Strip LaTeX syntax from thesis .tex files, preserving structure as Markdown headings.
 * RAW blocks are removed (audit trail / notes only). DRAFT blocks are marked.
 */
export function stripLatex(tex: string, filename: string): string {
  let out = tex;

  // Remove RAW blocks entirely — they're audit trail, not reviewable content
  out = out.replace(/\\begin\{raw\}[\s\S]*?\\end\{raw\}/g, "");

  // Mark DRAFT blocks so reviewer knows maturity level
  out = out.replace(/\\begin\{draft\}/g, "\n--- [DRAFT] ---");
  out = out.replace(/\\end\{draft\}/g, "--- [/DRAFT] ---\n");

  // Structure → Markdown headings
  out = out.replace(/\\chapter\{(.+?)\}/g, "# $1");
  out = out.replace(/\\section\{(.+?)\}/g, "## $1");
  out = out.replace(/\\subsection\{(.+?)\}/g, "### $1");
  out = out.replace(/\\subsubsection\{(.+?)\}/g, "#### $1");
  out = out.replace(/\\paragraph\{(.+?)\}/g, "**$1**");

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
  out = out.replace(/\\begin\{tabular\}[^}]*\}/g, "[TABLE START]");
  out = out.replace(/\\end\{tabular\}/g, "[TABLE END]");
  out = out.replace(/\\begin\{table\}[^]]*?\\end\{table\}/gs, "[TABLE - see original]");
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
  out = out.replace(/\\vspace\{[^}]+\}/g, "");
  out = out.replace(/\\hspace\{[^}]+\}/g, "");
  out = out.replace(/\\def\\[a-zA-Z]+\{[^}]*\}/g, "");

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

export function loadAndStripThesis(): StrippedSection[] {
  const sections: StrippedSection[] = [];

  for (const file of THESIS_FILES) {
    const path = join(THESIS_DIR, file);
    try {
      const tex = readFileSync(path, "utf-8");
      const blockTypes = countBlockLines(tex); // count from original before stripping
      const content = stripLatex(tex, file);
      sections.push({ file, content, blockTypes });
    } catch {
      console.warn(`Skipping ${file}: not found`);
    }
  }

  return sections;
}

export function buildFullText(sections: StrippedSection[]): string {
  const header = `# Bakalářská práce — text k recenzi
Generováno: ${new Date().toISOString().split("T")[0]}
Soubory: ${sections.map((s) => s.file).join(", ")}
Poznámka: RAW bloky (poznámky, audit trail) byly odstraněny. Posíláme pouze DRAFT + finální text.

## Statistika (řádky v orig. zdrojích)
${sections
  .map(
    (s) =>
      `- ${s.file}: finální=${s.blockTypes.final}, draft=${s.blockTypes.draft}, raw=${s.blockTypes.raw} (odstraněno)`
  )
  .join("\n")}

---

`;

  return header + sections.map((s) => s.content).join("\n\n---\n\n");
}

// CLI: run standalone to see stripped output
if (process.argv[1]?.endsWith("strip-latex.ts")) {
  const sections = loadAndStripThesis();
  const full = buildFullText(sections);
  console.log(full);
  console.error(
    `\nTotal: ${full.length} chars, ~${Math.round(full.length / 4)} tokens`
  );
}
