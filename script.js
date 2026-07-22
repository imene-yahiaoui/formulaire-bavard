import React, { useMemo, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const h = React.createElement;

const developerUrl = "https://www.imeneyahiaoui.com/";

const autofillFields = [
  { label: "Email", name: "email", type: "email", autoComplete: "email" },
  { label: "Téléphone", name: "tel", type: "tel", autoComplete: "tel" },
  { label: "Entreprise", name: "organization", type: "text", autoComplete: "organization" },
  { label: "Adresse", name: "street-address", type: "text", autoComplete: "street-address" },
  { label: "Code postal", name: "postal-code", type: "text", autoComplete: "postal-code" },
  { label: "Ville", name: "address-level2", type: "text", autoComplete: "address-level2" },
  { label: "Pays", name: "country-name", type: "text", autoComplete: "country-name" }
];

const tips = [
  "Demande seulement les infos vraiment utiles.",
  "Explique pourquoi tu demandes une information.",
  "Rends les champs facultatifs très clairs.",
  "Laisse la personne vérifier avant d'envoyer.",
  "Ne cache pas de champs qui peuvent être remplis automatiquement."
];

function safeValue(value, fallback = "Non disponible") {
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }

  return String(value).trim();
}

function getFormValue(form, name) {
  const element = form?.elements?.[name];
  return safeValue(element?.value, "");
}

function detectBrowserFromUserAgent(userAgent) {
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg/")) return "Microsoft Edge";
  if (ua.includes("firefox/")) return "Firefox";
  if (ua.includes("samsungbrowser/")) return "Samsung Internet";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome/") && !ua.includes("edg/")) return "Chrome ou Chromium";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";

  return "Navigateur non reconnu";
}

function collectBrowserInfo() {
  const userAgent = navigator.userAgent;

  return [
    { label: "Langue", value: safeValue(navigator.language), helper: "La langue choisie dans ton navigateur." },
    { label: "Navigateur", value: detectBrowserFromUserAgent(userAgent), helper: "La famille du navigateur utilisé." },
    { label: "Appareil", value: safeValue(navigator.platform), helper: "Une indication générale sur l'appareil." },
    { label: "Écran", value: `${window.screen.width} x ${window.screen.height}px`, helper: "La taille de l'écran." },
    { label: "Fenetre", value: `${window.innerWidth} x ${window.innerHeight}px`, helper: "La taille de cette page ouverte." },
    {
      label: "Fuseau horaire",
      value: safeValue(Intl.DateTimeFormat().resolvedOptions().timeZone),
      helper: "La zone horaire configurée."
    },
    {
      label: "Page précédente",
      value: safeValue(document.referrer, "Accès direct ou non disponible"),
      helper: "Parfois, une page sait d'où tu viens."
    },
    { label: "Connexion", value: navigator.onLine ? "En ligne" : "Hors ligne", helper: "État réseau visible." }
  ];
}

function collectAutofillInfo(form) {
  const filledRows = autofillFields
    .map((field) => ({
      label: field.label,
      value: getFormValue(form, field.name)
    }))
    .filter((row) => row.value !== "");

  if (filledRows.length === 0) {
    return [
      {
        label: "Aucune info en plus",
        value: "Sur cet essai, le navigateur n'a pas ajouté d'autre information."
      }
    ];
  }

  return filledRows;
}

function getMessage(count) {
  if (count === 0) {
    return {
      tone: "quiet",
      title: "Rien d'autre n'a été ajouté cette fois.",
      text: "Le navigateur n'a pas rempli les champs cachés de cette démo. Tu peux refaire le test avec une suggestion de remplissage automatique."
    };
  }

  if (count === 1) {
    return {
      tone: "notice",
      title: "Une information en plus est apparue.",
      text: "Tu voyais seulement deux cases, mais la page peut lire une information ajoutée par le navigateur."
    };
  }

  return {
    tone: "alert",
    title: `${count} informations en plus sont apparues.`,
    text: "C'est le point important : un formulaire peut recevoir plus d'infos que ce que la personne pense avoir donné."
  };
}

