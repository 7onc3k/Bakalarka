# Thesis Snippets

LaTeX-ready ukazky pro vlozeni do thesis bez rucniho prepisovani diffu.

## Doporučene pouziti

- `agents-diff-r1-r2.tex`:
  nejvhodnejsi jako hlavni vizualni ukazka iterativni upravy `AGENTS.md`
  v metodice nebo prakticke casti.
- `agents-diff-r2-r3.tex`:
  mensi follow-up diff ukazujici jemnejsi dolaďovani dalsi iterace.

## Vlozeni do thesis

Z adresare `/home/dev/code/Bakalarka/thesis` lze snippet vlozit napr.:

```tex
\input{../experiments/infra/thesis-snippets/agents-diff-r1-r2.tex}
```

## Poznamka k vyberu

Do textu thesis je obvykle lepsi dat kratky reprezentativni diff nez cely
soubor:

- ctenar rychle vidi "co se zmenilo"
- zachova se audit trail mezi iteracemi
- nevznika vizualne tezky appendix s desitkami radku beze zmen
