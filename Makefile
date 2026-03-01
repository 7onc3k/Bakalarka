.PHONY: build view draft view-draft clean

build:
	@./scripts/build-thesis

view:
	@./scripts/view-thesis

draft view-draft clean:
	$(MAKE) -C thesis $@
