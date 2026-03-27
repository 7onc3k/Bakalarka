.PHONY: all prace-full prace-draft prace-clean view view-prace-full view-prace-draft view-prace-clean clean watch watch-draft watch-clean

LATEX = pdflatex -interaction=nonstopmode

# Všechno (raw + draft + finální) — pro nás
prace-full:
	$(LATEX) -jobname=prace-full prace.tex > /dev/null 2>&1
	biber prace-full > /dev/null 2>&1
	$(LATEX) -jobname=prace-full prace.tex > /dev/null 2>&1
	$(LATEX) -jobname=prace-full prace.tex > /dev/null 2>&1
	@echo "✓ prace-full.pdf (vše)"

# Bez RAW bloků (draft + finální) — pro vedoucího
prace-draft:
	$(LATEX) -jobname=prace-draft '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	biber prace-draft > /dev/null 2>&1
	$(LATEX) -jobname=prace-draft '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	$(LATEX) -jobname=prace-draft '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	@echo "✓ prace-draft.pdf (bez RAW)"

# Jen finální text (bez raw i draft)
prace-clean:
	$(LATEX) -jobname=prace-clean '\def\hideraw{1}\def\hidedraft{1}\input{prace}' > /dev/null 2>&1
	biber prace-clean > /dev/null 2>&1
	$(LATEX) -jobname=prace-clean '\def\hideraw{1}\def\hidedraft{1}\input{prace}' > /dev/null 2>&1
	$(LATEX) -jobname=prace-clean '\def\hideraw{1}\def\hidedraft{1}\input{prace}' > /dev/null 2>&1
	@echo "✓ prace-clean.pdf (jen finální)"

# Zpětná kompatibilita
all: prace-full

# Prohlížení
view:
	@evince prace-full.pdf 2>/dev/null &

open: view

view-prace-full: prace-full
	@evince prace-full.pdf &

view-prace-draft: prace-draft
	@evince prace-draft.pdf &

view-prace-clean: prace-clean
	@evince prace-clean.pdf &

# Auto-rebuild při změně .tex/.bib souborů (Ctrl+C pro zastavení)
# Čeká 5s klidu po poslední změně, pak buildne. Evince reloaduje automaticky.
DEBOUNCE = 5
TEX_FILES = $(wildcard *.tex *.bib generated/*.tex)

watch: prace-full
	@evince prace-full.pdf 2>/dev/null &
	@echo "Watching .tex/.bib files ($(DEBOUNCE)s debounce)... Ctrl+C to stop"
	@while true; do \
		inotifywait -q -e modify $(TEX_FILES); \
		while inotifywait -q -t $(DEBOUNCE) -e modify $(TEX_FILES) 2>/dev/null; do :; done; \
		echo "--- Rebuilding prace-full ---"; \
		$(MAKE) -s prace-full || true; \
	done

watch-draft: prace-draft
	@evince prace-draft.pdf 2>/dev/null &
	@echo "Watching .tex/.bib files ($(DEBOUNCE)s debounce)... Ctrl+C to stop"
	@while true; do \
		inotifywait -q -e modify $(TEX_FILES); \
		while inotifywait -q -t $(DEBOUNCE) -e modify $(TEX_FILES) 2>/dev/null; do :; done; \
		echo "--- Rebuilding prace-draft ---"; \
		$(MAKE) -s prace-draft || true; \
	done

watch-clean: prace-clean
	@evince prace-clean.pdf 2>/dev/null &
	@echo "Watching .tex/.bib files ($(DEBOUNCE)s debounce)... Ctrl+C to stop"
	@while true; do \
		inotifywait -q -e modify $(TEX_FILES); \
		while inotifywait -q -t $(DEBOUNCE) -e modify $(TEX_FILES) 2>/dev/null; do :; done; \
		echo "--- Rebuilding prace-clean ---"; \
		$(MAKE) -s prace-clean || true; \
	done

clean:
	rm -f prace-full.pdf prace-draft.pdf prace-clean.pdf
	rm -f prace-full.aux prace-draft.aux prace-clean.aux
	rm -f prace.aux prace.log prace.out prace.toc prace.lot prace.lof
	rm -f prace-full.bbl prace-draft.bbl prace-clean.bbl
	rm -f prace-full.bcf prace-draft.bcf prace-clean.bcf
	rm -f prace-full.blg prace-draft.blg prace-clean.blg
	rm -f prace-full.log prace-draft.log prace-clean.log
	rm -f prace-full.out prace-draft.out prace-clean.out
	rm -f prace-full.toc prace-draft.toc prace-clean.toc
	rm -f prace-full.lot prace-draft.lot prace-clean.lot
	rm -f prace-full.lof prace-draft.lof prace-clean.lof
