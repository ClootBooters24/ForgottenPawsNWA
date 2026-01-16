function createDogCard(dog) {
    const dogCard = document.createElement('div');
    dogCard.className = 'dog-card';
    dogCard.style.cursor = 'pointer';

    dogCard.innerHTML = `
        <div class="dog-image-container">
            <img src="${dog.image}" alt="${dog.name}" class="dog-image" loading="lazy">
        </div>

        <div class="dog-info">
            <h3>${dog.name}</h3>
            <p class="status">Status: ${dog.status}</p>
            <p class="breed">Breed: ${dog.breed}</p>
            <p class="age">Age: ${dog.age}</p>
            <p class="description">${dog.description}</p>
        </div> 
    `;

    dogCard.addEventListener('click', (e) => {
        // Allow clicks on the card and all its children
        if (dog.status !== "Adopted") {
            showAdoptionModal(dog.name, dogCard);
        }
    });

    return dogCard;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.dogs-header') && !document.querySelector('.gallery-header')) return;

    fetch('assets/dogs.json')
        .then(response => response.json())
        .then(dogs => { 
            const galleryContainer = document.getElementById('dog-container');
            galleryContainer.innerHTML = '';

            // Sort dogs: Available first, then Adopted
            dogs.sort((a, b) => {
                if (a.status === "Available" && b.status !== "Available") return -1;
                if (a.status !== "Available" && b.status === "Available") return 1;
                return 0;
            });

            dogs.forEach(dog => {
                galleryContainer.appendChild(createDogCard(dog));
            });
        })
        .catch(error => {
            console.error('Error loading dogs:', error);
            const container = document.getElementById('dog-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Could not load dogs. Please try again later.</p>
                    </div>
                `;
            }
        });
    });

function showAdoptionModal(dogName, dogCardElement) {
    let popup = document.getElementById('adoptionPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'adoptionPopup';
        popup.className = 'adoption-popup';
        document.body.appendChild(popup);
    }
    
    popup.innerHTML = `
        <h3>Ready to Adopt ${dogName}?</h3>
        <p>Visit our adoption page to help ${dogName} find a home</p>
        <a href="./adopt.html" class="adoption-popup-link">Apply to Adopt</a>
    `;
    
    // Position popup in the center of the dog card
    const rect = dogCardElement.getBoundingClientRect();
    const popupHeight = 160;
    popup.style.top = (rect.top + window.scrollY + rect.height / 2 - popupHeight / 2) + 'px';
    popup.style.left = (rect.left + rect.width / 2 - 140 + window.scrollX) + 'px';
    
    popup.classList.add('show');
}

function closeAdoptionModal() {
    const popup = document.getElementById('adoptionPopup');
    if (popup) {
        popup.classList.remove('show');
    }
}

document.addEventListener('click', function(event) {
    const popup = document.getElementById('adoptionPopup');
    if (popup && !popup.contains(event.target) && event.target.className !== 'dog-card') {
        closeAdoptionModal();
    }
});
