const mockData = {
    "breeders": [
      {
        "id": "b1",
        "name": "Golden Haven Kennels",
        "location": "Ocala, FL",
        "email": "info@goldenhavenkennels.com",
        "phone": "(352) 555-1234",
        "breeds": ["Golden Retriever"],
        "certifications": ["AKC", "OFA Hips & Elbows", "CERF Eyes"],
        "website": "https://goldenhavenkennels.com",
        "about": "Family-run kennel specializing in healthy, well-socialized Golden Retrievers with champion bloodlines."
      },
      {
        "id": "b2",
        "name": "Blue Ridge Shepherds",
        "location": "Asheville, NC",
        "email": "contact@blueridgeshepherds.com",
        "phone": "(828) 555-5678",
        "breeds": ["German Shepherd"],
        "certifications": ["AKC", "DM Clear", "Hip Certified"],
        "website": "https://blueridgeshepherds.com",
        "about": "Responsible breeders of working-line German Shepherds with excellent health and trainability."
      },
      {
        "id": "b3",
        "name": "Shady Pines Spaniels",
        "location": "Austin, TX",
        "email": "hello@shadypinesspaniels.com",
        "phone": "(512) 555-2468",
        "breeds": ["English Springer Spaniel"],
        "certifications": ["AKC", "PRA Clear", "OFA Elbows"],
        "website": "https://shadypinesspaniels.com",
        "about": "Small home breeder producing English Springer Spaniels with focus on temperament and family fit."
      }
    ],
    "dogs": [
      {
        "id": "p1",
        "name": "Bella",
        "breed": "Golden Retriever",
        "dob": "2025-03-01",
        "status": "Available",
        "photo": "/images/bella.jpg",
        "description": "Affectionate and calm, perfect for a family with kids.",
        "price": 2800,
        "breederId": "b1",
        "location": "Ocala, FL"
      },
      {
        "id": "p2",
        "name": "Max",
        "breed": "Golden Retriever",
        "dob": "2025-03-01",
        "status": "Reserved",
        "photo": "/images/max.jpg",
        "description": "Playful male, very friendly and loves fetch.",
        "price": 2800,
        "breederId": "b1",
        "location": "Ocala, FL"
      },
      {
        "id": "p3",
        "name": "Daisy",
        "breed": "Golden Retriever",
        "dob": "2025-03-01",
        "status": "Available",
        "photo": "/images/daisy.jpg",
        "description": "Sweet girl with a gentle temperament.",
        "price": 3000,
        "breederId": "b1",
        "location": "Ocala, FL"
      },
      {
        "id": "p4",
        "name": "Luna",
        "breed": "German Shepherd",
        "dob": "2025-02-15",
        "status": "Available",
        "photo": "/images/luna.jpg",
        "description": "Intelligent and alert, great for active owners.",
        "price": 3200,
        "breederId": "b2",
        "location": "Asheville, NC"
      },
      {
        "id": "p5",
        "name": "Rex",
        "breed": "German Shepherd",
        "dob": "2025-02-15",
        "status": "Available",
        "photo": "/images/rex.jpg",
        "description": "Confident male, great protection instincts.",
        "price": 3200,
        "breederId": "b2",
        "location": "Asheville, NC"
      },
      {
        "id": "p6",
        "name": "Shadow",
        "breed": "German Shepherd",
        "dob": "2025-02-15",
        "status": "Reserved",
        "photo": "/images/shadow.jpg",
        "description": "Energetic, loves to learn and train.",
        "price": 3000,
        "breederId": "b2",
        "location": "Asheville, NC"
      },
      {
        "id": "p7",
        "name": "Milo",
        "breed": "English Springer Spaniel",
        "dob": "2025-01-20",
        "status": "Available",
        "photo": "/images/milo.jpg",
        "description": "Lively boy, loves outdoor play and water.",
        "price": 2500,
        "breederId": "b3",
        "location": "Austin, TX"
      },
      {
        "id": "p8",
        "name": "Sadie",
        "breed": "English Springer Spaniel",
        "dob": "2025-01-20",
        "status": "Available",
        "photo": "/images/sadie.jpg",
        "description": "Gentle and loyal, great with kids and other pets.",
        "price": 2500,
        "breederId": "b3",
        "location": "Austin, TX"
      },
      {
        "id": "p9",
        "name": "Charlie",
        "breed": "English Springer Spaniel",
        "dob": "2025-01-20",
        "status": "Reserved",
        "photo": "/images/charlie.jpg",
        "description": "Friendly and cuddly, loves attention.",
        "price": 2500,
        "breederId": "b3",
        "location": "Austin, TX"
      },
      {
        "id": "p10",
        "name": "Cooper",
        "breed": "English Springer Spaniel",
        "dob": "2025-01-20",
        "status": "Available",
        "photo": "/images/cooper.jpg",
        "description": "Curious and energetic, loves exploring.",
        "price": 2500,
        "breederId": "b3",
        "location": "Austin, TX"
      }
    ]
  }
  
  export { mockData };