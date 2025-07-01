# TODO.md

## 🐾 PurePaws - Features and things to work on

### ✏️ Breeder Application Improvements
- [ ] Format certain inputs automatically:
  - Capitalize kennel name, contact name, city/state when user types.
  - Ensure email is lowercased.
- [ ] Validate breeds offered:
  - Do not allow selecting more than **2 breeds**.
  - Show a helpful error if the user tries to select a third.

### ✅ Success Page / Form Flow
- [ ] Clear form inputs automatically after successful submission.
- [ ] Consider adding a localStorage guard so `/success` is only accessible if they just submitted.

### 🔑 Authentication (Future)
- [ ] Set up breeder auth so breeders can edit their listing.
- [ ] Add admin auth to approve/reject breeders.
- [ ] Add email notifications when breeders are approved.

### 🗺️ Map & Listings
- [ ] Use address geocoding to auto-fill `latitude` and `longitude` fields.
- [ ] Add filtering for approved breeders only (done!).
- [ ] Connect breeder detail pages to the database (done!).
- [ ] Add an “All Dogs” search view.

---

Keep building! 🐕✨