.PHONY: build view prace-full prace-draft prace-clean view-prace-full view-prace-draft view-prace-clean clean watch watch-draft watch-clean

build:
	@./scripts/build-thesis

view:
	@./scripts/view-thesis

# Tři varianty PDF: full (vše), draft (bez RAW), clean (jen finální)
prace-full prace-draft prace-clean view-prace-full view-prace-draft view-prace-clean clean watch watch-draft watch-clean:
	$(MAKE) -C thesis $@
