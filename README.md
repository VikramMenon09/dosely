# Dosely

Dosely is a medication tracker for caregivers and families. It shows each patient's medicines, the doses due today, and which refills are running low.

**Live demo:** https://dosely-olive.vercel.app. Tap **Try the demo** to get in without an account. It loads three made-up patients with sample medicines.

## What you can do

- **Home:** the next dose due, today's progress, and low-stock warnings across all patients.
- **Patients:** each patient's schedule for today, their medicine list, and stock levels. You can add patients and restock medicines.
- **Medicine editor:** add or edit a medicine's dose, frequency, dose times, stock, refill threshold, prescribing doctor and notes.
- **Alerts:** overdue doses, upcoming doses and low stock in one list. Doses more than 30 minutes late are marked missed automatically.
- **Roles:** the demo has admin, caregiver and patient views. The patient view shows only that patient's own medicines.
- **Reminders:** optional browser notifications when a dose is due.

Everything runs in the browser. Data is saved in `localStorage`, so there is no backend and nothing leaves your device. The sign-in screen is a front-end demo; there are no real accounts.

## Run it locally

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. To make a production build, run `npm run build`; the output goes to `dist/`.

## Built with

React 19 and Vite, with plain CSS (no UI library).
