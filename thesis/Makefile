.PHONY: all full draft clean-pdf prace-full prace-draft prace-clean \
	view view-full view-draft view-clean view-prace-full view-prace-draft view-prace-clean \
	clean watch watch-full watch-draft watch-clean

LATEX = pdflatex -interaction=nonstopmode
BUILDDIR = .build

# Všechno (raw + draft + finální) — pro nás
prace-full:
	@mkdir -p $(BUILDDIR)
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-full prace.tex > /dev/null 2>&1
	biber --input-directory=$(BUILDDIR) --output-directory=$(BUILDDIR) prace-full > /dev/null 2>&1
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-full prace.tex > /dev/null 2>&1
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-full prace.tex > /dev/null 2>&1
	@cp $(BUILDDIR)/prace-full.pdf prace-full.pdf 2>/dev/null || true
	@echo "✓ prace-full.pdf (vše)"

# Bez RAW bloků (draft + finální) — pro vedoucího
prace-draft:
	@mkdir -p $(BUILDDIR)
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-draft '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	biber --input-directory=$(BUILDDIR) --output-directory=$(BUILDDIR) prace-draft > /dev/null 2>&1
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-draft '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-draft '\def\hideraw{1}\input{prace}' > /dev/null 2>&1
	@cp $(BUILDDIR)/prace-draft.pdf prace-draft.pdf 2>/dev/null || true
	@echo "✓ prace-draft.pdf (bez RAW)"

# Jen finální text (bez raw i draft)
prace-clean:
	@mkdir -p $(BUILDDIR)
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-clean '\def\hideraw{1}\def\hidedraft{1}\input{prace}' > /dev/null 2>&1
	biber --input-directory=$(BUILDDIR) --output-directory=$(BUILDDIR) prace-clean > /dev/null 2>&1
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-clean '\def\hideraw{1}\def\hidedraft{1}\input{prace}' > /dev/null 2>&1
	$(LATEX) -output-directory=$(BUILDDIR) -jobname=prace-clean '\def\hideraw{1}\def\hidedraft{1}\input{prace}' > /dev/null 2>&1
	@cp $(BUILDDIR)/prace-clean.pdf prace-clean.pdf 2>/dev/null || true
	@echo "✓ prace-clean.pdf (jen finální)"

# Zpětná kompatibilita
all: prace-full
full: prace-full
draft: prace-draft
clean-pdf: prace-clean

# Prohlížení
VIEWER = env -u GTK_PATH -u GTK_EXE_PREFIX -u GTK_IM_MODULE_FILE -u GIO_MODULE_DIR -u LOCPATH -u GSETTINGS_SCHEMA_DIR evince

view:
	@$(VIEWER) prace-full.pdf 2>/dev/null &

view-full: view-prace-full

view-draft: view-prace-draft

view-clean: view-prace-clean

open: view

view-prace-full: prace-full
	@$(VIEWER) prace-full.pdf &

view-prace-draft: prace-draft
	@$(VIEWER) prace-draft.pdf &

view-prace-clean: prace-clean
	@$(VIEWER) prace-clean.pdf &

# Auto-rebuild při změně .tex/.bib souborů (Ctrl+C pro zastavení)
# `watch` = full, ostatní varianty mají explicitní aliasy.

watch: prace-full
	@./watch.sh prace-full

watch-full: prace-full
	@./watch.sh prace-full

watch-draft: prace-draft
	@./watch.sh prace-draft

watch-clean: prace-clean
	@./watch.sh prace-clean

reload:
	@pkill -f 'evince.*prace' 2>/dev/null; sleep 0.3
	@$(VIEWER) prace-full.pdf 2>/dev/null &
	@echo "✓ evince restarted"

clean:
	rm -rf $(BUILDDIR)
	rm -f prace-full.pdf prace-draft.pdf prace-clean.pdf
	rm -f prace.aux prace.log prace.out prace.toc prace.lot prace.lof