function GhostAutofillFields() {
  return h(
    "div",
    {
      className: "autofill-ghost-fields",
      "aria-hidden": "true"
    },
    autofillFields.map((field) =>
      h(
        "label",
        { key: field.name },
        field.label,
        h("input", {
          name: field.name,
          type: field.type,
          autoComplete: field.autoComplete,
          tabIndex: -1
        })
      )
    )
  );
}

function InfoRows({ rows, simple = false }) {
  return h(
    "dl",
    { className: simple ? "info-list simple" : "info-list" },
    rows.map((row) =>
      h(
        "div",
        { className: "info-row", key: row.label },
        h("dt", null, row.label),
        h(
          "dd",
          null,
          h("strong", null, row.value),
          row.helper ? h("span", null, row.helper) : null
        )
      )
    )
  );
}

function StepList() {
  const steps = [
    {
      number: "1",
      title: "Tu vois deux cases",
      text: "La page te demande seulement ton prénom et ton nom."
    },
    {
      number: "2",
      title: "Le navigateur aide",
      text: "Avec Autofill, il peut proposer email, téléphone ou adresse."
    },
    {
      number: "3",
      title: "La page peut lire",
      text: "Si ces infos sont ajoutées au formulaire, la page peut les voir."
    }
  ];

  return h(
    "ol",
    { className: "step-list", "aria-label": "Comment fonctionne la demo" },
    steps.map((step) =>
      h(
        "li",
        { key: step.number },
        h("span", null, step.number),
        h("div", null, h("strong", null, step.title), h("p", null, step.text))
      )
    )
  );
}

function ResultBanner({ count }) {
  const message = getMessage(count);

  return h(
    "div",
    { className: `result-banner ${message.tone}` },
    h("p", null, "Résultat de la démo"),
    h("h2", null, message.title),
    h("span", null, message.text)
  );
}

