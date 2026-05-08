.PHONY: build view full draft clean-pdf prace-full prace-draft prace-clean \
	view-full view-draft view-clean view-prace-full view-prace-draft view-prace-clean \
	clean watch watch-full watch-draft watch-clean

build:
	@./scripts/build-thesis

view:
	@./scripts/view-thesis

# Tři varianty PDF: full (vše), draft (bez RAW), clean (jen finální)
full draft clean-pdf prace-full prace-draft prace-clean view-full view-draft view-clean view-prace-full view-prace-draft view-prace-clean clean watch watch-full watch-draft watch-clean:
	$(MAKE) -C thesis $@
