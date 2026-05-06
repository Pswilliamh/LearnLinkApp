
export interface FocusZone {
  type: 'pink' | 'green';
  label: string;
  top: number; // percentage
  left: number; // percentage
  width: number; // percentage
  height: number; // percentage
}

export interface ScenarioSlide {
  id: string;
  type: 'precision_scenario';
  image_url: string;
  image_hint: string;
  focus_zones: FocusZone[];
  dialogue: {
    english: string;
    indonesian: string;
  };
}

export interface VerificationStatus {
  status: 'Verified' | 'Draft';
  verified_by: string;
  verification_date: string;
  precision_notes: string;
}

export interface ScenarioLesson {
  lesson_id: string;
  theme: string;
  description: string;
  verification: VerificationStatus;
  is_premium: boolean;
  slides: ScenarioSlide[];
}

export const scenarioLessons: ScenarioLesson[] = [
  {
    lesson_id: "airport_survival_01",
    theme: "Airport Survival",
    description: "Navigate the airport and find your way to the check-in counter.",
    is_premium: true,
    verification: {
      status: 'Verified',
      verified_by: 'William - Master Teacher',
      verification_date: '2026-05-06',
      precision_notes: 'Verified interlinear scripts for Jakarta-specific terminology.'
    },
    slides: [
      {
        id: "s1",
        type: "precision_scenario",
        image_url: "https://picsum.photos/seed/airport1/800/600",
        image_hint: "Busy airport terminal with signs",
        focus_zones: [
          { type: "pink", label: "Lost Traveler", top: 40, left: 10, width: 20, height: 40 },
          { type: "green", label: "Information Sign", top: 10, left: 60, width: 30, height: 20 }
        ],
        dialogue: {
          english: "Excuse me, where is the check-in counter?",
          indonesian: "Permisi, di mana konter lapor diri (check-in)?"
        }
      },
      {
        id: "s2",
        type: "precision_scenario",
        image_url: "https://picsum.photos/seed/airport2/800/600",
        image_hint: "Check-in counter at airport",
        focus_zones: [
          { type: "pink", label: "Passport Needed", top: 50, left: 30, width: 15, height: 20 },
          { type: "green", label: "Helpful Staff", top: 20, left: 70, width: 20, height: 50 }
        ],
        dialogue: {
          english: "Here is my passport and ticket.",
          indonesian: "Ini paspor dan tiket saya."
        }
      }
    ]
  },
  {
    lesson_id: "restaurant_ordering_01",
    theme: "Ordering at a Restaurant",
    description: "Learn how to order food and ask questions about the menu.",
    is_premium: true,
    verification: {
      status: 'Verified',
      verified_by: 'William - Master Teacher',
      verification_date: '2026-05-07',
      precision_notes: 'Adjusted polite forms for ordering in a formal setting.'
    },
    slides: [
      {
        id: "r1",
        type: "precision_scenario",
        image_url: "https://picsum.photos/seed/rest1/800/600",
        image_hint: "Modern restaurant interior with menus",
        focus_zones: [
          { type: "pink", label: "Hungry Customer", top: 30, left: 20, width: 25, height: 60 },
          { type: "green", label: "Menu Options", top: 15, left: 65, width: 20, height: 30 }
        ],
        dialogue: {
          english: "Could I see the menu, please?",
          indonesian: "Bisa saya lihat menunya?"
        }
      }
    ]
  }
];
