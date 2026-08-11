(function () {
  "use strict";

  var CMS = window.CMS;
  var h = window.h;
  var createClass = window.createClass;

  if (!CMS || !h || !createClass) return;

  function present(result, fallback) {
    return result === undefined || result === null || result === "" ? (fallback || "") : result;
  }

  function entryValue(entry, name, fallback) {
    return present(entry.getIn(["data", name]), fallback);
  }

  function field(widget, name, fallback) {
    return present(widget && widget.getIn(["data", name]), fallback);
  }

  function widgetFor(widget, name) {
    return widget && widget.getIn(["widgets", name]);
  }

  function arrayField(widget, name) {
    var result = widget && widget.getIn(["data", name]);
    if (!result) return [];
    return typeof result.toJS === "function" ? result.toJS() : result;
  }

  function entryArray(entry, name) {
    var result = entry.getIn(["data", name]);
    if (!result) return [];
    return typeof result.toJS === "function" ? result.toJS() : result;
  }

  function objectField(widget, name) {
    var result = widget && widget.getIn(["data", name]);
    if (!result) return null;
    return typeof result.toJS === "function" ? result.toJS() : result;
  }

  function assetUrl(getAsset, source, fallback) {
    if (!source) return fallback || "";
    var asset = getAsset(source);
    return asset && typeof asset.toString === "function" ? asset.toString() : asset;
  }

  function eyebrow(text) {
    return text ? h("p", { className: "br-eyebrow" }, text) : null;
  }

  function previewContext(path) {
    return h(
      "div",
      { className: "br-preview-context" },
      h("strong", {}, "Live page preview"),
      h("span", {}, path),
    );
  }

  function siteHeader() {
    return h(
      "header",
      { className: "br-site-header" },
      h("span", { className: "br-brand-mark" }, "BR"),
      h("span", { className: "br-brand" }, "Billy Ready ", h("em", {}, "Music")),
      h("span", { className: "br-nav" }, "Music  ·  Ministry  ·  About  ·  Invite Billy"),
    );
  }

  function siteFooter() {
    return h(
      "footer",
      { className: "br-site-footer" },
      h("strong", {}, "Billy Ready Music"),
      h("span", {}, "Music for the Journey Home."),
    );
  }

  function frame(path, children) {
    return h(
      "div",
      { className: "br-preview" },
      previewContext(path),
      siteHeader(),
      h("main", {}, children),
      siteFooter(),
    );
  }

  function actionLink(action, light) {
    if (!action || !action.label) return null;
    return h(
      "span",
      { className: light ? "br-action br-action--light" : "br-action" },
      action.label,
      " →",
    );
  }

  function themeClass(section) {
    return "br-builder br-theme-" + field(section, "theme", "cream");
  }

  function renderHero(hero, getAsset) {
    var style = field(hero, "style", "standard");
    var image = assetUrl(getAsset, field(hero, "image"), "/images/billy-ready-og.jpg");
    var eyebrowText = field(hero, "eyebrow");
    var title = field(hero, "title");
    var accent = field(hero, "accent");
    var subheading = field(hero, "subheading");
    var intro = field(hero, "intro");
    var primary = objectField(hero, "primaryAction");
    var secondary = objectField(hero, "secondaryAction");

    if (style === "home") {
      return h(
        "section",
        { className: "br-home-hero", style: { backgroundImage: 'url("' + image + '")' } },
        h("div", { className: "br-home-hero-shade" }),
        h(
          "div",
          { className: "br-home-hero-content" },
          eyebrow(eyebrowText),
          title || accent ? h("h1", {}, title, accent ? h("em", {}, accent) : null) : null,
          subheading ? h("h2", { className: "br-preserve-lines" }, subheading) : null,
          intro ? h("p", {}, intro) : null,
          h("div", { className: "br-actions" }, actionLink(primary, true), actionLink(secondary, true)),
        ),
      );
    }

    return h(
      "section",
      {
        className: "br-page-hero br-page-hero--builder " + (!eyebrowText ? "br-page-hero--centered " : "") + (style === "image" && field(hero, "image") ? "br-page-hero--image" : ""),
        style: style === "image" && field(hero, "image") ? { backgroundImage: 'linear-gradient(90deg, rgba(9,8,6,.9), rgba(9,8,6,.35)), url("' + image + '")' } : {},
      },
      eyebrow(eyebrowText),
      title || accent ? h("h1", {}, title, accent ? h("em", {}, " " + accent) : null) : null,
      intro ? h("p", { className: "br-hero-intro" }, intro) : null,
      h("div", { className: "br-actions" }, actionLink(primary, true), actionLink(secondary, true)),
    );
  }

  function renderSection(section, index, getAsset) {
    var type = field(section, "type");
    var heading = field(section, "heading");
    var body = widgetFor(section, "body");
    var action = objectField(section, "action");
    var theme = field(section, "theme", "cream");
    var light = theme === "dark";
    var baseProps = { className: themeClass(section) + " br-type-" + type, key: index };

    if (type === "richText") {
      return h(
        "section",
        baseProps,
        h(
          "div",
          { className: "br-builder-grid br-layout-" + field(section, "layout", "split") },
          h("div", {}, eyebrow(field(section, "eyebrow")), heading ? h("h2", {}, heading) : null),
          h(
            "div",
            { className: "br-body" },
            field(section, "lead") ? h("p", { className: "br-lead" }, field(section, "lead")) : null,
            body || null,
          ),
        ),
      );
    }

    if (type === "imageText") {
      var imageSource = assetUrl(getAsset, field(section, "image"));
      return h(
        "section",
        baseProps,
        h(
          "div",
          { className: "br-image-text br-image-" + field(section, "imagePosition", "left") },
          h(
            "figure",
            {},
            imageSource ? h("img", { src: imageSource, alt: field(section, "imageAlt") }) : h("div", { className: "br-image-placeholder" }, "Choose an image"),
            field(section, "imageCaption") ? h("figcaption", {}, field(section, "imageCaption")) : null,
          ),
          h(
            "div",
            { className: "br-body" },
            eyebrow(field(section, "eyebrow")),
            heading ? h("h2", {}, heading) : null,
            body || h("p", {}, field(section, "body")),
            actionLink(action, light),
          ),
        ),
      );
    }

    if (type === "quote") {
      var quote = field(section, "quote");
      return h(
        "section",
        baseProps,
        eyebrow(field(section, "eyebrow")),
        quote ? h("blockquote", {}, "“", quote, "”") : null,
        field(section, "attribution") ? h("p", { className: "br-attribution" }, field(section, "attribution")) : null,
      );
    }

    if (type === "gallery") {
      var images = arrayField(section, "images");
      return h(
        "section",
        baseProps,
        eyebrow(field(section, "eyebrow")),
        heading ? h("h2", {}, heading) : null,
        field(section, "intro") ? h("p", { className: "br-section-intro" }, field(section, "intro")) : null,
        h(
          "div",
          { className: "br-gallery br-gallery-" + field(section, "columns", "two") },
          images.length
            ? images.map(function (item, imageIndex) {
                return h(
                  "figure",
                  { key: imageIndex },
                  h("img", { src: assetUrl(getAsset, item.image), alt: item.alt || "" }),
                  item.caption ? h("figcaption", {}, item.caption) : null,
                );
              })
            : h("div", { className: "br-image-placeholder" }, "Add gallery images"),
        ),
      );
    }

    if (type === "songList") {
      return h(
        "section",
        baseProps,
        eyebrow(field(section, "eyebrow")),
        heading ? h("h2", {}, heading) : null,
        field(section, "intro") ? h("p", { className: "br-section-intro" }, field(section, "intro")) : null,
        h("div", { className: "br-placeholder-row" }, "01", h("strong", {}, "Songs are managed in the Songs collection")),
        h("div", { className: "br-placeholder-row" }, "02", h("strong", {}, "The published page shows real song titles and stories")),
        actionLink(action, light),
      );
    }

    if (type === "featureList") {
      var source = field(section, "source", "custom");
      var items = arrayField(section, "items");
      return h(
        "section",
        baseProps,
        h(
          "div",
          { className: "br-builder-grid" },
          h("div", {}, eyebrow(field(section, "eyebrow")), heading ? h("h2", {}, heading) : null, h("p", {}, field(section, "intro")), actionLink(action, light)),
          h(
            "ol",
            { className: "br-feature-list br-list-" + field(section, "style", "plain") },
            source === "custom"
              ? items.map(function (item, itemIndex) {
                  return h("li", { key: itemIndex }, field(section, "style") === "numbered" ? h("span", {}, String(itemIndex + 1).padStart(2, "0")) : null, item);
                })
              : h("li", { className: "br-admin-note" }, "This list uses the current items from Site settings."),
          ),
        ),
      );
    }

    if (type === "roles") {
      var roleImage = assetUrl(getAsset, field(section, "image"));
      return h(
        "section",
        baseProps,
        h(
          "div",
          { className: "br-builder-grid br-roles-grid" + (roleImage ? " br-roles-grid--with-image" : "") },
          h("div", {}, eyebrow(field(section, "eyebrow")), h("p", { className: "br-roles" }, arrayField(section, "roles").map(function (role, roleIndex) { return h("span", { key: roleIndex }, role); }))),
          roleImage ? h("figure", { className: "br-role-portrait" }, h("img", { src: roleImage, alt: field(section, "imageAlt") })) : null,
          h("div", { className: "br-body" }, body || h("p", {}, field(section, "body")), actionLink(action, light)),
        ),
      );
    }

    if (type === "statement") {
      return h("section", baseProps, eyebrow(field(section, "eyebrow")), heading ? h("h2", {}, heading) : null, h("div", { className: "br-statement" }, body || field(section, "body")));
    }

    if (type === "callToAction") {
      return h(
        "section",
        baseProps,
        h(
          "div",
          { className: "br-cta-grid" },
          h("div", {}, eyebrow(field(section, "eyebrow")), h("h2", {}, heading), h("p", {}, field(section, "body"))),
          h("div", { className: "br-actions" }, actionLink(objectField(section, "primaryAction"), light), actionLink(objectField(section, "secondaryAction"), light)),
        ),
      );
    }

    if (type === "newsletter") {
      return h(
        "section",
        baseProps,
        h(
          "div",
          { className: "br-builder-grid" },
          h("div", {}, eyebrow(field(section, "eyebrow")), h("h2", {}, heading), h("p", {}, field(section, "body"))),
          h("div", { className: "br-newsletter-mock" }, h("span", {}, "First name"), h("span", {}, "Email address"), h("strong", {}, "Stay connected")),
        ),
      );
    }

    if (type === "bookingForm") {
      return h(
        "section",
        baseProps,
        h(
          "div",
          { className: "br-builder-grid" },
          h("div", {}, eyebrow(field(section, "eyebrow")), h("h2", {}, heading), h("p", {}, field(section, "body")), h("p", { className: "br-admin-note" }, field(section, "contactNote"))),
          h(
            "div",
            { className: "br-form-preview" },
            h("small", { className: "br-form-group-label" }, h("b", {}, "01"), " Your contact details"),
            h("span", {}, "Your name *"),
            h("span", {}, "Church or organization · Optional"),
            h("span", {}, "Email address *"),
            h("span", {}, "Phone number *"),
            h("small", { className: "br-form-group-label" }, h("b", {}, "02"), " About the gathering"),
            h("span", {}, "Event type · Optional"),
            h("span", {}, "Tentative date · Optional"),
            h("span", { className: "br-form-wide br-form-message" }, "Tell us about your event *"),
            h("strong", {}, "Send booking request →"),
          ),
        ),
      );
    }

    if (type === "imageBanner") {
      var bannerImage = assetUrl(getAsset, field(section, "image"));
      return h(
        "section",
        {
          className: "br-image-banner br-banner-" + field(section, "height", "medium"),
          key: index,
          style: bannerImage ? { backgroundImage: 'linear-gradient(90deg, rgba(9,8,6,.86), rgba(9,8,6,.2)), url("' + bannerImage + '")' } : {},
        },
        eyebrow(field(section, "eyebrow")),
        heading ? h("h2", {}, heading) : null,
        field(section, "body") ? h("p", {}, field(section, "body")) : null,
        actionLink(action, true),
      );
    }

    return h("section", baseProps, h("p", { className: "br-admin-note" }, "Choose and configure a section type."));
  }

  function pagePreview(path) {
    return createClass({
      render: function () {
        var hero = this.props.widgetsFor("hero");
        var sections = this.props.widgetsFor("sections") || [];
        var getAsset = this.props.getAsset;
        return frame(path, [
          renderHero(hero, getAsset),
          sections.map(function (section, index) { return renderSection(section, index, getAsset); }),
        ]);
      },
    });
  }

  var SitePreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var socialLinks = entryArray(entry, "socialLinks");
      var email = entryValue(entry, "email");
      return frame("Site-wide settings", [
        h("section", { className: "br-page-hero" }, eyebrow("Site identity"), h("h1", {}, entryValue(entry, "name")), h("p", { className: "br-hero-intro" }, entryValue(entry, "tagline")), h("p", {}, entryValue(entry, "description"))),
        h("section", { className: "br-builder br-theme-paper" }, h("div", { className: "br-builder-grid" }, h("div", {}, eyebrow("Contact"), h("h2", {}, entryValue(entry, "phoneDisplay")), email ? h("p", {}, email) : null, h("p", {}, entryValue(entry, "location"))), h("div", {}, eyebrow("Social links"), socialLinks.length ? h("ul", { className: "br-simple-list" }, socialLinks.map(function (link, index) { return h("li", { key: index }, link.label, h("small", {}, link.href)); })) : h("p", { className: "br-admin-note" }, "No social links have been added.")))),
        h("section", { className: "br-builder br-theme-dark" }, eyebrow("Reusable ministry event types"), h("ol", { className: "br-simple-list" }, entryArray(entry, "ministryEvents").map(function (item, index) { return h("li", { key: index }, item); }))),
        h("section", { className: "br-builder br-theme-paper" }, eyebrow("Reusable gathering features"), h("ul", { className: "br-simple-list" }, entryArray(entry, "ministryIncludes").map(function (item, index) { return h("li", { key: index }, item); }))),
      ]);
    },
  });

  var SongPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      var listenUrl = entryValue(entry, "listenUrl");
      var isHostedAudio = listenUrl && listenUrl.charAt(0) === "/" && /\.(mp3|m4a|aac|ogg|wav)(?:[?#].*)?$/i.test(listenUrl);
      return frame("/songs/…", [
        h("header", { className: "br-song-hero" }, eyebrow("Behind the song"), h("h1", {}, entryValue(entry, "title")), h("p", { className: "br-hero-intro" }, entryValue(entry, "summary")), entryValue(entry, "scripture") ? h("p", { className: "br-scripture" }, "Inspired by ", entryValue(entry, "scripture")) : null),
        h("section", { className: "br-section br-song-body" }, h("div", { className: "br-prose" }, this.props.widgetFor("body")), h("aside", {}, eyebrow(listenUrl ? "Listen" : "Release details"), isHostedAudio ? h("audio", { className: "br-song-audio", controls: true, preload: "metadata", src: listenUrl }) : h("p", {}, listenUrl || "Add a listening link when the release is ready."))),
      ]);
    },
  });

  CMS.registerPreviewStyle("/admin/preview.css");
  CMS.registerPreviewTemplate("home", pagePreview("/"));
  CMS.registerPreviewTemplate("about", pagePreview("/about"));
  CMS.registerPreviewTemplate("ministry", pagePreview("/ministry"));
  CMS.registerPreviewTemplate("music", pagePreview("/music"));
  CMS.registerPreviewTemplate("booking", pagePreview("/book"));
  CMS.registerPreviewTemplate("site", SitePreview);
  CMS.registerPreviewTemplate("songs", SongPreview);
})();
