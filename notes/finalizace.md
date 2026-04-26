# Finalizace práce — checklist

Akce vázané na **moment odevzdání BP**, ne na obsah. Sem patří všechno, co se dělá až na finálním commitu / před tiskem / v den odevzdání.

## Repository a stabilní reference

- [ ] Vytvořit git tag `thesis-final` na finálním commitu
- [ ] Doplnit jméno tagu do URL v `thesis/kap03.tex` (sec:zaznam-bezhu, hledat `\url{https://github.com/7onc3k/Bakalarka}`) — formát např. `.../tree/thesis-final`
- [ ] Zvážit Zenodo archive (free DOI ze GitHub release); pokud ano, doplnit DOI do stejného odstavce vedle URL
- [ ] Smazat `TODO(odevzdani)` marker v `thesis/kap03.tex`

## Build

- [ ] Build s `\hideraw` a `\hidedraft` flagy (žádné raw/draft bloky v finálním PDF)
- [ ] Zkontrolovat seznam zkratek (acro)
- [ ] Zkontrolovat seznam obrázků a tabulek
- [ ] Bibliography pass — žádné `??` references, všechny citace expandované

## Před odevzdáním ověřit

- [ ] Žádné `\textcolor` debug bloky
- [ ] Žádné placeholder URLs
- [ ] AGENTS.md disclosure (`app01.tex`) odpovídá aktuální fakticitě
- [ ] Všechny TODO markery vyřešené nebo přesunuté do tohoto souboru

## Tisk a odevzdání

- [ ] PDF/A-2u compliance check
- [ ] Pevná vazba (FIS pravidla)
- [ ] Elektronická verze do InSIS
