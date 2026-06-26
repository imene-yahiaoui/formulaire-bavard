import React, { useMemo, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const h = React.createElement;

const developerUrl = "https://www.imeneyahiaoui.com/";

const tips = [
  "Un bon formulaire ne demande pas plus que nécessaire.",
  "Une donnée inutile collectée est une responsabilité en plus.",
  "La transparence crée plus de confiance que la surprise.",
  "La rapidité d’un formulaire ne suffit pas : il doit aussi être juste.",
  "Avant de demander une information, il faut savoir pourquoi on la demande."
];

// Démo Autofill : ces champs existent dans le formulaire pour montrer ce que
// le navigateur peut parfois compléter automatiquement. Ils ne sont jamais
// envoyés, jamais stockés, jamais transmis à un backend.
// Ils sont hors écran pour reproduire la mise en scène :
// “l’utilisateur a seulement vu prénom + nom”.
const autofillFields = [
  { label: "Email", name: "email", type: "email", autoComplete: "email", icon: "✉️" },
  { label: "Téléphone", name: "tel", type: "tel", autoComplete: "tel", icon: "📞" },
  { label: "Entreprise / organisation", name: "organization", type: "text", autoComplete: "organization", icon: "🏢" },
  { label: "Adresse", name: "street-address", type: "text", autoComplete: "street-address", icon: "📍" },
  { label: "Code postal", name: "postal-code", type: "text", autoComplete: "postal-code", icon: "📮" },
  { label: "Ville", name: "address-level2", type: "text", autoComplete: "address-level2", icon: "🏙️" },
  { label: "Pays", name: "country-name", type: "text", autoComplete: "country-name", icon: "🌍" }
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

function getDoNotTrackStatus() {
  const value = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;

  if (value === "1" || value === "yes") return "Activé";
  if (value === "0" || value === "no") return "Désactivé";

  return "Non disponible";
}

function detectBrowserFromUserAgent(userAgent) {
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg/")) return "Microsoft Edge";
  if (ua.includes("firefox/")) return "Mozilla Firefox";
  if (ua.includes("samsungbrowser/")) return "Samsung Internet";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome/") && !ua.includes("edg/")) return "Google Chrome ou Chromium";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";

  return "Navigateur non identifié précisément";
}

function collectVisibleBrowserInfo() {
  const userAgent = navigator.userAgent;

  return [
    { label: "Langue du navigateur", value: safeValue(navigator.language), icon: "🗣️" },
    { label: "Navigateur détecté", value: detectBrowserFromUserAgent(userAgent), icon: "🧭" },
    { label: "User agent", value: safeValue(userAgent), icon: "🪪" },
    { label: "Plateforme", value: safeValue(navigator.platform), icon: "💻" },
    { label: "Taille de l’écran", value: `${window.screen.width} × ${window.screen.height}px`, icon: "🖥️" },
    { label: "Taille de la fenêtre", value: `${window.innerWidth} × ${window.innerHeight}px`, icon: "📐" },
    { label: "Fuseau horaire", value: safeValue(Intl.DateTimeFormat().resolvedOptions().timeZone), icon: "🕒" },
    { label: "URL actuelle", value: safeValue(window.location.href), icon: "🔗" },
    { label: "Page précédente", value: safeValue(document.referrer, "Non disponible ou accès direct"), icon: "↩️" },
    { label: "Statut réseau", value: navigator.onLine ? "En ligne" : "Hors ligne", icon: "📶" },
    { label: "Cookies activés", value: navigator.cookieEnabled ? "Oui" : "Non", icon: "🍪" },
    { label: "Do Not Track", value: getDoNotTrackStatus(), icon: "🚫" }
  ];
}

function collectAutofillInfo(form) {
  const filledRows = autofillFields
    .map((field) => ({
      label: field.label,
      value: getFormValue(form, field.name),
      icon: field.icon
    }))
    .filter((row) => row.value !== "");

  if (filledRows.length === 0) {
    return [
      {
        label: "Autofill extra",
        value: "Aucune donnée supplémentaire remplie par le navigateur sur ce test.",
        icon: "😇"
      }
    ];
  }

  return filledRows;
}

function getVerdict(count) {
  if (count === 0) {
    return {
      tone: "calm",
      emoji: "😇",
      title: "Aujourd’hui, le navigateur a gardé ses secrets.",
      text: "Aucune info Autofill en plus n’a été détectée. L’inspecteur Data range sa loupe… pour l’instant."
    };
  }

  if (count <= 2) {
    return {
      tone: "medium",
      emoji: "🧐",
      title: "Petit bonus dans la poche du formulaire.",
      text: `Le navigateur a ajouté ${count} information${count > 1 ? "s" : ""} en plus. Pas de panique : ici, ça reste local et affiché pour la démo.`
    };
  }

  return {
    tone: "spicy",
    emoji: "🚨",
    title: "Plot twist : le formulaire avait des poches !",
    text: `Tu voyais 2 champs, mais le navigateur en a rempli ${count} de plus. Le formulaire n’a rien envoyé, mais il a beaucoup observé.`
  };
}

function Mascot() {
  return h(
    "div",
    { className: "mascot", "aria-hidden": "true" },
    h("div", { className: "mascot-bubble" }, "Inspecteur data"),
    h("div", { className: "mascot-hat" }),
    h("div", { className: "mascot-body" }),
    h("div", { className: "mascot-eye left" }),
    h("div", { className: "mascot-eye right" }),
    h("div", { className: "mascot-smile" }),
    h("div", { className: "magnifier" })
  );
}

function Confetti() {
  return h(
    "div",
    { className: "confetti", "aria-hidden": "true" },
    Array.from({ length: 14 }).map((_, index) => h("span", { key: index }))
  );
}

function DataRows({ rows, playful = false }) {
  return h(
    "dl",
    { className: playful ? "data-list playful-list" : "data-list" },
    rows.map((row) => {
      const isEmpty = row.value.includes("Non disponible") || row.value.includes("Aucune donnée");

      return h(
        "div",
        { className: isEmpty ? "data-row is-empty" : "data-row has-value", key: row.label },
        h("dt", null, h("span", { className: "row-icon", "aria-hidden": "true" }, row.icon || "•"), row.label),
        h("dd", { className: isEmpty ? "empty-value" : undefined }, row.value)
      );
    })
  );
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

function StatCard({ value, label, tone }) {
  return h(
    "div",
    { className: `stat-card ${tone || ""}` },
    h("strong", null, value),
    h("span", null, label)
  );
}

function VerdictCard({ count }) {
  const verdict = getVerdict(count);

  return h(
    "div",
    { className: `verdict-card ${verdict.tone}` },
    h("div", { className: "verdict-emoji", "aria-hidden": "true" }, verdict.emoji),
    h(
      "div",
      null,
      h("span", { className: "verdict-kicker" }, "Verdict de l’inspecteur"),
      h("h3", null, verdict.title),
      h("p", null, verdict.text)
    )
  );
}

function MiniComic() {
  const steps = [
    { icon: "👀", title: "À l’écran", text: "Tu vois 2 champs." },
    { icon: "🪄", title: "Autofill", text: "Le navigateur peut compléter." },
    { icon: "🕵️", title: "Résultat", text: "La page lit ce qui est écrit." }
  ];

  return h(
    "div",
    { className: "mini-comic", "aria-label": "Résumé de la démonstration" },
    steps.map((step) =>
      h(
        "div",
        { className: "comic-bubble", key: step.title },
        h("span", { "aria-hidden": "true" }, step.icon),
        h("strong", null, step.title),
        h("p", null, step.text)
      )
    )
  );
}

function DeveloperFooter() {
  return h(
    "footer",
    { className: "site-footer" },
    h("span", null, "Créé avec humour et pédagogie par 💜 "),
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
    const filledAutofillCount = autofillRows.filter((row) => !row.value.includes("Aucune donnée")).length;

    const snapshot = {
      typed: [
        { label: "Prénom", value: safeValue(getFormValue(form, "given-name"), "Non renseigné"), icon: "👤" },
        { label: "Nom", value: safeValue(getFormValue(form, "family-name"), "Non renseigné"), icon: "🪪" }
      ],
      autofill: autofillRows,
      technical: collectVisibleBrowserInfo(),
      filledAutofillCount
    };

    setResult(snapshot);

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
      { className: "app-shell" },
      h(
        "section",
        { className: "hero-grid", "aria-labelledby": "main-title" },
        h(
          "div",
          { className: "hero-panel glass-card" },
          h(
            "div",
            { className: "badge" },
            h("span", { className: "badge-dot", "aria-hidden": "true" }),
            "Démo locale · zéro stockage · zéro tracking"
          ),
          h(
            "h1",
            { id: "main-title", className: "hero-title" },
            h("span", null, "Un simple formulaire"),
            h("span", null, "peut déjà en dire beaucoup.")
          ),
          h(
            "p",
            { className: "hero-subtitle" },
            "Cette démo demande seulement votre prénom et votre nom. Au clic, elle montre aussi les informations techniques que votre navigateur rend visibles à une page web."
          ),
          h(
            "div",
            { className: "privacy-note", role: "note", "aria-label": "Message de confidentialité" },
            h("div", { className: "note-icon", "aria-hidden": "true" }, "🔒"),
            h(
              "p",
              { className: "m-0" },
              h("strong", null, "Cette démo n’envoie rien et ne stocke rien."),
              h("br"),
              "Elle affiche uniquement ce que cette page peut voir localement."
            )
          ),
          h(
            "div",
            { className: "impact-note" },
            h("span", { "aria-hidden": "true" }, "🎭"),
            h(
              "p",
              null,
              "Mise en scène : l’écran montre deux champs. Le résultat révèle aussi ce que le remplissage automatique du navigateur a éventuellement ajouté au formulaire."
            )
          )
        ),
        h(
          "aside",
          { className: "form-panel glass-card", "aria-label": "Formulaire de démonstration" },
          h(
            "div",
            null,
            h("div", { className: "mascot-wrap" }, h(Mascot)),
            h("h2", { className: "form-title" }, "Petit formulaire, grande discussion."),
            h(
              "p",
              { className: "form-copy" },
              "Deux champs visibles. Une suggestion Autofill. Et parfois… le navigateur complète plus que prévu."
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
                  placeholder: "Ex : Sofia"
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
                  placeholder: "Ex : Martin"
                })
              ),
              h(GhostAutofillFields),
              h(
                "div",
                { className: "button-row" },
                h(
                  "button",
                  { className: "submit-button", type: "submit" },
                  h("span", null, "Voir ce que la page peut lire"),
                  h("span", { "aria-hidden": "true" }, "→")
                ),
                h(
                  "button",
                  { className: "reset-button", type: "button", onClick: handleReset },
                  h("span", { "aria-hidden": "true" }, "↺"),
                  "Réinitialiser"
                )
              ),
              h(
                "p",
                { className: "autofill-helper" },
                "Astuce : clique dans Prénom ou Nom, choisis une suggestion du navigateur, puis regarde le rapport d’enquête."
              )
            )
          ),
          h(
            "ul",
            { className: "micro-list", "aria-label": "Garanties de la démo" },
            h("li", null, "Aucun serveur appelé au clic."),
            h("li", null, "Aucun cookie créé."),
            h("li", null, "Aucun localStorage, sessionStorage ou IndexedDB.")
          )
        )
      ),
      result &&
        h(
          "section",
          {
            ref: resultRef,
            className: "result-section glass-card",
            "aria-live": "polite",
            "aria-labelledby": "result-title"
          },
          h(Confetti),
          h(
            "div",
            { className: "case-label" },
            h("span", null, "Rapport d’enquête local"),
            h("strong", null, "Autofill sous observation")
          ),
          h(
            "div",
            { className: "result-header" },
            h(
              "div",
              null,
              h("h2", { id: "result-title", className: "result-title" }, "Ce que cette page voit vraiment"),
              h(
                "p",
                { className: "result-joke" },
                "Votre navigateur a parlé… mais promis, il n’a rien envoyé. L’inspecteur Data a juste pris des notes sur place."
              )
            ),
            h(
              "div",
              { className: "result-actions" },
              h(
                "div",
                { className: "pill", "aria-label": "Démo locale confirmée" },
                h("span", { "aria-hidden": "true" }, "✅"),
                "100% affichage local"
              ),
              h(
                "button",
                { className: "reset-button mini", type: "button", onClick: handleReset },
                h("span", { "aria-hidden": "true" }, "↺"),
                "Recommencer"
              )
            )
          ),
          h(MiniComic),
          h(
            "div",
            { className: "result-stats", "aria-label": "Résumé du résultat" },
            h(StatCard, { value: "2", label: "champs visibles", tone: "blue" }),
            h(StatCard, { value: result.filledAutofillCount, label: "infos Autofill détectées", tone: "yellow" }),
            h(StatCard, { value: "0", label: "requête envoyée au clic", tone: "green" })
          ),
          h(VerdictCard, { count: result.filledAutofillCount }),
          h(
            "div",
            { className: "warning-card" },
            h("strong", null, "Le twist pédagogique : "),
            "la personne pense souvent avoir rempli seulement prénom + nom. Mais si le navigateur ajoute d’autres valeurs dans le formulaire, la page peut les lire. Ici, rien ne sort du navigateur : c’est juste affiché pour comprendre."
          ),
          h(
            "div",
            { className: "result-grid result-grid-three" },
            h(
              "article",
              { className: "data-card visible-card" },
              h("div", { className: "card-sticker" }, "ce que tu as vu"),
              h("h3", null, "Informations visibles saisies"),
              h(DataRows, { rows: result.typed })
            ),
            h(
              "article",
              { className: "data-card highlight-card" },
              h("div", { className: "card-sticker surprise" }, "plot twist"),
              h("div", { className: "evidence-tape" }, "Données entrées par la petite porte"),
              h("h3", null, "Informations ajoutées par Autofill"),
              h("p", { className: "card-intro" }, "Champs surveillés pour la démo : ", hiddenAutofillLabels, "."),
              h(DataRows, { rows: result.autofill, playful: true })
            ),
            h(
              "article",
              { className: "data-card tech-card" },
              h("div", { className: "card-sticker" }, "fiche technique"),
              h("h3", null, "Informations techniques visibles"),
              h(DataRows, { rows: result.technical })
            )
          ),
          h(
            "section",
            { className: "tips-section", "aria-labelledby": "tips-title" },
            h("h3", { id: "tips-title" }, "Conseils pour créer des formulaires plus justes"),
            h(
              "ul",
              { className: "tips-grid" },
              tips.map((tip, index) =>
                h(
                  "li",
                  { className: "tip-card", key: tip },
                  h("span", { className: "tip-number", "aria-hidden": "true" }, index + 1),
                  tip
                )
              )
            )
          ),
          h(
            "p",
            { className: "footer-note" },
            "Côté code, le bouton ne lance aucun ",
            h("code", null, "fetch"),
            ", aucune requête API, aucun analytics et aucun stockage navigateur. Les données sont seulement gardées en mémoire React le temps de l’affichage."
          )
        )
    ),
    h(DeveloperFooter)
  );
}

createRoot(document.getElementById("root")).render(h(App));
