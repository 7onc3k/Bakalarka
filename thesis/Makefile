.PHONY: all draft clean view view-draft

LATEX = pdflatex -interaction=nonstopmode

# Všechno (raw + draft + finální) — pro nás
all:
	$(LATEX) prace.tex > /dev/null 2>&1
	biber prace > /dev/null 2>&1
	$(LATEX) prace.tex > /dev/null 2>&1
	$(LATEX) prace.tex > /dev/null 2>&1
	@echo "✓ prace.pdf (vše)"

# Bez RAW bloků (draft + finální) — pro vedoucího
draft:
	$(LATEX) '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	$(LATEX) '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	@mv prace.pdf prace-draft.pdf
	@echo "✓ prace-draft.pdf (bez RAW)"

# Prohlížení
view: all
	@evince prace.pdf &

view-draft: draft
	@evince prace-draft.pdf &

clean:
	rm -f prace-draft.pdf *.aux *.log *.out *.toc *.lot *.lof
