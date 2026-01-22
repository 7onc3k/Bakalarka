# Formátování vzorců a modelů
       Pro sazbu všech vzorců doporučuji používat Editor rovnic, což je doplněk aplikace MS
Word, případně je možné zdarma si stáhnout trial verzi doplňku MathType, který nahrazuje
editor rovnic a má více funkcí. Máte-li MS Office 2007 nebo vyšší, bude vám MS Word nabízet
ještě jiný základní druh rovnic (přímo ze záložky Vložit (Insert) hlavního ovládacího panelu);
z různých důvodů tuto cestu nedoporučuji. Chceme-li vložit vzorec pomocí Editoru rovnic,
použijeme příkaz Vložit → Objekt → Editor rovnic 3.0. Pokud se rozhodnete nainstalovat
MathType, objeví se přímo v hlavním menu položka MathType, přes kterou je možné vzorce
vkládat.
      Většina vzorců bývá uváděna na samostatném řádku, vzorce jsou vycentrovány na střed
řádku, důležité vzorce jsou opatřeny číslováním (viz příklad níže). Číslování přebírá číslo
kapitoly a za tečkou je uvedeno pořadové číslo vzorce v dané kapitole (nepřebírá se číslování
oddílů a dalšího členění, tj. nepoužívá se např. číslování typu „(1.1.1)“). V této šabloně je pro
tento druh vzorců zaveden styl Vzorec základní (je použit u následujícího příkladu), kde je
centrování a odsazení číslování řešeno pomocí tabulátorů:

                                       b = ( XT X)−1 XT y .                                 (1.1)

       Ve vzorci (3.1), který představuje odhadovou funkci MNČ, vidíme hned několik zásad
sazby vzorců. Matice a vektory se píší tučným písmem – v Editoru rovnic označíme symbol
a použijeme zkratku ctrl+shift+b, transpozice (pokud ji značíme písmenem „T“) by měla být
normálním písmem, stejně jako všechny názvy zavedených funkcí (logaritmus apod.) – k tomu
slouží zkratka ctrl+shift+f. Všechna ostatní písmena se píší kurzívou, čísla normálním písmem
– jak je to ostatně v Editoru rovnic standardně nastaveno. Jediné místo, kde se píše číslo
kurzívou, je případný název proměnné obsahující číslici (nikoli jako index, ale přímo v názvu,
například tyč150cm – mimochodem, podobné názvy proměnných se nedoporučují). Stejné
formátování je samozřejmě třeba dodržovat i v případě, že nepoužijete Editor rovnic. Uveďme
ještě dva příklady vzorců s indexy a zavedenými funkcemi:

                                    dij = max
                                         k =1,2,...,n
                                                        dik + dkj  ,
                                        x1,2 = b  ln y .

      Zejména má-li práce větší množství vzorců, je vhodné číslovat pouze ty z nich, na které
je později v textu výslovně odkazováno. Se vzorci, ačkoli jsou na vlastním řádku, zacházíme
jako s větami, případně součástmi vět, do kterých jsou v textu zasazeny. Za příslušným vzorcem
bude tedy v případě potřeby uvedena čárka nebo tečka. Případné číslování vzorce je chápáno
jako doplňující grafický symbol a do toku textu nepatří (žádná interpunkční znaménka se u něj
proto nepíší). Tedy například: kapacity dodavatelů v matematickém modelu dopravního
problému zohledníme pomocí omezení
                                    n
                                     xij  ai , i = 1, 2,..., m ,                      (1.2)
                                    j =1

kde výraz ai představuje kapacitu i-tého dodavatele. Všimněte si, že v tomto odstavci jsem
použil styl Normální bez odsazení, a to z toho důvodu, že vložením vzorce jsme sice přerušili
tok odstavce ve smyslu terminologie MS Word, nikoli však ve smyslu stylistickém, neboť
pokračujeme dál v započaté větě; odsazení prvního řádku by v tomto případě působilo rušivě.
      Uvádí-li se v práci odvození nějakého vzorce postupnou úpravou na několik řádků,
zarovnávají se pod sebe symboly „=“, jako je tomu v následujícím příkladu, který odvozuje
rozptyl odhadů parametrů lineárního regresního modelu pomocí MNČ:

                             var b = var ( XT X) −1 XT ( Xβ + ε)  =
                                                                 
                                   = var β + ( XT X)−1 XTε  =
                                                            
                                   = ( XT X)−1 XT var ε X( XT X) −1 =

                                   = ( XT X)−1 XT 2I n X( XT X)−1 =

                                   =  2 ( XT X)−1.

Obr. 0.1 Zadávání sloupců vycentrovaných podle symbolů typu „=“

      Takového formátování lze docílit v Editoru rovnic (příp. v MathType) následujícím
způsobem. Do prázdného vzorce nejprve vložíme prázdnou matici, zde např. o pěti řádcích
a jednom sloupci, přičemž v zadávacím dialogu pro vytváření matic (viz Obr. 0.1) zvolíme
zarovnání sloupce matice (Column alignment) podle symbolu „=“. Stejná možnost zarovnání
se volí i v případě, že chceme zarovnat podle jiných relačních symbolů, než je rovnítko, jako
jsou např. ≤ nebo  .
      Podobný trik lze použít i při definovaní omezujících podmínek matematických modelů.
Toto jsou omezující podmínky pro úlohu obchodního cestujícího:
                                   n
                                   xij = 1,              j = 1, 2,   , n,
                                  i =1
                                   n
                                   xij = 1,              i = 1, 2,   , n,
                                  j =1                                                        (1.3)
                   ui + 1 − M (1 − xij )  u j ,          i = 2,3,    , n, j = 1, 2,   , n,
                                         ui  0,          i = 1, 2,   , n,
                                         xij {0,1},      i = 1, 2,   , n, j = 1, 2,   , n.

Tentokrát jsou použity sloupce dva – vždy jeden pro podmínku a jeden pro iterační indexy.
Kromě vycentrování sloupce podle „=“ je vhodné v dialogu Editoru rovnic nastavit, aby řádky
modelu mohly být různě vysoké (prázdné zaškrtávací pole Equal row heights, viz opět Obr.
0.1).
     Chceme-li přidat nad omezující podmínky vycentrovanou účelovou funkci, musíme
postupovat ještě trochu rafinovaněji: nejprve si vytvoříme v Editoru rovnic dvousložkový
sloupcový vektor, jehož složky necháme zarovnat na střed. Do horní z nich potom vložíme
účelovou funkci a do spodní nakopírujeme celou matici omezujících podmínek z (1.3).
Výsledek vypadá následovně:
                                               n n
                                          z =   cij xij → max,
                                              i =1 j =1
                                   n
                                   xij = 1,              j = 1, 2,   , n,
                                  i =1
                                   n                                                          (1.4)
                                   xij = 1,              i = 1, 2,   , n,
                                  j =1
                   ui + 1 − M (1 − xij )  u j ,          i = 2,3,    , n, j = 1, 2,   , n,
                                         ui  0,          i = 1, 2,   , n,
                                         xij  {0,1},     i = 1, 2,   , n, j = 1, 2,   , n.
