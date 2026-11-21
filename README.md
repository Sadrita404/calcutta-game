<div align="center">
  <table border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="background: #ffffff; border: 1px solid #d0d7de; border-radius: 12px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <img src="https://github.com/user-attachments/assets/d59bba39-d894-4b11-bb35-3ff4e5e7ec2c" width="100%" max-width="800px" alt="Rough Layout For The PCB" style="border-radius: 6px;" />
        <div style="margin-top: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13px; color: #57606a; font-weight: 500;">
      </td>
    </tr>
  </table>
</div>

<div align="center">

[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com)
[![Web](https://img.shields.io/badge/Platform-Desktop_Web-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.google.com/chrome/)
[![Type](https://img.shields.io/badge/Type-Web_App-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Genre](https://img.shields.io/badge/Genre-Game-blueviolet?style=for-the-badge)](#structure-of-the-game)
[![Architecture](https://img.shields.io/badge/Architecture-WebView-orange?style=for-the-badge)](https://developer.android.com/reference/android/webkit/WebView)

</div>



|Title |Guess - CCU |
|:-- |:--|
|Author | Sadrita Neogi|



## Overview

A mobile-friendly web game in two parts(can be play on pc too). Game 1 (Calcutta-Guesser): look at a photo of a Kolkata landmark, pick the right name from 3 options, and earn 10 Rasogollas per correct answer (100 max). Game 2 (Calcutta-Quiz): 6 Kolkata questions + 4 food pictures, 100 more Rasogollas. Game 3 (Rasogolla Catcher): an arcade game - drag the bowl to catch 50 falling Rasogollas (+2 each, 100 max), dodge chillies and burnt sweets (3 hearts). Finish with a downloadable score picture out of 300.

## Why Guess - CCU ?

Calcutta is a city of stories. Every street, ghat, and building carries a piece of history, from the marble of the Victoria Memorial to the steel of Howrah Bridge, from the prayers at Dakshineswar to the ideas that grew in Jorasanko Thakur Bari. Many people live here for years and never learn why these places matter. Calcutta Guesser turns that learning into a game.

Learning through play. People remember what they enjoy. A quick guess, a small reward, and a short fact after each answer teach more than a textbook page. Every Rasogolla earned is a place remembered.

Keeping culture alive. Young people spend more time on screens than on heritage walks. A game on the screen they already use brings them close to the Bengal Renaissance, the old tram routes, and the temples and markets that make the city what it is.

Welcoming visitors. Tourists and people new to the city can learn the major landmarks before they visit, or find out what to see next. It is a friendly first introduction to Kolkata.

Bringing people together. Challenging a friend, sharing a score, and talking about "that bridge" or "that temple" build a shared pride in the city. A game becomes a conversation about home.

A taste of Bengal in every score. Using Rasogolla as the points is a small touch with a big meaning. It makes the score taste like Kolkata, and it gives the game its own identity.

In short, Calcutta Guesser is more than a game. It is a playful way to explore, remember, and celebrate one of India's most loved cities.


## Run the game (frontend only - this is all you need to play)
Requires Node.js 18+ and Yarn (or npm).

    cd frontend
    yarn install        # or: npm install
    yarn dev            # or: npm run dev

Open http://localhost:3000

   ```
 yarn build          # output is in frontend/dist

 ```

  
  |  | Website Screenshots |  |
| :-: | :-: | :-: |
| <img src="https://github.com/user-attachments/assets/b7900fa9-f95a-4a3a-8fbd-932b55168355" width="280" alt="Screenshot 1" /> | <img src="https://github.com/user-attachments/assets/4bc56879-b1b6-4658-9f35-57226142bc2b" width="280" alt="Screenshot 2" /> | <img src="https://github.com/user-attachments/assets/2c9c9aaa-fb08-4ae2-b509-f20ec5b82de4" width="280" alt="Screenshot 3" /> |
| <img src="https://github.com/user-attachments/assets/7bdc9950-ff69-42e4-93d8-3bcfc6493f46" width="280" alt="Screenshot 4" /> | <img src="https://github.com/user-attachments/assets/47ee9ede-2890-424f-b77d-07f95338efee" width="280" alt="Screenshot 5" /> | <img src="https://github.com/user-attachments/assets/262dba65-aa59-4343-a530-0619dd1b919c" width="280" alt="Screenshot 6" /> |
 

<div align="center">


| Structure of the Game |
| :-: |
| <img src="https://github.com/user-attachments/assets/4b90dee4-b5cd-4e17-b318-a747d2f83990" width="600" alt="Structure of the Game" /> |

</div>

---

## Game 1: Calcutta-Guesser

Look at a photo of a famous Kolkata place and guess where it is.

| Rule | Detail |
|------|--------|
| Rounds | 10 |
| Choices per round | 3 (1 correct + 2 wrong) |
| Correct answer | +10 Rasogollas |
| Wrong answer | 0 Rasogollas |
| Maximum score | 100 |

**The 10 places:**
1. Victoria Memorial
2. Howrah Bridge
3. Dakshineswar Kali Temple
4. Kalighat Kali Temple
5. Indian Museum
6. Prinsep Ghat
7. Park Street
8. New Market
9. Jorasanko Thakur Bari
10. Science City

After each answer, the correct option turns **green** and a wrong pick turns **red**.
The next round starts automatically after 1.5 seconds.

---

## Game 2: Calcutta-Quiz

Answer questions about Kolkata's history and culture, then name famous foods from a picture.

| Rule | Detail |
|------|--------|
| Questions | 10 (6 trivia + 4 food pictures) |
| Choices per question | 3 |
| Correct answer | +10 Rasogollas |
| Wrong answer | 0 Rasogollas |
| Maximum score | 100 |

**Part A: Trivia (6 questions)**

| # | Category | Question | Answer |
|---|----------|----------|--------|
| 1 | History | In which year did the official English name change from "Calcutta" to "Kolkata"? | 2001 |
| 2 | Landmarks | Which famous Kolkata bridge is built without pillars? | Howrah Bridge (Rabindra Setu) |
| 3 | Culture | Which ancestral house in Kolkata was home to Rabindranath Tagore? | Jorasanko Thakur Bari |
| 4 | Heritage | Which grand festival in Kolkata is recognized by UNESCO? | Durga Puja |
| 5 | Embroidery | What traditional embroidery style is Bengal famous for? | Kantha |
| 6 | Geography | Along which river is Kolkata situated? | Hooghly River (Hugli) |

**Part B: "What food is this?" (4 pictures)**

| # | Food |
|---|------|
| 7 | Phuchka |
| 8 | Jhalmuri |
| 9 | Mishti Doi |
| 10 | Kulfi |

---

## 🍬 Game 3: Rasogolla Catcher (Arcade)

Rasogollas fall from the top of the screen. Move the clay bowl left and right to catch them.

| Rule | Detail |
|------|--------|
| Rasogollas per game | 50 |
| Catch a Rasogolla | +2 Rasogollas |
| Miss a Rasogolla | No penalty |
| Catch a  chili pepper | −1 heart |
| Catch a burnt sweet | −1 heart |
| Hearts | 3 |
| Maximum score | 100 |

**Controls**
-  **Phone:** drag anywhere on the screen with one thumb
-  **Laptop:** move the mouse, or use the ← → arrow keys (or A / D)

**The game ends when:**
- all 50 Rasogollas have fallen (*"Bowl full!"*, or *"Perfect bowl!"* if you caught all 50), or
- you lose all 3 hearts (*"Too spicy!"*)

The sweets fall faster as the game goes on, and more chillies and burnt sweets appear.
After the game you can **try again** or go to your final score card.

---

## Final Score Card

| Game | Max |
|------|-----|
| Calcutta-Guesser | 100 |
| Calcutta-Quiz | 100 |
| Rasogolla Catcher | 100 |
| **Total** | **300** |

- **Download score picture:** saves a PNG image of your score (`calcutta-score-<total>.png`) to share online
- **Play all games again:** starts again from Game 1

---

##  Extras

- Click sound when you tap options and buttons
- Chime for a correct answer, soft buzz for a wrong one
- "Plop" sound when you catch a Rasogolla
- The phone vibrates when you catch a chili or burnt sweet (on phones that support it)
- Works on phones, tablets and desktops

