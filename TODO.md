# TODO.md

## 🐾 PurePaws - Features and things to work on

## 1️⃣ Core Functionality

- [ ] **Add Litter Name Field**
  - Add “litter name” input to *Add Dog* form - Done
  - Group dogs by litter in breeder profile (in-progress)
  - Display litter detail page with dogs listed properly (in-progress)

- [ ] **Image Storage**
  - Choose & configure **Cloudinary** or **S3** - Done
  - Test uploading images for dogs - Done
  - Confirm images render properly in production (not local `/public` only)

- [ ] **Puppy Application**
  - Ensure users can submit a puppy application
  - Save puppy application with `userId` in MongoDB
  - Display application on user’s profile page
  - Add ability to update application (optional)

---

## 2️⃣ Admin Dashboard (Stretch)

- [ ] Create `/admin` protected route
- [ ] Fetch & display all breeder applications
- [ ] Add **Approve** / **Deny** buttons
- [ ] Trigger *SendGrid* email when breeder status changes

---

## 3️⃣ Light Design Polish (Optional)

- [ ] Improve **Home Map View**
  - Add clustering for overlapping breeders 

- [ ] Improve **Puppy Detail View**
  - Add placeholder for multiple images or photo slider
  - Add share/copy link button with Sonner toast
  - Clean up spacing, fonts, and general UI clarity

---

## 💡 Notes

- Focus on **core features first**, polish later
- Once these work, you’re *MVP-ready* for breeders & puppy parents!

Keep building! 🐕✨