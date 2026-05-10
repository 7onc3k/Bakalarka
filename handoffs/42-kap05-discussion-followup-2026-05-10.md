# Handoff: kap05 discussion follow-up

Datum: 2026-05-10
Branch: `dev`
PR: `dev -> main`, draft PR #68

## Stav

Probíhá revize kapitoly 5 chronologicky od sekce 5.2 dál. Cíl je
zkrátit opakování, zpřesnit porovnání s literaturou a hlídat, aby text
nepůsobil defenzivně. Nepřidávat nové velké literární argumenty na
poslední chvíli, pokud už nejsou připravené v kapitolách 1--2.

Hotovo v aktuálním průchodu:

- `patch` v netechnických větách nahrazeno za `změna kódu`.
- 5.2.1 přepsána jako skutečné porovnání s literaturou, ne jen recap.
- Shotgun citace v hlavních thesis souborech rozděleny nebo zpřesněny.
- Odstavec o Package Quality v 5.2.2 zkrácen a ukotven jako ablace B.

## Necommitnuté soubory k aktuálnímu logickému celku

- `thesis/kap01.tex`
- `thesis/kap02.tex`
- `thesis/kap04.tex`
- `thesis/kap05.tex`
- `handoffs/42-kap05-discussion-followup-2026-05-10.md`

Pozor: v pracovním stromu jsou i nesouvisející dirty soubory a experiment
adresáře. Při commitu stagovat jen soubory související s aktuálním celkem.

## Dál chronologicky

1. 5.2.2 bridge k iterativnímu zlepšování instrukcí.
   - Zvážit jednu krátkou větu po úvodu 5.2.2.
   - Smysl: práce neposuzuje instrukce jen jako přítomný/nepřítomný artefakt,
     ale jako obsah upravovaný podle naměřených selhání.
   - Neotvírat nový dlouhý literární blok.

2. 5.2.2 odosobnit styl.
   - Aktuálně zkontrolovat výskyty typu `naše výsledky`, `v našich datech`,
     `interpretujeme`.
   - Preferovat neosobní formulace: `výsledky této studie`, `pilotní fáze
     ukázala`, `tato práce interpretuje`.

3. 5.3 Omezení a jejich dopad.
   - Zkontrolovat, jestli nedeterminismus a ablace neopakují 5.1 moc detailně.
   - Role 5.3: dopad omezení na sílu závěrů, ne další výsledkový recap.

4. 5.4 Doporučení pro praxi.
   - Přepsat z výsledkového recapu na praktická doporučení.
   - Doporučení má říct, co má praktik dělat, ne znovu dokazovat A/B ablace.

5. 5.5 Náměty pro další výzkum.
   - Odstranit duplicity proti 5.3/5.4.
   - Opravit rozbité věty a udržet jen skutečné otevřené otázky.

## Guardraily

- Bez ručního buildu, pokud si o něj uživatel neřekne. Běží watch workflow.
- Nepůsobit defenzivně. Formulovat jako přesný, obhajitelný výklad.
- Nepřidávat zbytečné dvojtečky.
- U citací preferovat konkrétní vztah zdroj -> claim. Vyhnout se shotgun citacím.
- Case study claims držet jako indikativní / proveditelnost / analytická
  generalizace, ne statistické kauzální tvrzení.
