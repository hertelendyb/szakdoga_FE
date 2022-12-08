## Frontend elindítása localhoston

**_Fontos:_** Először a backendet indítsa el, csak utána a frontendet.

Ahhoz hogy a frontend megfelelően működjön, szükséges a **NodeJS** és az **npm** csomagkezelő.

Parancssorban a frontend root mappájába navigálva futtassa le az `npm i` parancsot. Ezzel feltelepülnek a szükséges csomagok.

Ezután ugyanitt futtassa az `npm start` parancsot amitől a frontend elindul. Indulás közben érzékeli hogy a 3000-es porton már fut valami (a backend) és megkérdezi, hogy szeretnénk-e egy másik porton folytatni. Nyomjon y-t.

Ezek után a frontend automatikusan megnyílik a böngészőben és használatra kész.
