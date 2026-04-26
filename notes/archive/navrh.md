# PROBLEM & MOTIVACE

interni system ve kterem se tezko neco dela (maintainability, neni scallfolding, pridavani funkci)

omezeni technologie jako next js, supabase, kvuli patternum ktery pouzivaji

potreba nativni AI integrace, organizace a management slozitych pipelines

nedostatecny context engineering(specifikace, konvence, architektura) pro LLMs

syntaxe je nerelevantni, relevantni je architektura a design.

centralizace contextu, odeleni storefront od backendu, web/erps a interni nastroje, centralizovat to vsechno,  pro zvyseni schopnosti jednat pro LLM agents


centralizace contextu, odeleni storefront od backendu, web/erps a interni nastroje, centralizovat to vsechno,  pro zvyseni schopnosti jednat pro LLM agents


# CIL PRACE

Zjistit jaka architektura je nejvice idealni pro podnikove systemy ktere jsou nativne integrovane s LLM

Zjistit jake jsou limity a nedostatky LLMs a jake jsou moznosti jak se jim vyhnout

pouzit opensource repos ? brownfield, greenfield

prompt learning feedback loop ?

# VYZKUMNE OTAZKY

RQ1: Jaké charakteristiky softwarové architektury zvyšují úspěšnost autonomních LLM agentů při vývoji a údržbě podnikových systémů?

RQ2: Jaké jsou hlavní limity LLM při automatizovaném vývoji a jak lze tyto nedostatky minimalizovat pomocí context engineeringu?


# POJMY

Vysvetlit jak funguji coding agents

pristupy tool calling, prompt based tool calling, diff edit, concurents edits, subtasks/subagents, hooks

CLI nastroje, cursor, windsurf

ARCHITECTURAL, DESING PATERRNS

Metody vyvoje softwaru TDD, Schema-driven-development, Contracts




# HLAVNI VYSTUPY

Specifikace

Evaluace LLMs modelů

GIT workflow 


# LITERATURA

BMAD-method https://github.com/bmad-code-org/BMAD-METHOD

BMAD-method https://github.com/bmad-code-org/BMAD-METHOD

https://arxiv.org/abs/2509.16941

https://www.amazon.com/Learning-Domain-Driven-Design-Aligning-Architecture/dp/1098100131

https://github.com/github/spec-kit

https://metr.org/

thinking in systems(book)

# VZOROVE BAKALARSKE PRACE

https://vskp.vse.cz/94968_empiricke-porovnani-velkych-jazykovych-modelu-llm

https://vskp.vse.cz/95011#:~:text=Tato%20diplomov%C3%A1%20pr%C3%A1ce%20se%20zab%C3%BDv%C3%A1,Pr%C3%A1ce%20rovn%C4%9B%C5%BE%20zd%C5%AFraz%C5%88uje%20v%C3%BDznam%20EA


# DISKUZE

ta architektura asi nepujde udelat automatizovane, tak mozna rozsah na jeden nebo par modulu ?

publikace romania elections, pavel durov and france ? opensource ?

