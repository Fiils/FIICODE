# Site-ul ROMDIG

URL: [`https://www.romdig.net`](https://www.romdig.net)

Nota: in realizarea acestui site nu a fost folosita nicio plata (in afara de achizitionarea URL-ului)

Deployment: Vercel

Creatori: 1 (Ipatov Ioan Alexandru)

Responsiveness: 100%

&nbsp;
&nbsp;

```Prima Pagina:``` aici se gasesc cateva informatii despre site si scopul acestuia

&nbsp;
&nbsp;

```Autentificare:``` aici utilizatorul isi poate accesa contul

&nbsp;
&nbsp;

```Parola uitata:``` aici utilizatorul isi poate schimba parola uitata, primind un email, redirectionand-ul catre un link ce ii va permite acest lucru

&nbsp;
&nbsp;

```Inregistrare:``` aici un locuitor isi poate crea un cont ROMDIG; acesta trebuie sa introduca localitatea (nu judet sau comuna) in care se afla (aici am folosit PlacesAPI de la Google Cloud Platform pentru ca toate orasele/satele/comunele/judetele din Romania sa fie disponibile din prima, deci indiferent de unde locuiesti, iti poti face cont); de asemenea, trebuie introdusa poza buletinului (pentru dovedirea identitatii), si inca un act ce dovedeste unde locuiesti (unele persoane nu locuiesc unde spune adresa de pe buletin); dupa ce se introduc toate datele, utilizatorul va primi un cod pe email ca sa se verifice ca email-ul introdus este valid
Nota: pana la acceptarea contului de catre un moderator, accesul utilizatorului pe site este limitat

&nbsp;
&nbsp;

```Postari:``` in aceasta sectiune pot fi vazute toate postarile (conform localizarii utilizatorului) in functie de 6 categorii diferite, 4 statusuri (pot fi selectate mai multe deodata) si in functie de nivelul postarilor (Toate, Judetene Comunale, Satesti/Orasesti)

&nbsp;
&nbsp;

```Vizualizarea unei postari:``` aici se gasesc toate informatiile despre postare (autor, data crearii, titlu, numar de vizionari etc.), ce poate fi votata pozitiv, negativ, adaugata la favorite sau raportata; totodata, aici este si sectiunea de comentarii, iar comentariile, la randul lor, pot fi apreciate pozitiv, negativ sau raportate

&nbsp;
&nbsp;

```Creaza o postare:``` aici se poate crea o postare (titlu, nivel, imagini, video, descriere), la descriere fiind un editor WYSIWYG, pentru a fi stilizat mai bine

&nbsp;
&nbsp;

```Contul meu:``` aceasta sectiune este impartita in 4 parti + buton de deconectare:
- ```Date Personale:``` aici sunt afisate cateva date despre contul curent, se poate schimba poza de profil, se poate schimba parola, in cazul in care cea veche inca se mai stie si aici se afla metoda de contactare
- ```Postari apreciate:``` aici sunt afisate postarile pe care utilizatorul le-a apreciat, in ordinea in care a facut acest lucru (de la cele mai noi la cele mai vechi); cand sunt prea multe, esti trimis cu un buton pe o alta pagina, unde le poti vizualiza pe toate
- ```Postarile mele:``` aici sunt afisate postarile pe care utilizatorul le-a creat, in ordinea in care a facut acest lucru (de la cele mai noi la cele mai vechi); cand sunt prea multe, esti trimis cu un buton pe o alta pagina, unde le poti vizualiza pe toate
- ```Postari favorite:``` aici sunt afisate postarile pe care utilizatorul le-a adaugat la favorite, in ordinea in care a facut acest lucru (de la cele mai noi la cele mai vechi); cand sunt prea multe, esti trimis cu un buton pe o alta pagina, unde le poti vizualiza pe toate

&nbsp;
&nbsp;

# Tehnologii folosite
1. Typescript
2. ReactJS
3. NextJS
4. SASS
5. Gulp
6. MUI