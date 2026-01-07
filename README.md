
# Lokaverkefni - Tix API

## Verkefnalýsing

RESTful API fyrir miðasölukerfi. Notandi getur skoðað viðburði, staði og keypt miða. 


## Tækni

- **Backend Framework**: Express.js með TypeScript
- **Gagnagrunnur**: PostgreSQL
- **Prófanir**: Vitest + Supertest


## Uppsetning
### 1. Klóna verkefnið 

```bash
git clone https://github.com/hardardottir93/Lokaverkefni.git
cd Lokaverkefni
```

### 2. Setja upp dependencies

```bash
npm install
```

---

## Database Setup (PostgreSQL)

Til að keyra verkefnið þarf tvo virka PostgreSQL gagnagrunna.


### 1. Búa til gagnagrunna

Keyrðu í terminal eða pgAdmin:

```sql
CREATE DATABASE tix;
CREATE DATABASE tix_test;
```

### 2. Setja upp `.env` skrá

Búðu til `.env` í rót verkefnis:

> Skiptu út `USER` og `PASS` fyrir þinn gagnagrunnsnotanda.

### 3. Setja upp gagnagrunna og gögn

Notaðu `schema.sql` sem skilgreinir töflur.
Bæta við gögnum í gagnagrunna með `seed.sql`
Gert t.d. í pgAdmin:

* Opna **Query Tool**
* Open File → Velja skrá
* Keyra

Gert fyrir bæði schema.sql og seed.sql 
Bæði í tix og tix_test

---

## Keyra verkefnið

```bash
npm run dev
```

Ef allt er uppsett rétt sérðu eitthvað á þessa leið:

```
Server running on http://localhost:3000
Connected to PostgreSQL database
```

Ef villur koma í ljós gæti verið að:

* `.env` sé ekki rétt stillt
* gagnagrunnurinn sé ekki keyrandi
* `schema.sql` hafi ekki verið keyrt

---

## Keyra prófanir

```bash
npm run test:coverage
```

Skilar prófunum og yfirliti yfir skrár sem eru prófaðar.

## API endapunktar

* Upplýsingar um API endapunkta má finna í skránni [API.md](API.md)