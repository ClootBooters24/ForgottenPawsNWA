// events.js - Carousel Events System
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const eventsSection = document.querySelector('.upcoming-events');
    const eventsContainer = document.getElementById('events-container');
    const prevBtn = document.getElementById('prev-event');
    const nextBtn = document.getElementById('next-event');
    const currentEventSpan = document.getElementById('current-event');
    const totalEventsSpan = document.getElementById('total-events');
    const noEventsMessage = document.querySelector('.no-events-message');
    const eventsDotsContainer = document.getElementById('events-dots');
    const eventsNavigation = document.querySelector('.events-navigation');
    
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
    
    // Format date for display (single date)
    function formatEventDate(date) {
        if (!date) return 'Date TBD';
        
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Format date range for display
    function formatDateRange(startDate, endDate) {
        if (!startDate || !endDate) return formatEventDate(startDate);
        
        // If same day, just show the date
        if (startDate.getTime() === endDate.getTime()) {
            return formatEventDate(startDate);
        }
        
        // Same month and year: "January 1-31, 2026"
        if (startDate.getFullYear() === endDate.getFullYear() && 
            startDate.getMonth() === endDate.getMonth()) {
            return `${startDate.toLocaleDateString('en-US', { 
                month: 'long' 
            })} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
        }
        
        // Same year, different months: "January 1 - February 15, 2026"
        if (startDate.getFullYear() === endDate.getFullYear()) {
            return `${startDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
            })} - ${endDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            })}`;
        }
        
        // Different years: "January 1, 2026 - January 15, 2027"
        return `${formatEventDate(startDate)} - ${formatEventDate(endDate)}`;
    }
    
    // Check if event should be displayed
    function shouldDisplayEvent(event) {
        // Only show confirmed events
        if (event.status !== 'confirmed') {
            console.log('Event not confirmed:', event.name);
            return false;
        }
        
        // Parse event dates - support both single date and date range
        let eventStartDate, eventEndDate;
        
        if (event.date) {
            // Single date format
            eventStartDate = parseEventDate(event.date);
            eventEndDate = eventStartDate;
        } else if (event.startDate) {
            // Date range format
            eventStartDate = parseEventDate(event.startDate);
            eventEndDate = parseEventDate(event.endDate) || eventStartDate;
        } else {
            console.log('Event missing date:', event.name);
            return false;
        }
        
        if (!eventStartDate || !eventEndDate) {
            console.log('Invalid date for event:', event.name);
            return false;
        }
        
        // Get today's date
        const today = getToday();
        
        // console.log('Checking dates for', event.name, ':', {
        //     eventStartDate: eventStartDate.toLocaleDateString(),
        //     eventEndDate: eventEndDate.toLocaleDateString(),
        //     today: today.toLocaleDateString(),
        //     eventEndTimestamp: eventEndDate.getTime(),
        //     todayTimestamp: today.getTime(),
        //     shouldDisplay: eventEndDate >= today
        // });
        
        // Show events that are ongoing today or in the future
        return eventEndDate >= today;
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
        // First, map all events to parse their dates
        const mappedEvents = events
            .map(event => {
                // Support both single date and date range formats
                let startDate, endDate;
                
                if (event.date) {
                    // Single date format
                    startDate = parseEventDate(event.date);
                    endDate = startDate;
                } else if (event.startDate) {
                    // Date range format
                    startDate = parseEventDate(event.startDate);
                    endDate = parseEventDate(event.endDate) || startDate;
                } else {
                    console.error('Event missing date:', event);
                    return null;
                }
                
                if (!startDate || !endDate) {
                    console.error('Invalid date for event:', event);
                    return null;
                }
                
                return {
                    ...event,
                    parsedDate: startDate, // Keep for backward compatibility
                    startDate: startDate,
                    endDate: endDate,
                    formattedDate: formatDateRange(startDate, endDate),
                    status: event.status || 'confirmed',
                    // For backward compatibility with single-date events
                    date: event.date || event.startDate,
                    // Determine if it's a single day event
                    isSingleDay: startDate.getTime() === endDate.getTime()
                };
            })
            .filter(event => event !== null); // Remove null events
        
        // Now filter the mapped events (which have parsed dates)
        upcomingEvents = mappedEvents
            .filter(event => {
                // Only show confirmed events
                if (event.status !== 'confirmed') {
                    return false;
                }
                
                // Get today's date
                const today = getToday();
                
                // Show events that are ongoing today or in the future
                return event.endDate >= today;
            })
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
        
        // Get month and day for badge (use start date)
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
        
        // Check if event is ongoing today
        const today = getToday();
        const isToday = event.startDate && 
                       event.endDate &&
                       event.startDate <= today && 
                       event.endDate >= today && 
                       event.status === 'confirmed';
        
        // Check if event is multi-day
        const isMultiDay = !event.isSingleDay;
        
        // Format description to preserve line breaks
        const formattedDescription = event.description ? 
            event.description.replace(/\n/g, '<br>') : '';
        
        // Build card HTML
        card.innerHTML = `
            <div class="event-date-badge ${statusClass} ${isToday ? 'today' : ''} ${isMultiDay ? 'multi-day' : ''}">
                <span class="month">${month}</span>
                <span class="day">${day}</span>
                ${statusText ? `<span class="status-badge">${statusText}</span>` : ''}
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.name}</h3>
                <div class="event-details">
                    <div class="event-detail">
                        <i>📅</i>
                        <span><strong>${isMultiDay ? 'Date Range:' : 'Date:'}</strong> ${event.formattedDate}</span>
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
                        <span>${formattedDescription}</span>
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
    function showEvent(index, direction = 'right') {
        if (isAnimating || upcomingEvents.length === 0) return;
        
        isAnimating = true;
        
        // Get all cards
        const allCards = document.querySelectorAll('.event-card');
        const previousCard = document.querySelector('.event-card.active');
        const nextCard = document.querySelector(`.event-card[data-index="${index}"]`);
        
        // Remove previous card with slide out animation
        if (previousCard) {
            previousCard.classList.remove('active', 'slide-from-left', 'slide-from-right');
            if (direction === 'right') {
                previousCard.classList.add('slide-out-left');
            } else {
                previousCard.classList.add('slide-out-right');
            }
        }
        
        // Clean up all other cards
        allCards.forEach(card => {
            if (card !== previousCard && card !== nextCard) {
                card.classList.remove('active', 'slide-from-left', 'slide-from-right', 'slide-out-left', 'slide-out-right');
            }
        });
        
        // Activate and animate the new card
        if (nextCard) {
            nextCard.classList.remove('slide-out-left', 'slide-out-right');
            nextCard.classList.add('active');
            if (direction === 'right') {
                nextCard.classList.add('slide-from-right');
            } else {
                nextCard.classList.add('slide-from-left');
            }
        }
        
        // Update current index and navigation
        currentEventIndex = index;
        updateDotIndicators();
        
        // Reset animation flag and clean up after animation completes
        setTimeout(() => {
            if (previousCard) {
                previousCard.classList.remove('slide-out-left', 'slide-out-right');
            }
            isAnimating = false;
        }, 500);
    }
    
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
                    const direction = i > currentEventIndex ? 'right' : 'left';
                    showEvent(i, direction);
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
        if (eventsSection) {
            eventsSection.style.display = 'none';
        }
        if (eventsContainer) {
            eventsContainer.style.display = 'none';
        }
        if (eventsNavigation) {
            eventsNavigation.style.display = 'none';
        }
        if (eventsDotsContainer) eventsDotsContainer.style.display = 'none';
        if (noEventsMessage) noEventsMessage.style.display = 'none';
    }
    
    // Show error message
    function showError() {
        if (eventsSection) {
            eventsSection.style.display = '';
        }
        eventsContainer.innerHTML = `
            <div class="no-events-message" style="display: block;">
                <p>Unable to load events at this time.</p>
                <p>Please check our <a href="https://facebook.com/forgottenpawsnwa" target="_blank">Facebook page</a> for updates.</p>
            </div>
        `;
        if (eventsNavigation) {
            eventsNavigation.style.display = 'none';
        }
        if (eventsDotsContainer) eventsDotsContainer.style.display = 'none';
    }
    
    // Auto-advance functionality
    function startAutoAdvance() {
        if (upcomingEvents.length > 1) {
            stopAutoAdvance();
            autoAdvanceInterval = setInterval(() => {
                const nextIndex = (currentEventIndex + 1) % upcomingEvents.length;
                showEvent(nextIndex, 'right');
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
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (upcomingEvents.length === 0) return;
        
        if (e.key === 'ArrowLeft') {
            const prevIndex = (currentEventIndex - 1 + upcomingEvents.length) % upcomingEvents.length;
            showEvent(prevIndex, 'left');
            restartAutoAdvance();
        } else if (e.key === 'ArrowRight') {
            const nextIndex = (currentEventIndex + 1) % upcomingEvents.length;
            showEvent(nextIndex, 'right');
            restartAutoAdvance();
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