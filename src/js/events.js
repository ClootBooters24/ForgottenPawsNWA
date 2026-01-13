// events.js - Carousel Events System
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const eventsContainer = document.getElementById('events-container');
    const prevBtn = document.getElementById('prev-event');
    const nextBtn = document.getElementById('next-event');
    const currentEventSpan = document.getElementById('current-event');
    const totalEventsSpan = document.getElementById('total-events');
    const noEventsMessage = document.querySelector('.no-events-message');
    const eventsDotsContainer = document.getElementById('events-dots');
    
    // State variables
    let upcomingEvents = [];
    let currentEventIndex = 0;
    let autoAdvanceInterval = null;
    let isAnimating = false;
    
    // Get today's date (start of day in local time)
    function getToday() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
    
    // Parse date string (YYYY-MM-DD format)
    function parseEventDate(dateStr) {
        if (!dateStr) return null;
        
        try {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateStr);
                return null;
            }
            
            date.setHours(0, 0, 0, 0);
            return date;
        } catch (error) {
            console.error('Error parsing date:', dateStr, error);
            return null;
        }
    }
    
    // Format date for display
    function formatEventDate(date) {
        if (!date) return 'Date TBD';
        
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Check if event should be displayed
    function shouldDisplayEvent(event) {
        // Don't show cancelled or completed events
        if (['cancelled', 'completed'].includes(event.status)) {
            return false;
        }
        
        // Only show events with valid status
        const validStatuses = ['confirmed', 'pending', 'tentative'];
        if (event.status && !validStatuses.includes(event.status)) {
            return false;
        }
        
        // Parse event date
        const eventDate = parseEventDate(event.date);
        if (!eventDate) return false;
        
        // Get today's date
        const today = getToday();
        
        // Show events that are today or in the future
        return eventDate >= today;
    }
    
    // Load events from JSON file
    async function loadEvents() {
        try {
            // Show loading state
            eventsContainer.innerHTML = '<div class="events-loading"><p>Loading upcoming events...</p></div>';
            
            const response = await fetch('./assets/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            processEvents(data.events || []);
        } catch (error) {
            console.error('Error loading events:', error);
            showError();
        }
    }
    
    // Process and filter events
    function processEvents(events) {
        // Filter events based on status and date
        upcomingEvents = events
            .map(event => ({
                ...event,
                parsedDate: parseEventDate(event.date),
                formattedDate: formatEventDate(parseEventDate(event.date)),
                status: event.status || 'confirmed'
            }))
            .filter(shouldDisplayEvent)
            .sort((a, b) => a.parsedDate - b.parsedDate); // Soonest first
        
        // Debug logging
        console.log('Today:', getToday().toLocaleDateString());
        console.log('Filtered events:', upcomingEvents.length);
        
        // Display events or show "no events" message
        if (upcomingEvents.length > 0) {
            displayEvents();
            // updateNavigation();
            createDotIndicators();
            startAutoAdvance();
        } else {
            showNoEvents();
        }
    }
    
    // Display events in carousel
    function displayEvents() {
        // Clear container
        eventsContainer.innerHTML = '';
        
        // Create event cards
        upcomingEvents.forEach((event, index) => {
            const eventCard = createEventCard(event, index);
            eventsContainer.appendChild(eventCard);
        });
        
        // Show the first event
        showEvent(currentEventIndex);
    }
    
    // Create event card HTML element
    function createEventCard(event, index) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('data-index', index);
        
        // Get month and day for badge
        let month = 'MMM';
        let day = 'DD';
        let statusClass = '';
        let statusText = '';
        
        if (event.parsedDate) {
            month = event.parsedDate.toLocaleDateString('en-US', { month: 'short' });
            day = event.parsedDate.getDate();
        }
        
        // Add status styling
        switch(event.status) {
            case 'cancelled':
                statusClass = 'cancelled';
                statusText = 'Cancelled';
                break;
            case 'tentative':
                statusClass = 'tentative';
                statusText = 'Tentative';
                break;
            case 'pending':
                statusClass = 'pending';
                statusText = 'Pending';
                break;
        }
        
        // Check if event is today
        const today = getToday();
        const isToday = event.parsedDate && 
                       event.parsedDate.getTime() === today.getTime() && 
                       event.status === 'confirmed';
        
        // Build card HTML
        card.innerHTML = `
            <div class="event-date-badge ${statusClass} ${isToday ? 'today' : ''}">
                <span class="month">${month}</span>
                <span class="day">${day}</span>
                ${statusText ? `<span class="status-badge">${statusText}</span>` : ''}
                ${isToday ? '<span class="today-badge">Today</span>' : ''}
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.name}</h3>
                <div class="event-details">
                    <div class="event-detail">
                        <i>📅</i>
                        <span><strong>Date:</strong> ${event.formattedDate}</span>
                    </div>
                    ${event.time ? `
                    <div class="event-detail">
                        <i>⏰</i>
                        <span><strong>Time:</strong> ${event.time}</span>
                    </div>
                    ` : ''}
                    ${event.location ? `
                    <div class="event-detail">
                        <i>📍</i>
                        <span><strong>Location:</strong> ${event.location}</span>
                    </div>
                    ` : ''}
                    ${event.description ? `
                    <div class="event-detail">
                        <i>📝</i>
                        <span>${event.description}</span>
                    </div>
                    ` : ''}
                </div>
                ${event.link && event.status !== 'cancelled' ? `
                <a href="${event.link}" class="event-link" ${event.link.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
                    More Details
                </a>
                ` : event.status === 'cancelled' ? `
                <span class="event-link cancelled-link">Event Cancelled</span>
                ` : `
                <span class="event-link disabled">Details Coming Soon</span>
                `}
            </div>
        `;
        
        return card;
    }
    
    // Show specific event in carousel
    function showEvent(index) {
        if (isAnimating || upcomingEvents.length === 0) return;
        
        isAnimating = true;
        
        // Remove previous/next classes from all cards
        const allCards = document.querySelectorAll('.event-card');
        allCards.forEach(card => {
            card.classList.remove('active', 'prev', 'next');
        });
        
        // Get the current, previous, and next cards
        const prevIndex = (index - 1 + upcomingEvents.length) % upcomingEvents.length;
        const nextIndex = (index + 1) % upcomingEvents.length;
        
        const prevCard = document.querySelector(`.event-card[data-index="${prevIndex}"]`);
        const currentCard = document.querySelector(`.event-card[data-index="${index}"]`);
        const nextCard = document.querySelector(`.event-card[data-index="${nextIndex}"]`);
        
        // Add appropriate classes
        if (prevCard) prevCard.classList.add('prev');
        if (currentCard) currentCard.classList.add('active');
        if (nextCard) nextCard.classList.add('next');
        
        // Update current index and navigation
        currentEventIndex = index;
        // updateNavigation();
        updateDotIndicators();
        
        // Reset animation flag after animation completes
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    // Update navigation buttons and counter
    // function updateNavigation() {
    //     const totalEvents = upcomingEvents.length;
        
    //     if (totalEvents > 0) {
    //         // Update counter
    //         currentEventSpan.textContent = currentEventIndex + 1;
    //         totalEventsSpan.textContent = totalEvents;
            
    //         // Enable/disable navigation buttons
    //         prevBtn.disabled = currentEventIndex === 0;
    //         nextBtn.disabled = currentEventIndex === totalEvents - 1;
    //     } else {
    //         currentEventSpan.textContent = '0';
    //         totalEventsSpan.textContent = '0';
    //         prevBtn.disabled = true;
    //         nextBtn.disabled = true;
    //     }
    // }
    
    // Create dot indicators
    function createDotIndicators() {
        if (!eventsDotsContainer) return;
        
        eventsDotsContainer.innerHTML = '';
        
        for (let i = 0; i < upcomingEvents.length; i++) {
            const dot = document.createElement('button');
            dot.className = `event-dot ${i === currentEventIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to event ${i + 1}`);
            dot.setAttribute('data-index', i);
            
            dot.addEventListener('click', () => {
                if (!isAnimating && i !== currentEventIndex) {
                    showEvent(i);
                    restartAutoAdvance();
                }
            });
            
            eventsDotsContainer.appendChild(dot);
        }
    }
    
    // Update active dot indicator
    function updateDotIndicators() {
        if (!eventsDotsContainer) return;
        
        const dots = eventsDotsContainer.querySelectorAll('.event-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentEventIndex);
        });
    }
    
    // Show "no events" message
    function showNoEvents() {
        eventsContainer.style.display = 'none';
        document.querySelector('.events-navigation').style.display = 'none';
        if (eventsDotsContainer) eventsDotsContainer.style.display = 'none';
        noEventsMessage.style.display = 'block';
    }
    
    // Show error message
    function showError() {
        eventsContainer.innerHTML = `
            <div class="no-events-message" style="display: block;">
                <p>Unable to load events at this time.</p>
                <p>Please check our <a href="https://facebook.com/forgottenpawsnwa" target="_blank">Facebook page</a> for updates.</p>
            </div>
        `;
        document.querySelector('.events-navigation').style.display = 'none';
        if (eventsDotsContainer) eventsDotsContainer.style.display = 'none';
    }
    
    // Auto-advance functionality
    function startAutoAdvance() {
        if (upcomingEvents.length > 1) {
            stopAutoAdvance();
            autoAdvanceInterval = setInterval(() => {
                const nextIndex = (currentEventIndex + 1) % upcomingEvents.length;
                showEvent(nextIndex);
            }, 8000); // Advance every 8 seconds
        }
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = null;
        }
    }
    
    function restartAutoAdvance() {
        stopAutoAdvance();
        if (upcomingEvents.length > 1) {
            startAutoAdvance();
        }
    }
    
    // // Event Listeners
    // prevBtn.addEventListener('click', () => {
    //     if (currentEventIndex > 0) {
    //         showEvent(currentEventIndex - 1);
    //         restartAutoAdvance();
    //     }
    // });
    
    // nextBtn.addEventListener('click', () => {
    //     if (currentEventIndex < upcomingEvents.length - 1) {
    //         showEvent(currentEventIndex + 1);
    //         restartAutoAdvance();
    //     }
    // });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showEvent(currentEventIndex - 1);
            restartAutoAdvance();
        } else if (e.key === 'ArrowRight') {
            showEvent(currentEventIndex + 1);
            restartAutoAdvance();
        }
        else if (currentEventIndex < 0) {
            showEvent(currentEventIndex.length - 1);
        }
        else if (currentEventIndex >= upcomingEvents.length) {
            showEvent(0);
        }
    });
    
    // Pause auto-advance on hover
    eventsContainer.addEventListener('mouseenter', stopAutoAdvance);
    eventsContainer.addEventListener('mouseleave', () => {
        if (upcomingEvents.length > 1) {
            startAutoAdvance();
        }
    });
    
    // Update events at midnight
    function scheduleMidnightUpdate() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        
        const timeUntilMidnight = midnight - now;
        
        setTimeout(() => {
            loadEvents();
            scheduleMidnightUpdate();
        }, timeUntilMidnight);
    }
    
    // Initialize
    loadEvents();
    scheduleMidnightUpdate();
});