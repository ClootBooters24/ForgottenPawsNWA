# Forgotten Paws of NWA - Website

A responsive, SEO-optimized website for Forgotten Paws of NWA, a 501(c)(3) animal rescue organization in Tontitown, AR.

## Features

- **100% Responsive Design** - Mobile-first approach works on all devices
- **SEO Optimized** - Schema markup, canonical URLs, sitemap, and meta tags
- **Accessibility Compliant** - ARIA labels, semantic HTML, keyboard navigation
- **Fast Performance** - Optimized images (.webp format), lazy loading
- **Contact Forms** - Integrated with Web3Forms for volunteer, adoption, and contact forms
- **Legal Compliance** - Complete legal documentation (Terms, Privacy, Waivers)
- **Event Management** - Upcoming events section with dynamic loading

## Project Structure

```
forgottenpawsnwa.org/
├── index.html                  # Homepage
├── about.html                  # About Us page
├── contact.html                # Contact page
├── gallery.html                # Photo gallery
├── adopt.html                  # Adoption/Foster application
├── volunteer.html              # Volunteer application
├── donate.html                 # Donation page
├── 404.html                    # Custom 404 page
├── _redirects                  # URL redirects/rewrites
├── sitemap.xml                 # XML sitemap
├── js/                         # JavaScript files
│   ├── index.js               # Global JavaScript
│   ├── events.js              # Events functionality
│   ├── gallery.js             # Gallery functionality
│   ├── adopt.js               # Adoption form logic
│   └── contact.js             # Contact form handling
├── css/                        # Stylesheets
│   ├── headers.css            # Header/navigation styles
│   ├── footers.css            # Footer styles
│   ├── homepage.css           # Homepage-specific styles
│   ├── gallery.css            # Gallery styles
│   ├── contact.css            # Contact page styles
│   ├── adopt.css              # Adoption page styles
│   ├── volunteer.css          # Volunteer page styles
│   ├── donate.css             # Donation page styles
│   ├── about.css              # About page styles
│   ├── 404.css                # 404 page styles
│   ├── legal.css              # Legal pages styles
│   └── event.css              # Events styles
└── legal/                      # Legal documentation
    ├── terms.html
    ├── privacy.html
    ├── volunteer-code-of-conduct.html
    └── animal-liability.html
```

## Setup & Deployment

### Prerequisites
- Cloudflare Pages account
- Web3Forms API keys for forms
- Google Analytics/Google Tag Manager ID

### Deployment (Cloudflare Pages)

1. **Connect Repository** to Cloudflare Pages
2. **Configure Build Settings**:
   - Build command: (leave empty for static site)
   - Build output directory: `/` (root)
3. **Set Environment Variables** (if using):
   - `WEB3FORMS_API_KEY` - For contact forms
4. **Custom Domain**:
   - Configure DNS: Point `forgottenpawsnwa.org` to Cloudflare Pages
   - Enable HTTPS automatically

### Local Development

Simply open HTML files in a browser or use a local server:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

## Configuration Files

### 1. `_redirects` File
Critical for URL structure. Must be in root directory:

```bash
# 301 Redirects (remove .html from URLs)
/index.html / 301
/contact.html /contact 301
... [all other .html to clean URLs]
```

### 2. `sitemap.xml`
Located in root. Lists all pages with priority for search engines.

### 3. SEO Configuration
Each HTML file includes:
- `<title>` with page-specific titles
- `<meta name="description">` with unique descriptions
- `<link rel="canonical">` pointing to clean URLs
- Open Graph and Twitter Card meta tags
- JSON-LD structured data (Organization, AnimalShelter schemas)

## Forms Integration

The site uses **Web3Forms** for all form submissions:

1. **Contact Form** (`contact.html`) - General inquiries
2. **Adoption/Foster Form** (`adopt.html`) - Adoption applications
3. **Volunteer Form** (`volunteer.html`) - Volunteer applications

**API Keys Configuration:**
- Contact form: `access_key=""`
- Adoption form: `access_key=""`
- Volunteer form: `access_key=""`

## Media Assets

All images are hosted at `https://media.forgottenpawsnwa.org/` and:
- Use `.webp` format for better compression
- Include descriptive `alt` text for accessibility
- Have appropriate dimensions specified
- Use lazy loading for performance

## SEO Best Practices Implemented

1. **URL Structure**: Clean, human-readable URLs without `.html`
2. **Canonical Tags**: Every page specifies its canonical URL
3. **Structured Data**: JSON-LD for organization, local business, website
4. **Meta Descriptions**: Unique for each page
5. **Image Optimization**: WebP format with alt text
6. **Mobile Responsiveness**: Google Mobile-Friendly compliant
7. **Page Speed**: Optimized images, minimal render-blocking resources

## Analytics & Tracking

- **Google Analytics 4**: Tracking ID ``
- Configured with `SameSite=None;Secure` cookies for cross-domain tracking
- Page view events on all pages

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Maintenance

### Updating Content
1. **Text/Images**: Edit corresponding HTML/CSS files
2. **Events**: Update `js/events.js` with new event data
3. **Gallery**: Update `js/gallery.js` with new image URLs
4. **Legal Documents**: Edit files in `/legal/` directory

### Adding New Pages
1. Create HTML file with proper structure
2. Update navigation in all pages
3. Add to `_redirects` file if needed
4. Update `sitemap.xml`
5. Test all internal links

## Legal Compliance

The site includes:
- **Terms of Service** (`/legal/terms`)
- **Privacy Policy** (`/legal/privacy`)
- **Volunteer Code of Conduct** (`/legal/volunteer-code-of-conduct`)
- **Adoption & Foster Liability Waiver** (`/legal/animal-liability`)

All legal documents are dated and include required disclaimers.

## Common Issues & Solutions

### Issue: 404 errors for `.html` URLs
**Solution**: Ensure `_redirects` file is correctly formatted and deployed

### Issue: Duplicate content in Google Search Console
**Solution**: 
1. Verify all canonical tags point to clean URLs
2. Check all internal links use clean URLs
3. Ensure redirects are working (301 status)

### Issue: Forms not submitting
**Solution**: Check Web3Forms API keys are valid and not rate-limited

### Issue: Images not loading
**Solution**: Verify image URLs at `media.forgottenpawsnwa.org` are accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly (responsiveness, forms, links)
5. Submit pull request

## Contact & Support

- **Organization**: Forgotten Paws of NWA
- **Email**: forgottenpawsnwa@gmail.com
- **Phone**: 479-422-3577 or 479-644-7951
- **Address**: 3851 Old Highway 68, Tontitown, AR 72762
- **Developer**: [Clayton Warstler](https://ClootBooters24.github.io)

## License

© 2026 FOR LUV OF FORGOTTEN PAWS (DBA Forgotten Paws of NWA). All rights reserved.

- **EIN**: 39-4747707
- **Status**: 501(c)(3) Nonprofit Organization
- **Operation**: 100% Volunteer-Run

---

**Last Updated**: January 2026  
**Maintained by**: Clayton Warstler  
**Hosted on**: Cloudflare Pages