// This script handles cross-device synchronization
(function() {
  // Function to get URL parameters
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // Check if we should force refresh
  const forceRefresh = getParameterByName('refresh');
  
  if (forceRefresh) {
    // Clear browser cache for this site
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear localStorage timestamp to force fresh data load
    localStorage.removeItem('memory-cards-timestamp');
    localStorage.removeItem('memory-cards-last-check');
    
    // Redirect to the page without the refresh parameter
    const newUrl = window.location.href.replace(/[?&]refresh=([^&#]*)/, '');
    window.location.href = newUrl;
    return;
  }
  
  // Set up periodic check for updates
  function setupUpdateCheck() {
    // Only run if localStorage is available
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    // Store current app version
    const APP_VERSION = '1.0.1'; // Increment this when making significant changes
    localStorage.setItem('app-version', APP_VERSION);
    
    // Get stored version if any
    const storedVersion = localStorage.getItem('displayed-app-version');
    
    // If versions don't match, clear cache and refresh
    if (storedVersion && storedVersion !== APP_VERSION) {
      localStorage.setItem('displayed-app-version', APP_VERSION);
      
      // Force a hard refresh to get latest version
      window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'refresh=true';
    } else {
      localStorage.setItem('displayed-app-version', APP_VERSION);
    }
  }
  
  // Run on page load
  setupUpdateCheck();
})(); 