\# GB Medical – Időpontfoglaló



\## Projekt bemutatása

A GB Medical egy modern, felhasználóbarát webalkalmazás, amely lehetővé teszi a betegek számára, hogy online időpontot foglaljanak orvosi rendelőkbe, értékeléseket adjanak az orvosokra, és emailben visszaigazolást kapjanak a foglalásról.



A projekt célja valós problémára adni megoldást az egészségügyi szolgáltatásokban, kihasználva modern technológiákat és fejlesztési módszereket.



\## Használt technológiák

\- Frontend: Angular

\- Backend: Java (NetBeans 19), Wildfly szerver

\- Adatbázis: MySQL (phpMyAdmin kezelés)

\- Verziókövetés és együttműködés: GitHub, Jira



\## Fő funkciók
\- Szolgáltatás vagy orvos választása a foglalás előtt

\- Időpontfoglalás szabad időpontokra, bejelentkezett felhasználóknak

\- Foglalás visszaigazolása emailben

\- Lefoglalt időpontok megtekintése és lemondása

\- Orvosok értékelése csillagokkal és szöveges visszajelzésekkel

\- Keresőmező az orvosok szűrésére

\- Regisztráció és emailes aktiválás

\- Jelszó helyreállítás emailes linkkel

\- Oldal tetejére visszatérő gomb



## Telepítők és WildFly szerver letöltése

A projekthez tartozó nagyobb fájlok (telepítők és előre konfigurált WildFly szerver) a GitHub tárhely korlátozásai miatt nem találhatók meg itt.

Ezeket a fájlokat a következő Google Drive mappában érheted el:

📁 **[Letöltés: WildFly és telepítők (1,6 GB+)](https://drive.google.com/drive/folders/1hnuqlUmwaykHdEW0907J18hNS5yiGoeX?usp=sharing)**

---

## Tartalom

- `installers.zip` – szükséges telepítők (1,61 GB)
- `wildfly-preview-26.1.1.Final.zip` – előre konfigurált WildFly szerver (221 MB)

---

1\. Klónozd a repót:

&nbsp;  ```bash

&nbsp;  git clone https://github.com/SzGeri25/vizsgaremek-bogdan-szabo.git



2\. Backend:



* Importáld a projektet NetBeans 19-be
* Állítsd be a Wildfly szervert, indítsd el
* Állítsd be a MySQL adatbázist a docs/sql mappában található scriptek segítségével



3\. Frontend:



* Navigálj a frontend mappába
* Futtasd az npm install parancsot a függőségek telepítéséhez
* Indítsd el az Angular szervert az ng serve parancssal

ℹ️ Részletes dokumentáció a **docs** mappában található "Szabó\_Gergely\_portfólió\_kész.pdf" néven.

