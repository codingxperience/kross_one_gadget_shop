# Fold Motion and Share Preview Design

## Objective

Restore the intended two-device motion in the **Samsung Fold 8 Series** section and make shared storefront links immediately recognisable as Kross One Gadgets links.

## Approved decisions

### Samsung Fold 8 Series motion

- Scope is the **"The most awaited" / Samsung Fold 8 Series** section only. The home hero orbit is out of scope.
- The animated stage contains exactly two devices: **Galaxy Z Fold 8** and **Galaxy Z Flip 8**.
- Galaxy Z Fold 8 Ultra must not appear in the animated stage. It remains available through its separate product card and catalogue record.
- Keep the existing paired 15-second opposing-orbit movement and gentle tilt. Restore the Fold 8 asset in the first orbit and retain the Flip 8 asset in the second orbit.
- The rendered devices use verified official Samsung imagery, never the owner-provided photos.

### Shared-link preview

- The document title and Open Graph/Twitter title are exactly: `Kross One Gadgets | Apple & Samsung Store | Lugogo Mall`.
- The preview uses a new versioned 1.91:1 image URL, so services such as WhatsApp can request fresh metadata rather than reuse an old cached thumbnail.
- The artwork is a purpose-built black-and-gold brand card, readable at small preview size. It contains:
  - a gold K inside a phone-circle emblem;
  - `KROSS ONE` and `GADGETS` wordmark;
  - `Apple & Samsung Store | Lugogo Mall`;
  - `Luxury | Electronics | Lifestyle`.
- The poster supplied by the owner is a visual reference only and is not published. The final preview artwork is an original vector-derived brand card, not a crop or copy of the supplied photograph.
- Static metadata, client-side metadata updates, canonical URL, and social image URLs use the configured production canonical origin.

### New owner-identified stock

- Treat the uploaded shop photos as inventory-identification references only; do not copy them into the site or public asset directory.
- Add only exact, verifiable products with manufacturer or official distributor imagery. Record each approved download and its source page in `ASSET_SOURCES.md`.
- Candidate products identified from the supplied packaging are HP Smart Tank 580, JBL PartyBox Stage 320, a Powerology rotating-stand portable projector, Ray-Ban Meta smart glasses, Huawei Watch GT 6 Pro, Huawei Watch Ultimate 2, Green Lion Strive Smart Watch, and a 10,000mAh magnetic power bank.
- When the exact commercial model or brand cannot be confirmed from an official source, do not guess. Leave it out of the catalogue until a matching official listing can be verified.

## Validation

- `npm run build` succeeds.
- `npm run qa` passes after updating its integrity checks and content assertions.
- Inspect the generated preview asset visually at normal and thumbnail scale.
- Confirm the Fold stage references Fold 8 and Flip 8 only, and no owner-uploaded image path exists in site source or public assets.