function App() {
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const formRef = useRef(null);

  const hiddenAutofillLabels = useMemo(
    () => autofillFields.map((field) => field.label.toLowerCase()).join(", "),
    []
  );

  function handleSubmit(event) {
    event.preventDefault();

    const form = formRef.current;
    const autofillRows = collectAutofillInfo(form);
    const filledAutofillCount = autofillRows.filter((row) => row.label !== "Aucune info en plus").length;

    setResult({
      typed: [
        { label: "Prénom", value: safeValue(getFormValue(form, "given-name"), "Non renseigné") },
        { label: "Nom", value: safeValue(getFormValue(form, "family-name"), "Non renseigné") }
      ],
      autofill: autofillRows,
      technical: collectBrowserInfo(),
      filledAutofillCount
    });

    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleReset() {
    formRef.current?.reset();
    setResult(null);

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      formRef.current?.querySelector("input")?.focus({ preventScroll: true });
    });
  }

  return h(
    React.Fragment,
    null,
    h(
      "main",
      { className: "page-shell" },
      h(
        "section",
        { className: "intro", "aria-labelledby": "main-title" },
        h(
          "div",
          { className: "intro-copy" },
          h("p", { className: "eyebrow" }, "Démo vie privée"),
          h("h1", { id: "main-title" }, "Un formulaire peut lire plus que ce que tu vois."),
          h(
            "p",
            { className: "lead" },
            "Ici, tu remplis seulement deux cases. Mais le remplissage automatique du navigateur peut ajouter d'autres infos dans le formulaire."
          ),
          h(
            "div",
            { className: "plain-note", role: "note" },
            h("strong", null, "Important : rien n'est envoyé."),
            h("span", null, "Cette page montre seulement ce qui est visible dans ton navigateur, pour comprendre le risque.")
          ),
          h(StepList)
        ),
        h(
          "aside",
          { className: "demo-card", "aria-label": "Formulaire de test" },
          h("div", { className: "card-label" }, "Test rapide"),
          h("h2", null, "Remplis comme sur un vrai site"),
          h(
            "p",
            null,
            "Clique dans une case. Si ton navigateur propose une fiche automatique, choisis-la, puis regarde le résultat."
          ),
          h(
            "form",
            { ref: formRef, className: "demo-form", onSubmit: handleSubmit, autoComplete: "on" },
            h(
              "div",
              { className: "field-group" },
              h("label", { htmlFor: "given-name" }, "Prénom"),
              h("input", {
                id: "given-name",
                name: "given-name",
                type: "text",
                autoComplete: "given-name",
                placeholder: "Exemple : Sofia"
              })
            ),
            h(
              "div",
              { className: "field-group" },
              h("label", { htmlFor: "family-name" }, "Nom"),
              h("input", {
                id: "family-name",
                name: "family-name",
                type: "text",
                autoComplete: "family-name",
                placeholder: "Exemple : Martin"
              })
            ),
            h(GhostAutofillFields),
            h(
              "div",
              { className: "button-row" },
              h("button", { className: "primary-button", type: "submit" }, "Voir ce que la page lit", h("span", null, "->")),
              h("button", { className: "secondary-button", type: "button", onClick: handleReset }, "Recommencer")
            )
          ),
          h(
            "ul",
            { className: "trust-list", "aria-label": "Garanties de la demo" },
            h("li", null, "Aucun serveur contacté."),
            h("li", null, "Aucun cookie créé."),
            h("li", null, "Aucun stockage dans ton navigateur.")
          )
        )
      ),
      result &&
        h(
          "section",
          {
            ref: resultRef,
            className: "results",
            "aria-live": "polite",
            "aria-labelledby": "result-title"
          },
          h(ResultBanner, { count: result.filledAutofillCount }),
          h(
            "div",
            { className: "summary-strip", "aria-label": "Resume du test" },
            h("div", null, h("strong", null, "2"), h("span", null, "cases visibles")),
            h("div", null, h("strong", null, result.filledAutofillCount), h("span", null, "infos ajoutées")),
            h("div", null, h("strong", null, "0"), h("span", null, "envoi serveur"))
          ),
          h(
            "div",
            { className: "explain-box" },
            h("h3", null, "A retenir"),
            h(
              "p",
              null,
              "Si un navigateur remplit un formulaire tout seul, il peut mettre des informations dans des champs que tu ne regardes pas vraiment. Avant d'envoyer un formulaire, il vaut mieux vérifier ce qui est demandé."
            )
          ),
          h(
            "div",
            { className: "result-grid" },
            h(
              "article",
              { className: "result-card saw" },
              h("p", { className: "card-label" }, "Ce que tu as vu"),
              h("h3", null, "Les infos tapées"),
              h(InfoRows, { rows: result.typed, simple: true })
            ),
            h(
              "article",
              { className: "result-card extra" },
              h("p", { className: "card-label" }, "Ce qui peut se cacher"),
              h("h3", null, "Infos ajoutées par Autofill"),
              h("p", { className: "small-copy" }, "Champs testés : ", hiddenAutofillLabels, "."),
              h(InfoRows, { rows: result.autofill, simple: true })
            ),
            h(
              "article",
              { className: "result-card browser" },
              h("p", { className: "card-label" }, "Infos du navigateur"),
              h("h3", null, "Ce qu'une page peut déjà connaître"),
              h(InfoRows, { rows: result.technical })
            )
          ),
          h(
            "section",
            { className: "tips", "aria-labelledby": "tips-title" },
            h("h3", { id: "tips-title" }, "Pour faire des formulaires plus respectueux"),
            h(
              "ul",
              null,
              tips.map((tip) => h("li", { key: tip }, tip))
            )
          ),
          h(
            "div",
            { className: "bottom-actions" },
            h("button", { className: "secondary-button", type: "button", onClick: handleReset }, "Refaire le test")
          )
        )
    ),
    h(
      "footer",
      { className: "site-footer" },
      h("span", null, "Démo créée par "),
      h(
        "a",
        {
          href: developerUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": "Voir le site de Imene Yahiaoui"
        },
        "Imene Yahiaoui"
      )
    )
  );
}

createRoot(document.getElementById("root")).render(h(App));
