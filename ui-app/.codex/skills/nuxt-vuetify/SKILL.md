---
name: nuxt-vuetify
description: Usa questa skill quando sviluppi o modifichi pagine, componenti e layout Nuxt con Vuetify nel progetto INDIRE.
---

# Sviluppatore di webapp Nuxt

Agisci come sviluppatore esperto di Nuxt, Vue e TypeScript.
Realizza funzionalità complete, accessibili e coerenti con il progetto.

## Analisi iniziale

- Leggi le istruzioni del repository e il package.json.
- Identifica versione di Nuxt, struttura, moduli e package manager.
- Riutilizza componenti, convenzioni e dipendenze esistenti.
- Nei nuovi progetti usa la versione stabile corrente di Nuxt,
  TypeScript e il package manager indicato dall’utente.
- Chiedi chiarimenti solo quando una decisione essenziale non può
  essere dedotta. Per il resto, procedi dichiarando le ipotesi rilevanti.


## Implementazione

- Usa Vue Composition API e `<script setup lang="ts">`.
- Usa Nuxt 4 con la struttura `app/`.
- Mantieni `app/app.vue` minimale.
- Rispetta la struttura prevista dalla versione di Nuxt installata.
- Mantieni i componenti focalizzati e riutilizzabili.
- Estrai logica condivisa in composables.
- Usa useState per stato condiviso semplice; adotta Pinia quando
  già presente o giustificato dalla complessità.
- Evita dipendenze superflue e astrazioni premature.

## Dati e rendering

- Usa componenti Vuetify per la struttura dell'interfaccia.
- Scegli SSR, prerendering o rendering client in base alla funzionalità.
- Usa useFetch o useAsyncData per dati iniziali compatibili con SSR.
- Usa $fetch per operazioni imperative e azioni dell’utente.
- Gestisci caricamento, risultati vuoti, errori e nuovi tentativi.
- Evita richieste duplicate e differenze tra HTML server e client.
- Usa Pinia per lo stato applicativo.
- Mantieni i modelli Mongoose esclusivamente sotto `server/models/`.
- Usa gli endpoint Nuxt server-side per comunicare con MongoDB.
- Non importare mai Mongoose nei componenti client.
- Esegui `npm run build` dopo modifiche importanti.


## Backend e sicurezza

- Implementa endpoint tramite le convenzioni Nitro/H3 del progetto.
- Valida sul server parametri, payload e autorizzazioni.
- Mantieni segreti nel runtimeConfig privato.
- Inserisci nella configurazione pubblica solo valori pubblicabili.
- Non fidarti dei controlli di accesso eseguiti soltanto nel frontend.
- Non registrare password, token o altri dati sensibili.
- Non inventare integrazioni funzionanti: segnala credenziali o
  servizi mancanti e documenta come configurarli.

## Interfaccia

- Crea layout responsive con HTML semantico.
- Riutilizza il design system e gli strumenti CSS del progetto.
- Gestisci gli stati di invio dei form e impedisci invii duplicati.
- Configura metadati SEO quando pertinenti.
- Usa NuxtLink per la navigazione interna.
- Usa Material Design Icons tramite Vuetify.
- Inserisci gli stili globali in `app/assets/scss/`.
- Usa le variabili centralizzate in `_variables.scss`.


## Verifica

- Esegui i controlli disponibili pertinenti: lint, typecheck e build.

- Non dichiarare eseguiti controlli che non hai effettuato.
- Non pubblicare o modificare infrastrutture senza autorizzazione.

## Consegna

Descrivi brevemente:
- cosa è stato realizzato;
- come avviarlo e verificarlo;
- quali controlli sono stati eseguiti;
- eventuali configurazioni mancanti o limiti.


## Vuetify

- Usa Vuetify per componenti interattivi e strutturati:
  form, dialog, menu, tabelle, navigazione e notifiche.
- Integra Vuetify con Nuxt tramite una soluzione compatibile
  con le versioni installate e con il rendering SSR.
- Configura tema, colori, tipografia, icone e valori predefiniti
  in modo centralizzato.
- Preferisci proprietà, slot e API pubbliche dei componenti.
- Evita modifiche fragili ai selettori interni di Vuetify.
- Preserva accessibilità, gestione del focus e navigazione
  da tastiera quando personalizzi i componenti.

## Tailwind CSS

- Usa Tailwind per layout, spaziature, responsive design
  e personalizzazioni visive.
- Segui la configurazione prevista dalla versione installata:
  non mescolare configurazioni di versioni principali diverse.
- Usa classi complete e rilevabili dal compilatore;
  evita nomi di classe costruiti tramite concatenazioni dinamiche.
- Definisci valori ricorrenti come token condivisi.
- Mantieni leggibili i template ed estrai componenti
  quando una struttura viene ripetuta.

## Convivenza tra Vuetify e Tailwind

- Usa Vuetify come base dei componenti UI e Tailwind
  per la composizione del layout e gli adattamenti visivi.
- Per ogni proprietà scegli un solo responsabile:
  evita di impostare lo stesso stile tramite proprietà Vuetify,
  utility Vuetify e classi Tailwind contemporaneamente.
- Allinea colori, tipografia e modalità chiara/scura
  attraverso token condivisi o una mappatura centralizzata.
- Definisci consapevolmente ordine dei CSS e cascade layers,
  se supportati dalle versioni in uso.
- Verifica l’interazione tra Tailwind Preflight e gli stili
  Vuetify; se causa conflitti, limita o disabilita il reset
  con la modalità prevista dalla versione di Tailwind.
- Evita l’uso sistematico di !important.
- Mantieni coerenti i breakpoint quando combini utility
  responsive e logica responsive dei componenti.
- Controlla che le personalizzazioni non alterino focus,
  stati disabilitati, validazione o dimensioni dei controlli.

Porta il lavoro fino a un risultato utilizzabile, evitando di fermarti
a un piano quando puoi procedere con l’implementazione.




