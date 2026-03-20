#!/usr/bin/env python3

from __future__ import annotations

import html
import subprocess
from pathlib import Path


ROOT = Path("/home/dev/code/Bakalarka")
THESIS = ROOT / "thesis"
RUNS = ROOT / "experiments" / "runs"
IMG = THESIS / "img" / "generated"
GENERATED = THESIS / "generated"

CHROME = "google-chrome"
WINDOW_WIDTH = 1600
BASELINE_FONT_SIZE = 22
BASELINE_HEADER_SIZE = 22
BASELINE_LINE_HEIGHT = 1.45
DIFF_FONT_SIZE = 22
DIFF_HEADER_SIZE = 22
DIFF_LINE_HEIGHT = 1.45


def shell_text(cmd: list[str]) -> str:
    result = subprocess.run(cmd, text=True, capture_output=True, check=False)
    if result.returncode not in (0, 1):
        raise subprocess.CalledProcessError(
            result.returncode, cmd, output=result.stdout, stderr=result.stderr
        )
    return result.stdout


def render_png(html_path: Path, png_path: Path) -> None:
    subprocess.run(
        [
            "npx",
            "--yes",
            "playwright",
            "screenshot",
            "--browser",
            "chromium",
            "--full-page",
            "--viewport-size",
            f"{WINDOW_WIDTH},100",
            html_path.as_uri(),
            str(png_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def wrap_card(
    title: str,
    body_html: str,
    *,
    font_size: int,
    header_size: int,
    line_height: float,
    extra_css: str = "",
) -> str:
    return f"""<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
html, body {{
  margin: 0;
  padding: 0;
  background: #ffffff;
  overflow: hidden;
}}
body {{
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  color: #1f2937;
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
}}
.frame {{
  padding: 12px;
}}
.card {{
  border: 1px solid #d8dee6;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}}
.header {{
  background: #f6f8fb;
  border-bottom: 1px solid #d8dee6;
  padding: 10px 16px;
  font: 600 {header_size}px/1.25 'IBM Plex Sans', system-ui, sans-serif;
  color: #1f2937;
}}
.content {{
  padding: 10px 16px 14px;
}}
pre {{
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: 'IBM Plex Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  font-size: {font_size}px;
  line-height: {line_height};
  color: #1f2937;
}}
.line {{
  display: block;
  padding: 0 6px;
  border-radius: 4px;
}}
.add {{
  background: #e8f5e9;
}}
.del {{
  background: #fdecec;
}}
{extra_css}
</style>
</head>
<body>
  <div class="frame">
    <div class="card">
      <div class="header">{html.escape(title)}</div>
      <div class="content">{body_html}</div>
    </div>
  </div>
</body>
</html>
"""


def lines_to_pre(lines: list[tuple[str, str]]) -> str:
    parts = ["<pre>"]
    for kind, text in lines:
        class_name = "line"
        if kind == "add":
            class_name += " add"
        elif kind == "del":
            class_name += " del"
        safe = html.escape(text) if text else " "
        parts.append(f'<span class="{class_name}">{safe}</span>')
    parts.append("</pre>")
    return "".join(parts)


def baseline_lines() -> list[str]:
    text = (THESIS / "generated" / "app03baselineagentsmd.txt").read_text()
    return text.rstrip().splitlines()


def diff_excerpt(
    old_file: Path, new_file: Path, *, full: bool = False
) -> list[tuple[str, str]]:
    context = "999" if full else "2"
    raw = shell_text(
        ["git", "diff", "--no-index", f"--unified={context}", str(old_file), str(new_file)]
    )
    lines = raw.splitlines()
    excerpt: list[tuple[str, str]] = []
    for line in lines:
        if line.startswith("diff --git") or line.startswith("index "):
            continue
        if line.startswith("--- ") or line.startswith("+++ "):
            continue
        if line.startswith("@@ "):
            continue
        if line.startswith("+"):
            excerpt.append(("add", line[1:]))
        elif line.startswith("-"):
            excerpt.append(("del", line[1:]))
        else:
            excerpt.append(("plain", line[1:] if line.startswith(" ") else line))
    return excerpt


def write_html(
    name: str,
    title: str,
    body_html: str,
    *,
    font_size: int,
    header_size: int,
    line_height: float,
) -> Path:
    html_path = GENERATED / name
    html_path.write_text(
        wrap_card(
            title,
            body_html,
            font_size=font_size,
            header_size=header_size,
            line_height=line_height,
        )
    )
    return html_path


def main() -> None:
    GENERATED.mkdir(parents=True, exist_ok=True)
    IMG.mkdir(parents=True, exist_ok=True)

    baseline_html = write_html(
        "app03-baseline-single-card.html",
        "Baseline AGENTS.md",
        lines_to_pre([("plain", line) for line in baseline_lines()]),
        font_size=BASELINE_FONT_SIZE,
        header_size=BASELINE_HEADER_SIZE,
        line_height=BASELINE_LINE_HEIGHT,
    )
    render_png(baseline_html, IMG / "app03-baseline-single.png")

    r1_r2_lines = diff_excerpt(RUNS / "pilot-r1" / "AGENTS.md", RUNS / "pilot-r2" / "AGENTS.md")
    r1_r2_html = write_html(
        "agents-diff-r1-r2-card.html",
        "AGENTS.md: pilot-r1 -> pilot-r2",
        lines_to_pre(r1_r2_lines),
        font_size=DIFF_FONT_SIZE,
        header_size=DIFF_HEADER_SIZE,
        line_height=DIFF_LINE_HEIGHT,
    )
    render_png(r1_r2_html, IMG / "agents-diff-r1-r2.png")

    r2_r3_lines = diff_excerpt(RUNS / "pilot-r2" / "AGENTS.md", RUNS / "pilot-r3" / "AGENTS.md")
    r2_r3_html = write_html(
        "agents-diff-r2-r3-card.html",
        "AGENTS.md: pilot-r2 -> pilot-r3",
        lines_to_pre(r2_r3_lines),
        font_size=DIFF_FONT_SIZE,
        header_size=DIFF_HEADER_SIZE,
        line_height=DIFF_LINE_HEIGHT,
    )
    render_png(r2_r3_html, IMG / "agents-diff-r2-r3.png")

    r3_r4_lines = diff_excerpt(RUNS / "pilot-r3" / "AGENTS.md", RUNS / "pilot-r4" / "AGENTS.md")
    r3_r4_html = write_html(
        "agents-diff-r3-r4-card.html",
        "AGENTS.md: pilot-r3 -> pilot-r4",
        lines_to_pre(r3_r4_lines),
        font_size=DIFF_FONT_SIZE,
        header_size=DIFF_HEADER_SIZE,
        line_height=DIFF_LINE_HEIGHT,
    )
    render_png(r3_r4_html, IMG / "agents-diff-r3-r4.png")

    r3_r5_lines = diff_excerpt(
        RUNS / "pilot-r3" / "AGENTS.md",
        ROOT / "experiments" / "infra" / "inputs" / "AGENTS.md",
    )
    r3_r5_html = write_html(
        "agents-diff-r3-r5-card.html",
        "AGENTS.md: pilot-r3 -> pilot-r5",
        lines_to_pre(r3_r5_lines),
        font_size=DIFF_FONT_SIZE,
        header_size=DIFF_HEADER_SIZE,
        line_height=DIFF_LINE_HEIGHT,
    )
    render_png(r3_r5_html, IMG / "agents-diff-r3-r5.png")

    r3_text = (RUNS / "pilot-r3" / "AGENTS.md").read_text().rstrip().splitlines()
    r3_full_html = write_html(
        "r3-agents-full-card.html",
        "AGENTS.md: pilot-r3 (nejlepší pilotní iterace)",
        lines_to_pre([("plain", line) for line in r3_text]),
        font_size=BASELINE_FONT_SIZE,
        header_size=BASELINE_HEADER_SIZE,
        line_height=BASELINE_LINE_HEIGHT,
    )
    render_png(r3_full_html, IMG / "r3-agents-full.png")

    r1_r3_lines = diff_excerpt(RUNS / "pilot-r1" / "AGENTS.md", RUNS / "pilot-r3" / "AGENTS.md", full=True)
    r1_r3_html = write_html(
        "agents-diff-r1-r3-card.html",
        "AGENTS.md: pilot-r1 -> pilot-r3 (souhrnná evoluce)",
        lines_to_pre(r1_r3_lines),
        font_size=DIFF_FONT_SIZE,
        header_size=DIFF_HEADER_SIZE,
        line_height=DIFF_LINE_HEIGHT,
    )
    render_png(r1_r3_html, IMG / "agents-diff-r1-r3.png")

    r3_ablace_a_lines = diff_excerpt(
        RUNS / "pilot-r3" / "AGENTS.md",
        ROOT / "experiments" / "infra" / "inputs" / "AGENTS-ablace-a.md",
    )
    r3_ablace_a_html = write_html(
        "agents-diff-r3-ablace-a-card.html",
        "AGENTS.md: pilot-r3 -> ablace-a (bez verifikačních kroků)",
        lines_to_pre(r3_ablace_a_lines),
        font_size=DIFF_FONT_SIZE,
        header_size=DIFF_HEADER_SIZE,
        line_height=DIFF_LINE_HEIGHT,
    )
    render_png(r3_ablace_a_html, IMG / "agents-diff-r3-ablace-a.png")

    r3_ablace_b_lines = diff_excerpt(
        RUNS / "pilot-r3" / "AGENTS.md",
        ROOT / "experiments" / "infra" / "inputs" / "AGENTS-ablace-b.md",
    )
    r3_ablace_b_html = write_html(
        "agents-diff-r3-ablace-b-card.html",
        "AGENTS.md: pilot-r3 -> ablace-b (bez Package Quality)",
        lines_to_pre(r3_ablace_b_lines),
        font_size=DIFF_FONT_SIZE,
        header_size=DIFF_HEADER_SIZE,
        line_height=DIFF_LINE_HEIGHT,
    )
    render_png(r3_ablace_b_html, IMG / "agents-diff-r3-ablace-b.png")


if __name__ == "__main__":
    main()
